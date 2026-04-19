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

<SchemeImage name="top-chrome" alt="Top chrome — the Flow redesign layout" />

<SchemeImage name="ideas-panel" alt="Ideas Panel" />

<SchemeImage name="channel-dive" alt="Channel Deep Dive" />

## Layout

The Studio is organised around a **top chrome** — a single header bar — rather than a left sidebar. In it:

- **Logo · channel pill · peer avatars** on the left
- **Stage rail** across the middle (`Discover → Ideas → Scripts → Audio → Episodes`) — the five primary workflow stages
- **⌘K command palette** slot in the middle-right, then **Resources · Settings · Marketplace · Feedback** on the far right
- **Avatar menu** top-right (API keys, password change, theme, sign out)

Channel-scoped actions (Proposals, Jobs, channel Settings) live inside the channel-pill dropdown. See [Top chrome & ⌘K](/guide/command-palette) for the full tour.

## Architecture

```
Browser ──> Studio API ──> Studio runtime
              |-- AI (Claude Agent SDK + Gemini + Ollama)
              |-- 14 AI Agents (research, write, storyboard, composite...)
              |-- YouTube research (yt-dlp + Data API)
              |-- TTS (Edge TTS, ElevenLabs, OpenAI, OpenedAI Speech)
              |-- Background workers (idea, tts, discover, render...)
              |-- Role-based multi-tenant access
              |-- Feedback → GitHub Issues (AI grooming + worker)
              |-- Persistent storage + caching
              |-- Remotion Video (65+ components, Chromium render)
              \-- GPU Services (Ollama, ComfyUI, MusicGen, RVC)

Mobile App ──> Same Studio API (local network)
```

## Getting into the Studio

Once you're signed in, the top chrome gives you everything:

- **Channel pill** on the left — switch channels, or create your first one.
- **Stage rail** across the middle — Discover → Ideas → Scripts → Audio → Episodes.
- **⌘K** — search and navigate everything without leaving the keyboard.

::: tip
Only a Gemini or Claude API key (set in the avatar menu → API keys) is needed to start generating. Most features work without any paid keys at all.
:::

## Next steps

- [Top chrome & ⌘K](/guide/command-palette) — the shortest tour of the new layout
- [Channels](/guide/channels) — create your first channel
- [Ideas](/guide/ideas) — start generating content ideas
