# Getting Started

CRAFT Studio is a YouTube content creation platform with AI-powered idea generation, script writing, video production, audio, competitive research, and multi-source resource discovery — backed by PostgreSQL, NATS workers, and specialized AI agents.

## What You Can Do

- **Generate Ideas** — AI-powered brainstorming with channel personality, or save from YouTube research
- **Write Scripts** — AI write, revise, polish with fact-checking and humanization (Claude, Gemini, Ollama)
- **Produce Videos** — 7-stage pipeline orchestrated by AI agents, rendered with ffmpeg
- **Research Competitors** — YouTube search with outlier detection, channel deep dives, and earnings estimates
- **Curate Content** — AI-scored proposals, approval workflows, and episode pipeline tracking
- **Produce Audio** — 300+ TTS voices with screenplay-aware parsing, GPU speech synthesis, and voice cloning
- **Find Resources** — Search 14 royalty-free sources for video, image, audio, and reference material
- **Collaborate** — invite editors, video editors, and voice actors per channel; review notes pin to the timeline
- **Go Mobile** — Android companion app with full dashboard parity over your local network

<SchemeImage name="top-chrome" alt="Top chrome — the Flow redesign layout" />

<SchemeImage name="episodes-panel" alt="Episodes kanban — every show is a card moving across the pipeline" />

<SchemeImage name="channel-dive" alt="Channel Deep Dive" />

## Layout

The Studio is organised around a **top chrome** — a single header bar — rather than a left sidebar. In it:

- **Logo · channel pill** on the left
- **Ad / promo slot** between the channel pill and the search box. Free-tier users see a curated affiliate offer for creator tools (ElevenLabs, Descript, etc); active subscribers see a rotating marketplace spotlight; the slot collapses on narrow viewports.
- **⌘K command palette** slot in the middle-right
- **Stage rail** on the row below (`Discover → Proposals → Episodes → Publish`) — the workflow stages, with **Marketplace · Settings · Feedback** on the far right. Proposals only appears for premium users.
- **Avatar menu** top-right (API keys, password change, theme, sign out)

Channel settings live inside the channel-pill dropdown. Jobs are inlined as a section under Proposals. Ideas no longer has its own panel — Episodes is the single backlog (Proposals → "Create Episode" and Discover → "Inspire" both land on the kanban). See [Top chrome & ⌘K](/guide/command-palette) for the full tour.

## Architecture

```
Browser ──> Studio API ──> Studio runtime
              |-- AI (Claude Agent SDK + Gemini + Ollama)
              |-- AI Agents (research, write, storyboard, assets...)
              |-- YouTube research (yt-dlp + Data API)
              |-- TTS (Edge TTS, ElevenLabs, OpenAI, OpenedAI Speech)
              |-- Background workers (idea, tts, discover, render...)
              |-- Role-based multi-tenant access
              |-- Feedback → GitHub Issues (AI grooming + worker)
              |-- Persistent storage + caching
              |-- ffmpeg composition render
              \-- GPU Services (Ollama, MusicGen, OpenedAI Speech)

Mobile App ──> Same Studio API (local network)
```

## Getting into the Studio

Once you're signed in, the top chrome gives you everything:

- **Channel pill** on the left — switch channels, or create your first one.
- **Stage rail** across the middle — Discover → Proposals → Episodes → Publish.
- **⌘K** — search and navigate everything without leaving the keyboard.

::: tip
Ollama runs locally and is available to every user — no API key required. Add a Gemini or Claude key (avatar menu → API keys) to unlock those providers.
:::

## Next steps

- [Top chrome & ⌘K](/guide/command-palette) — the shortest tour of the new layout
- [Channels](/guide/channels) — create your first channel
- [Episodes](/guide/episodes) — your single backlog and pipeline
- [Proposals](/guide/proposals) — AI brainstorms your next episode
