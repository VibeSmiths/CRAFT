# Jobs & Workers

Long-running tasks in CRAFT Studio run as background jobs so the UI stays responsive. Jobs are **channel-scoped** and — except for a handful of always-on tasks like TTS and resource downloads — **premium-only**.

<SchemeImage name="jobs-panel" alt="Jobs Panel" />

## Opening the Jobs panel

Click the **channel pill** in the top chrome, then **Jobs** in the dropdown. The entry only appears for premium users (admin auto-qualifies — see [Roles](/guide/auth)).

## What runs as a job

| Job | What it does |
|-----|-------------|
| **Orchestrate** | Drives the 7-stage Episode pipeline with quality gates and feedback loops |
| **Idea** | AI idea generation in character voice |
| **Proposals** | AI-scored proposals with trend analysis |
| **Fact-check** | Claim verification across the script |
| **Humanize** | Detect and rewrite AI-sounding passages |
| **TTS** | Text-to-speech rendering and merge |
| **Discover** | YouTube research (yt-dlp) with progressive filtering |
| **Resource download** | Pull assets from the 14 sources |
| **Render** | ffmpeg composition → MP4 export |

## Lifecycle

Every job goes through the same four states you'll see in the panel:

1. **Queued** — submitted, waiting for a worker slot.
2. **Running** — a worker picked it up; progress streams live over server-sent events.
3. **Completed** — success; result is persisted (e.g. new script, rendered MP4).
4. **Failed** — error captured; failed jobs retry automatically up to three times before requiring manual intervention.

Each job row expands to show streamed output, duration, and (where applicable) a link to the produced artifact.

## Cancellation

Any running job can be cancelled from its row. Multi-stage jobs (the 7-stage pipeline) stop cleanly at the next stage boundary so they don't leave half-finished artifacts behind.

## Why jobs?

Running work off the main request path means:

- The studio stays interactive while a 20-minute video renders.
- Failures are recoverable — the job can retry, be cancelled, or kicked off again with tweaked inputs.
- Long pipelines (Episodes) can span hours without timing out anything.

## Real-time updates

While a job is running, its progress appears in two places:
- **The Jobs panel** — live-streamed output, stage updates, and status chips.
- **The panel that initiated it** — e.g. a streaming script appears in the editor as the model writes it; a generated image appears in the gallery the moment it's ready.
