# Getting Started

CRAFT Studio is a YouTube content creation platform with AI-powered idea generation, script writing, video production, audio, competitive research, and multi-source resource discovery — backed by PostgreSQL, NATS workers, and 14 specialized AI agents.

## What You Can Do

- **Generate Ideas** — AI-powered brainstorming with channel personality, or save from YouTube research
- **Write Scripts** — AI write, revise, polish with fact-checking and humanization (Claude, Gemini, Ollama)
- **Produce Videos** — 65+ Remotion components with an 8-stage pipeline orchestrated by AI agents
- **Research Competitors** — YouTube search with outlier detection, channel deep dives, and earnings estimates
- **Curate Content** — AI-scored proposals, approval workflows, and episode pipeline tracking
- **Produce Audio** — 300+ TTS voices with screenplay-aware parsing, GPU speech synthesis, and voice cloning
- **Find Resources** — Search 14 royalty-free sources for video, image, audio, and reference material
- **Track Jobs** — Async NATS workers for AI generation, rendering, and downloads with real-time SSE updates
- **Go Mobile** — Android companion app with full dashboard parity over your local network

<SchemeImage name="ideas-panel" alt="Ideas Panel" />

<SchemeImage name="channel-dive" alt="Channel Deep Dive" />

## Architecture

```
Browser ──> Express API (port 8080) ──> Docker
              |-- AI (Claude Agent SDK + Gemini + Ollama)
              |-- 14 AI Agents (research, write, storyboard, composite...)
              |-- YouTube (yt-dlp + Data API)
              |-- TTS (Edge TTS, ElevenLabs, OpenAI, OpenedAI Speech)
              |-- NATS JetStream Workers (idea, tts, discover, render...)
              |-- Multi-tenant Auth (Keycloak OIDC, role-based)
              |-- Feedback → GitHub Issues (Haiku grooming + worker)
              |-- PostgreSQL (shared with Keycloak)
              |-- Redis Caching (L1 memory → L2 Redis)
              |-- Remotion Video (65+ components, Chromium render)
              \-- GPU Services (Ollama, ComfyUI, MusicGen, RVC)

Mobile App ──> Same Express API (local network)
```

## Quick Start

The recommended deployment is **Helm on k3s** — see the [Kubernetes guide](/guide/kubernetes) for full setup.

```bash
git clone https://github.com/VibeSmiths/VideoIdeas.git
cd VideoIdeas
helm dependency update ./helm/craft
helm upgrade --install craft ./helm/craft -f helm/craft/values-dev.yaml \
  --set image.tag=$(git rev-parse --short HEAD)
```

### Local Development Alternative

For a self-contained local environment without Kubernetes:

```bash
cp app/.env.example app/.env    # Add your API keys
docker compose -f docker-compose.dev.yml up -d
```

Open the studio at `http://localhost:8080` (or `/studio` behind a reverse proxy).

::: tip
Only `GEMINI_API_KEY` is required to get started. Claude uses your Pro subscription (OAuth), and most other features work without API keys.
:::

## Next Steps

- [Setup & Installation](/guide/setup) — detailed environment configuration
- [Channels](/guide/channels) — create your first channel
- [Ideas](/guide/ideas) — start generating content ideas
