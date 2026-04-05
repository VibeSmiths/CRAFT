# Setup & Installation

::: tip Recommended Deployment
The preferred way to run CRAFT is on **Helm/k3s**. See the [Kubernetes guide](/guide/kubernetes) for full setup including Keycloak SSO, ingress, and GPU services. Docker Compose is available as a [local development](#local-development-docker-compose) alternative.
:::

## Prerequisites

- [Git](https://git-scm.com/downloads)
- **For Helm/k3s**: [k3s](https://k3s.io/) and [Helm 3](https://helm.sh/docs/intro/install/)
- **For local dev**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, Mac, or Linux)

## Helm / Kubernetes (Recommended)

```bash
# Clone the repository
git clone https://github.com/VibeSmiths/VideoIdeas.git
cd VideoIdeas

# Deploy via Helm (see /guide/kubernetes for values setup)
helm dependency update ./helm/craft
helm upgrade --install craft ./helm/craft -f helm/craft/values-dev.yaml \
  --set image.tag=$(git rev-parse --short HEAD)
```

| Action | Command |
|--------|---------|
| Apply config changes | `helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml` |
| View logs | `kubectl logs -l app.kubernetes.io/component=studio` |
| Restart studio | `kubectl rollout restart deployment/craft-studio` |

## Local Development (Docker Compose)

For a self-contained local environment with no external dependencies. Auth is bypassed automatically (`NODE_ENV=development` defaults to `alex` with admin+premium roles).

```bash
# Configure API keys
cp app/.env.example app/.env
# Edit app/.env with your keys (see Configuration below)

# Start everything (studio + MCP servers + PostgreSQL)
docker compose -f docker-compose.dev.yml up -d

# Open in browser
open http://localhost:3000
```

| Action | Command |
|--------|---------|
| Apply `.env` changes | `docker compose -f docker-compose.dev.yml up -d studio` (no rebuild needed) |
| Apply code changes | `docker compose -f docker-compose.dev.yml build studio && docker compose -f docker-compose.dev.yml up -d studio` |
| View logs | `docker compose -f docker-compose.dev.yml logs studio --tail 50` |

### API Keys

| Key | Required | Purpose | Get it at |
|-----|----------|---------|-----------|
| `GEMINI_API_KEY` | Recommended | AI idea generation, script writing (default AI) | [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key) |
| `ANTHROPIC_API_KEY` | Optional | Claude AI via Agent SDK — Pro subscription uses OAuth (key optional) | [Anthropic Console](https://console.anthropic.com/) |
| `YOUTUBE_API_KEY` | Optional | Enhances Discover with channel stats & video analytics | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `ELEVENLABS_API_KEY` | Optional | Premium TTS voice generation & cloning | [ElevenLabs Settings](https://elevenlabs.io/app/settings/api-keys) |
| `OPENAI_API_KEY` | Optional | OpenAI TTS HD voice generation | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `PEXELS_API_KEY` | Optional | Stock video/image search | [Pexels API](https://www.pexels.com/api/key/) |
| `PIXABAY_API_KEY` | Optional | Stock video/image/music search | [Pixabay API](https://pixabay.com/api/docs/) |
| `FREESOUND_API_KEY` | Optional | Sound effect search | [Freesound API](https://freesound.org/apiv2/apply/) |
| `UNSPLASH_ACCESS_KEY` | Optional | High-quality stock images | [Unsplash Developers](https://unsplash.com/developers) |
| `EUROPEANA_API_KEY` | Optional | European cultural heritage media | [Europeana APIs](https://apis.europeana.eu/) |
| `GITHUB_TOKEN` | Optional | Submit feedback as GitHub Issues | [GitHub Tokens](https://github.com/settings/tokens) |

::: tip Which keys do I need?
At minimum, you need **one AI provider** (Gemini recommended — free tier is generous). Everything else is optional — the app gracefully disables features when keys are missing.
:::

**Free services (no API key needed):**
- **Edge TTS** — 300+ Microsoft Neural voices for audio generation
- **NASA, Wikipedia, arXiv, Smithsonian, Library of Congress, Internet Archive, Wikimedia Commons, Met Museum** — 8 free resource search sources
- **YouTube Discover** — works without an API key via yt-dlp search

::: info Claude Pro Users
The Agent SDK uses your Claude Pro OAuth credentials (`~/.claude/.credentials.json`), not API credits. `ANTHROPIC_API_KEY` is optional — if present, it's cleared in Docker so the CLI falls back to OAuth. No separate billing needed.
:::

### Other Settings

```env
CHANNELS_DIR=/channels          # Where channel data is stored (Docker volume)
PORT=8080                       # Server port
DISCOVER_TIMEOUT_MS=45000       # Max time for Discover filter loop
```

## Verify

Check the boot banner in logs:

```bash
# Helm
kubectl logs -l app.kubernetes.io/component=studio -f

# Docker Compose (local dev)
docker compose -f docker-compose.dev.yml logs studio -f
```

You'll see checkmarks for configured services and X marks for missing keys:

```
────────────────────────────────────────
  CRAFT Studio v1.0
────────────────────────────────────────
  ✔ Claude (Agent SDK / OAuth)
  ✔ Gemini
  ✔ ElevenLabs TTS
  ✔ Edge TTS (free)
  ✔ Pexels
  ✔ SearXNG (Web Search)
  ✗ OpenAI TTS (no key)
────────────────────────────────────────
  Listening on http://localhost:8080
────────────────────────────────────────
```

## GPU-Accelerated Services (Optional)

If you have an NVIDIA GPU, enable local AI, TTS, music generation, image generation, and voice cloning.

**Helm**: Set in your `values-dev.yaml`:

```yaml
gpu:
  enabled: true
  runtime: nvidia  # or rocm, cpu
```

Then upgrade: `helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml`

**Docker Compose (local dev)**:

```bash
docker compose -f docker-compose.dev.yml --profile gpu up -d
```

| Service | Port | Purpose |
|---------|------|---------|
| `ollama` | 11434 | Local LLM (Qwen, DeepSeek, Llama, etc.) |
| `openedai-speech` | 8000 | Local TTS — OpenAI-compatible, no API key |
| `musicgen` | 8001 | AI background music from text prompts |
| `comfyui` | 8188 | AI image generation (Stable Diffusion) |
| `rvc` | 5050 | Voice cloning (RVC v2) — upload samples, train externally, convert TTS |

All models are stored in `./models/<service>/` (bind-mounted, visible on your host filesystem). No API keys needed for any GPU service.

::: tip CPU-Only Users
GPU services are completely optional. Omitting `gpu.enabled: true` (Helm) or the `--profile gpu` flag (Docker Compose) skips all GPU services. Features hide automatically when services aren't available.
:::

### Pulling Ollama Models

After starting GPU services, pull a model from Settings:

1. Open any channel's **Settings** (gear icon)
2. Scroll to **Local AI (Ollama)**
3. Click a quick-pull chip or type a model name
4. Wait for download (7-14 GB per model)
5. Model appears in the AI dropdown immediately

### GPU Service Requirements

- NVIDIA GPU with CUDA support
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) installed
- Docker Desktop with GPU support enabled
- Minimum 8 GB VRAM recommended (16 GB for 14B parameter models)

## Services

### Core Services (always running)

| Service | Port | Purpose |
|---------|------|---------|
| `studio` | 8080 | Content Studio app (React + Express) |
| `searxng` | — | Self-hosted meta-search engine (internal network) |
| `storytelling` | 3001 | Storytelling craft MCP server |
| `comedy` | 3003 | Comedy technique MCP server |
| `yt-dlp` | 3004 | YouTube metadata/download MCP server |

In Helm, MCP servers are deployed as Kubernetes Deployments via the `mcp` values range loop. In local dev, they run as Docker Compose services. Claude Code (via `.mcp.json`) connects to the same running services in both cases.

A `SessionStart` hook in `.claude/settings.json` automatically runs `docker compose -f docker-compose.dev.yml up -d` when Claude Code launches in local dev, so the MCP servers are always available.

## Architecture

```
app/
  frontend/            React 18 + TypeScript + Vite + Tailwind + Zustand
  backend/             Node.js + Express + TypeScript
  Dockerfile           Multi-stage build (frontend → backend → runtime)
  mcp-internal.json    MCP config for Docker network (HTTP transport)
  .env                 API keys (runtime passthrough, not in image)

channels/              Channel data (Docker volume mount)
  {channel-id}/
    channel.json       Channel config (character, topics, voice settings)
    CLAUDE.md          Auto-generated character context for CLI terminal
    ideas/             Idea JSON files
    scripts/           Markdown files with YAML frontmatter
    audio/             Audio project dirs (project.json + section MP3s)
    resources/         Downloaded + uploaded media (organized by script)

servers/               MCP servers (see MCP Guide)
docker-compose.yml     All services — studio + MCP servers
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express, TypeScript |
| AI | Gemini (Google AI SDK), Claude (Agent SDK + OAuth), Ollama (local GPU) |
| TTS | Edge TTS (free), ElevenLabs, OpenAI, OpenedAI Speech (local GPU) |
| Music | MusicGen / AudioCraft (text-to-music, local GPU) |
| Images | ComfyUI + Stable Diffusion (text-to-image, local GPU) |
| Audio | ffmpeg (merge, silence, trimming, conversion) |
| Video | yt-dlp (search, metadata, downloads, transcripts) |
| Resources | 13 sources — 5 with API key, 8 free |
| Storage | PostgreSQL 17 (shared with Keycloak), audio/media files on disk |
| MCP | @modelcontextprotocol/sdk — HTTP transport via Docker |

## Development

### Testing

Backend unit tests use [Vitest](https://vitest.dev/):

```bash
cd app/backend
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests cover:
- **fileStore** — CRUD operations for channels, ideas, scripts, audio projects
- **TTS parsing** — script section parsing (screenplay, structural, paragraph), text naturalization
- **YouTube filters** — video conversion, duration/date/outlier filters, channel filters
- **GPU services** — provider routing, ComfyUI workflow builder, aspect ratios, service config validation

### Pre-commit Hook

A git pre-commit hook runs `npm test` before each commit. If tests fail, the commit is blocked.

### CI Pipeline

Tests and typecheck run automatically in CI. Coverage results are posted to the PR summary.

### Publishing Docs

The documentation site auto-deploys to [vibesmiths.github.io/CRAFT](https://vibesmiths.github.io/CRAFT/) on push to main via CI.

Manual deployment:

```bash
cd docs && npm run build
cd .vitepress/dist
git init && git checkout -b gh-pages
git add -A && git commit -m "docs: deploy CRAFT site"
git remote add origin https://github.com/VibeSmiths/CRAFT.git
git push -f origin gh-pages
```

## Updating

**Helm**:
```bash
git pull
bash scripts/build.sh studio
helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml \
  --set image.tag=$(git rev-parse --short HEAD)
```

**Docker Compose (local dev)**:
```bash
git pull
docker compose -f docker-compose.dev.yml build studio
docker compose -f docker-compose.dev.yml up -d studio
```

::: info
The `.env` file is runtime-only — it's never baked into the Docker image. Changes take effect on restart without rebuilding.
:::

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Change `ports` in `docker-compose.dev.yml` (local dev) or ingress port in `values-dev.yaml` |
| Claude models not showing | Ensure `~/.claude/.credentials.json` exists (login to Claude Code first) |
| yt-dlp errors | Rebuild studio image — yt-dlp updates frequently |
| Edge TTS fails | Check pod/container has internet access; Edge TTS needs Microsoft endpoints |
| Resource preview stuck | Backend proxy caches in `.tmp-preview/` — clear the directory |
| MCP servers not connecting | Helm: check `kubectl get pods`; local dev: run `docker compose -f docker-compose.dev.yml up -d` |
| GPU services not showing | Helm: set `gpu.enabled: true` in values + upgrade; local dev: add `--profile gpu` |
| Ollama no models | Pull from Settings → Local AI (Ollama) → click a suggested model |
| ComfyUI no checkpoints | Place `.safetensors` files in `./models/comfyui/checkpoints/` |
| MusicGen build fails | Ensure internet access; the image downloads PyTorch + audiocraft |
| MusicGen slow first start | HuggingFace models (~2 GB) download on first use; cached in `./models/musicgen/` for subsequent starts |
| RVC slow first start | Base models (~700 MB) download on first boot; cached in `./models/rvc/base_model/` |
