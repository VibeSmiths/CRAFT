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

Ollama runs models on your local GPU — no API key needed, no internet after the model is pulled. Available whenever the Ollama service is reachable (GPU services are optional; see the deployment docs for your administrator).

### How to pull models

1. Open **Channel settings** (channel pill dropdown → Channel settings, or Settings on the right rail).
2. Scroll to the **Local AI (Ollama)** section.
3. Click a suggested model chip, or type any model name (e.g. `llama3.1:8b`) and click **Pull**.
4. Progress streams in real time; models persist across restarts.

<SchemeImage name="ollama-models" alt="Ollama model management in Settings" />

### Suggested models

| Model | Size | Best for |
|-------|------|----------|
| `qwen2.5-coder:14b` | ~9 GB | Script writing, code-aware content |
| `deepseek-r1:14b` | ~9 GB | Reasoning, fact-heavy scripts |
| `llama3.1:8b` | ~5 GB | General purpose (lower VRAM) |

### Characteristics

- Streams responses token-by-token (like Gemini)
- Fully offline once the model is downloaded
- GPU required for usable speed
- Models can be pulled and deleted from the Settings panel

::: tip VRAM requirements
14B parameter models need ~10 GB VRAM. If you have 8 GB or less, pick 7B / 8B variants instead.
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
