# Kubernetes / Helm Deployment

CRAFT deploys as a Helm chart on k3s (or any Kubernetes cluster). This is the recommended deployment method for production and local use with Keycloak SSO.

::: tip Local Development
For quick local development without Kubernetes, see [Local Dev (Docker Compose)](./setup).
:::

## Prerequisites

| Component | Purpose |
|-----------|---------|
| **k3s** | Lightweight Kubernetes (or any k8s cluster) |
| **Helm 3** | Package manager for Kubernetes |
| **Docker** | Build container images |
| **nginx-ingress** | Ingress controller for HTTP routing |

### Install k3s + Helm

```bash
# Install k3s with Docker runtime
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--docker --write-kubeconfig-mode=644 --disable=traefik" sh -
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Install Helm
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install nginx-ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace \
  --set controller.service.type=ClusterIP \
  --set controller.service.externalIPs[0]=<YOUR_LAN_IP> \
  --set controller.admissionWebhooks.enabled=false
```

## Quick Deploy

The all-in-one script builds images, imports them into k3s, and deploys via Helm:

```bash
sudo bash scripts/k3s-deploy.sh
```

Or step by step:

```bash
# 1. Build images
docker compose -f docker-compose.dev.yml build studio frontend

# 2. Import into k3s containerd
TAG=$(git rev-parse --short HEAD)
for svc in studio frontend; do
  docker tag craft-$svc:latest ghcr.io/vibesmiths/videoideas/$svc:$TAG
  docker save ghcr.io/vibesmiths/videoideas/$svc:$TAG | \
    sudo k3s ctr -a /run/containerd/containerd.sock images import -
done

# 3. Deploy with Helm
helm upgrade --install craft ./helm/craft \
  -f helm/craft/values-dev.yaml \
  --set image.tag=$TAG
```

## Configuration

### values-dev.yaml

Create `helm/craft/values-dev.yaml` for your environment:

```yaml
global:
  hostname: your-hostname.example.com
  externalIP: "192.168.x.x"  # Your LAN IP

secrets:
  encryptionKey: ""  # 64-char hex for API key encryption

auth:
  keycloak:
    enabled: true
  oauth2Proxy:
    enabled: true

ingress:
  enabled: true

tls:
  local:
    enabled: true  # Self-signed certs for local HTTPS
```

### Key Helm Values

| Value | Purpose | Default |
|-------|---------|---------|
| `global.hostname` | DNS name for all URLs | `localhost` |
| `global.externalIP` | LAN IP for service externalIPs | `""` |
| `secrets.encryptionKey` | AES-256 key for user API keys (64 hex chars) | `""` |
| `image.tag` | Docker image tag (usually git SHA) | `latest` |
| `auth.keycloak.enabled` | Enable Keycloak SSO | `false` |
| `gpu.enabled` | Deploy GPU services (Ollama, ComfyUI, etc.) | `false` |
| `gpu.runtime` | GPU runtime: `nvidia`, `rocm`, or `cpu` | `nvidia` |

## GPU Services

Enable GPU-accelerated services (Ollama, OpenedAI Speech, MusicGen, ComfyUI, RVC):

```yaml
# In values-dev.yaml
gpu:
  enabled: true
  runtime: nvidia  # or rocm, cpu
```

Then upgrade:

```bash
helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml
```

Check GPU pod status:

```bash
kubectl get pods -l app.kubernetes.io/instance=craft | grep -E 'ollama|comfyui|musicgen|speech|rvc'
```

## Authentication

CRAFT uses Keycloak for SSO with oauth2-proxy as ForwardAuth.

### Default Users

| User | Password | Roles |
|------|----------|-------|
| `localdev` | `welcome` | admin + premium |
| `admin` | `admin` | admin + premium |

### Keycloak Admin Console

Access at `https://<hostname>/auth/` with admin/admin.

::: warning Audience Mapper
The `craft-studio` Keycloak client **must** have an `oidc-audience-mapper` protocol mapper with `included.client.audience` = `craft-studio`. Without this, oauth2-proxy returns 500 on login. The Helm chart includes this in the realm import, but if Keycloak was deployed before this was added, add the mapper manually via the admin console.
:::

### API Keys

Users manage their own API keys via the profile avatar menu. Keys are encrypted (AES-256-GCM) in PostgreSQL. For Claude Pro/Max, paste the full contents of `~/.claude/.credentials.json` (includes refresh token).

## Common Operations

### Update after code changes

```bash
# Rebuild + import + helm upgrade
sudo bash scripts/k3s-deploy.sh

# Or just rebuild studio and restart
docker compose -f docker-compose.dev.yml build studio
TAG=$(kubectl get deployment craft-studio -o jsonpath='{.spec.template.spec.containers[0].image}' | sed 's/.*://')
docker tag craft-studio:latest ghcr.io/vibesmiths/videoideas/studio:$TAG
sudo docker save ghcr.io/vibesmiths/videoideas/studio:$TAG | \
  sudo k3s ctr -a /run/containerd/containerd.sock images import -
kubectl delete pod -l app.kubernetes.io/component=studio
```

### View logs

```bash
# Studio API server
kubectl logs -l app.kubernetes.io/component=studio -f

# Orchestrate worker
kubectl logs -l app.kubernetes.io/component=worker-orchestrate -f

# All pods
kubectl get pods -l app.kubernetes.io/instance=craft
```

### Tear down

```bash
helm uninstall craft
```

## Pipeline Workers

Workers run as Kubernetes Deployments. Workers that use the Claude Agent SDK (`needsClaude: true`) run as the `studio` user (UID 1001) with explicit PATH and HOME environment variables.

| Worker | needsClaude | Memory |
|--------|-------------|--------|
| orchestrate | yes | 4Gi |
| idea | yes | 2Gi |
| proposals | yes | 2Gi |
| fact-check | yes | 2Gi |
| humanize | yes | 2Gi |
| tts | no | 1Gi |
| discover | no | 2Gi |
| render | no | 8Gi |
| resource-download | no | 1Gi |

### Pipeline Configuration

Per-channel pipeline settings (maxTurns, budgetUsd) are configurable in channel Settings under "Pipeline Configuration". These override the defaults in the orchestrate worker.

## Architecture

```
                        ┌─────────────┐
                   ┌───►│  Frontend   │ (nginx SPA)
                   │    └─────────────┘
┌──────────┐      │    ┌─────────────┐    ┌────────────┐
│  Ingress │──────┼───►│   Studio    │───►│ PostgreSQL │
│ (nginx)  │      │    │  (Express)  │    └────────────┘
└──────────┘      │    └──────┬──────┘    ┌────────────┐
                   │           │     ├────►│   Redis    │
┌──────────┐      │           │     │     └────────────┘
│ Keycloak │◄─────┤           ▼     │     ┌────────────┐
└──────────┘      │    ┌──────────┐ ├────►│    NATS    │
                   │    │ Workers  │ │     └────────────┘
┌──────────┐      │    │ (9 pods) │ │
│oauth2-prx│◄─────┘    └──────────┘ │     ┌────────────┐
└──────────┘                   │     └────►│ MCP Servers│
                               │           └────────────┘
                               ▼
                        ┌─────────────┐
                        │ GPU Services│ (optional)
                        │ Ollama, etc │
                        └─────────────┘
```
