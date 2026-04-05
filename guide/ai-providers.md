# AI Providers

CRAFT supports three AI providers. All can be active simultaneously — choose per-request from the model dropdown.

## Gemini (Google)

**Setup**: Add `GEMINI_API_KEY` to `app/.env`

Get a key at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key).

**Models available**: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash, and newer

**Characteristics**:
- Streams responses token-by-token (real-time)
- Reliable with standard API keys
- Good for quick iterations

## Claude (Anthropic)

**Setup**: Claude uses the [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/typescript) which authenticates via your **Claude Pro subscription** (OAuth), not a separate API key.

### Requirements

1. [Claude Code](https://claude.ai/code) installed and logged in on your machine
2. OAuth credentials at `~/.claude/.credentials.json` (created automatically by Claude Code login)

::: warning No API Credits Needed
Unlike the raw Anthropic API, the Agent SDK uses your Pro subscription. The `ANTHROPIC_API_KEY` in `.env` is intentionally cleared in Docker so the SDK falls back to OAuth.
:::

### How It Works

```
Your machine (~/.claude/) ──mount──→ Docker container
                                         │
                    Agent SDK spawns Claude Code CLI
                                         │
                    CLI authenticates via OAuth (Pro)
                                         │
                    MCP servers available (storytelling, comedy, etc.)
```

**Models available**: claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5, and older

**Characteristics**:
- Responses arrive as a single block (not streamed) — the SDK filters out MCP planning text
- May use MCP research tools for richer responses (especially Opus)
- Excellent for complex script writing and fact-checking

## Ollama (Local LLM)

**Setup**: Enable GPU services in your deployment.

**Helm**: Set `gpu.enabled: true` and `gpu.runtime: nvidia` (or `rocm`) in `values-dev.yaml`, then upgrade:
```bash
helm upgrade craft ./helm/craft -f helm/craft/values-dev.yaml
```
Check the Ollama pod is running: `kubectl get pods -l app.kubernetes.io/component=ollama`

**Docker Compose (local dev)**: `docker compose -f docker-compose.dev.yml --profile gpu up -d`

No API key needed — models run entirely on your local GPU.

**How to pull models**:
1. Open **Settings** (gear icon on any channel)
2. Scroll to **Local AI (Ollama)** section
3. Click a suggested model chip (Qwen 2.5 Coder 14B or DeepSeek R1 14B)
4. Or type any model name (e.g. `llama3.1:8b`) and click **Pull**
5. Progress shows in real-time; models persist across restarts in `./models/ollama/`

**Suggested models**:

| Model | Size | Best For |
|-------|------|----------|
| `qwen2.5-coder:14b` | ~9 GB | Script writing, code-aware content |
| `deepseek-r1:14b` | ~9 GB | Reasoning, fact-heavy scripts |
| `llama3.1:8b` | ~5 GB | General purpose (lower VRAM) |

**Characteristics**:
- Streams responses token-by-token (like Gemini)
- Fully offline — no internet needed after model download
- GPU required for usable speed (CPU inference is very slow)
- Models can be pulled and deleted from the Settings panel

::: tip VRAM Requirements
14B parameter models need ~10 GB VRAM. If you have 8 GB or less, use 7B/8B variants instead.
:::

<SchemeImage name="ollama-models" alt="Ollama model management in Settings" />

## Model Selection

The model dropdown appears in:
- Script Editor AI toolbar
- AI Chat panel
- Idea generation modal
- Mobile app script detail

All three providers show in the same dropdown when configured, grouped by provider (Claude, Gemini, Ollama). Disabled providers show a reason (e.g., "No API credits", "Service error").

## Comparison

| Feature | Gemini | Claude | Ollama |
|---------|--------|--------|--------|
| Auth | API key | OAuth (Pro subscription) | None (local) |
| Streaming | Yes (token-by-token) | No (buffered response) | Yes (token-by-token) |
| MCP Tools | No | Yes (storytelling, comedy, etc.) | No |
| Speed | Fast | Slower (multi-turn possible) | Depends on GPU |
| Cost | API credits | Included in Pro | Free (your hardware) |
| Internet | Required | Required | Not needed (after model pull) |
