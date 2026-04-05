# MCP Research Projects

Workspace for researching topics and building MCP (Model Context Protocol) servers. Each research topic evolves into a self-contained MCP server under `servers/`.

## Quick Start

### Create a New MCP Server
```bash
bash scripts/new-mcp.sh <server-name> "Human Readable Title"
# Example:
bash scripts/new-mcp.sh chess-openings "Chess Openings"
```
This will:
1. Copy `_template/` to `servers/<server-name>/`
2. Replace placeholders with your server name and title
3. Add a service entry to `docker-compose.dev.yml` (local dev)
4. Add the MCP entry to `helm/craft/values.yaml` `mcp:` section (Helm deploys it as a Deployment + Service)
5. Register it in `.mcp.json` for Claude Code auto-discovery
6. Build the Docker image

### Build All Servers
```bash
bash scripts/build.sh   # builds all, tags with git SHA, pushes to GHCR
```

### Build a Single Server (local dev)
```bash
docker compose -f docker-compose.dev.yml build <server-name>
```

### Deploy to Kubernetes (Helm)

MCP servers are deployed via the `mcp` range loop in the Helm chart. Add or update entries in `values.yaml`:

```yaml
mcp:
  - name: chess-openings
    image: ghcr.io/vibesmiths/chess-openings-mcp:latest
    port: 3005
```

Then upgrade: `helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml`

### Test a Server Manually
```bash
docker run --rm -i <server-name>-mcp:latest
```

## Layout

| Path | Purpose |
|------|---------|
| `servers/` | Each subfolder is a standalone MCP server (TypeScript + Docker) |
| `_template/` | Scaffold template copied by `new-mcp.bat` |
| `research/` | Raw notes and scratch work |
| `docker-compose.dev.yml` | Local dev compose file — one service per MCP server |
| `.mcp.json` | Claude Code MCP server registry (auto-loaded) |
| `.claude/settings.local.json` | Allowed permissions for Claude |

## MCP Server Architecture

Each server under `servers/` follows this structure:
```
servers/<name>/
  src/
    index.ts       — Entry point: McpServer + stdio/HTTP transport
    tools/         — One file per tool domain (registerXxxTools function)
    data/          — TypeScript constants (the knowledge base)
  package.json     — @modelcontextprotocol/sdk, express, zod
  tsconfig.json    — ES2022, Node16, strict
  Dockerfile       — Multi-stage node:22-alpine
```

### Conventions
- Tools use `server.registerTool()` with Zod input schemas
- All tools have `annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }`
- Tool names prefixed with topic: `<prefix>_<action>` (e.g., `chess_get_opening`)
- Tool registration is modular: one `register*Tools(server)` per file in `src/tools/`
- Data in `src/data/` as exported TypeScript constants
- Transport defaults to stdio; Claude Code connects via `docker run --rm -i <image>`

### Adding a Tool to an Existing Server
1. Add data in `src/data/<domain>.ts`
2. Create `src/tools/<domain>.ts` with `registerXxxTools(server: McpServer)`
3. Import and call the register function in `src/index.ts`
4. Rebuild (local dev): `docker compose -f docker-compose.dev.yml build <server-name>`
5. Rebuild + deploy (Helm): `bash scripts/build.sh <server-name>` then `helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml --set image.tag=$(git rev-parse --short HEAD)`
