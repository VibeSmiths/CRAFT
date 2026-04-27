# AI Providers

CRAFT Studio supports three AI providers. All can be active at once — pick per-request from the model dropdown. API keys are **per-user** and stored encrypted on the server — set them in **Avatar menu → API Keys**.

## Gemini (Google)

Paste a Gemini API key in the API Keys modal (`GEMINI_API_KEY`).

Get a key at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key).

**Characteristics**

- Streams responses token-by-token (real-time)
- Reliable with standard API keys
- Good for quick iterations
- Free tier is usually enough to explore the studio

## Claude (Anthropic)

Claude uses the Agent SDK and authenticates via a **long-lived OAuth token**, not a paid API key. Generate a token at [claude.ai/settings/tokens](https://claude.ai/settings/tokens) and paste it into the API Keys modal as `CLAUDE_CODE_OAUTH_TOKEN`.

::: tip No API credits needed
Unlike the raw Anthropic API, the Agent SDK uses your Claude subscription. Premium users get the full Claude model family (Opus, Sonnet, Haiku) plus MCP tool access when a token is saved.
:::

**Characteristics**

- The SDK may use MCP research tools (storytelling, comedy, etc.) during multi-turn generation
- Responses arrive as a single block (not streamed) — intermediate planning is filtered out
- Excellent for complex script writing and fact-checking

## Ollama (Local LLM)

Ollama runs models on your local GPU — no API key needed, no internet after the model is pulled. CRAFT picks up whatever models are loaded on the Ollama server it's pointed at; the model picker shows them automatically in an "Ollama (Free)" optgroup. Available whenever the Ollama service is reachable (GPU services are optional; see the deployment docs for your administrator).

::: tip Auto-pull on first boot
The Ollama container auto-pulls `qwen2.5:1.5b` if no models exist when it starts, so a fresh deploy boots with at least one usable local model. The recommended default is `qwen2.5:7b` (~4.7 GB, 128 k context) for script writing — pull it once and it stays available.
:::

### Pulling additional models

There's no in-app pull UI today — model management is an operator task. Pick whichever path matches your deploy:

**k3s / Helm**
```bash
kubectl exec -n default deploy/craft-ollama -- ollama pull qwen2.5:7b
kubectl exec -n default deploy/craft-ollama -- ollama list
```

**docker compose**
```bash
docker compose exec ollama ollama pull qwen2.5:7b
docker compose exec ollama ollama list
```

**Local Ollama (dev outside Docker)**
```bash
ollama pull qwen2.5:7b
```

Pulled models persist across container restarts as long as the Ollama volume is mounted (`./models/ollama:/root/.ollama` in compose, the `ollama-models` PVC in Helm).

### Suggested models

| Model | Size | Best for |
|-------|------|----------|
| `qwen2.5:7b` | ~4.7 GB | **Recommended default** — script writing, 128 k context |
| `qwen2.5-coder:14b` | ~9 GB | Code-aware scripts, reasoning |
| `deepseek-r1:14b` | ~9 GB | Reasoning, fact-heavy scripts |
| `llama3.1:8b` | ~5 GB | General purpose (lower VRAM) |
| `qwen2.5:1.5b` | ~986 MB | Auto-pulled fallback — fast but limited output |

### Characteristics

- Streams responses token-by-token (like Gemini)
- Fully offline once the model is downloaded
- GPU required for usable speed
- Available to every user — Ollama models appear in the dropdown's "Ollama (Free)" optgroup whether or not the user has any API keys configured

::: tip VRAM requirements
14 B parameter models need ~10 GB VRAM. If you have 8 GB or less, pick 7 B / 8 B variants instead.
:::

## Model selection

The model dropdown appears in:

- The Script editor's Revise tab
- AI chat
- The Ideas panel's inline context hint
- The mobile app's script detail

All three providers show in the same dropdown when configured, grouped by provider. Providers that aren't set up for your account are disabled with a reason (e.g. "No API credits", "Service unavailable").

## Comparison

| Feature | Gemini | Claude | Ollama |
|---------|--------|--------|--------|
| Auth | API key | OAuth token | None (local) |
| Streaming | Yes (token-by-token) | No (buffered) | Yes (token-by-token) |
| MCP tools | No | Yes | No |
| Speed | Fast | Multi-turn possible | Depends on GPU |
| Cost | API credits | Included with Claude subscription | Free (your hardware) |
| Internet | Required | Required | Not needed after pull |
