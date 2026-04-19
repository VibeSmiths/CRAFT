# Episodes

Episodes represent complete video productions that move through an 8-stage pipeline orchestrated by AI agents with automated quality gates. Reach Episodes from the top-chrome stage rail — **Episodes** is the rightmost stage.

<SchemeImage name="episodes-panel" alt="Episodes panel" />

## Episode detail layout

Click any episode card to open the detail view. It has three stacked sections:

- **Header** — episode title, slug, target duration, action buttons (Delete · Composition · Run Pipeline).
- **Preview** — **collapsed by default**. The header row shows a live status chip (`video ready` / `composition ready` / `not available`). Expand it only when you want to watch — that keeps the pipeline in view while you work.
- **Pipeline Stages** — one row per stage with status dot, name, status chip, and contextual actions.

<SchemeImage name="episode-detail" alt="Episode detail — collapsed preview + pipeline stages" />

## Pipeline stages

| Stage | Agent | Reviewer | Max iterations | Description |
|-------|-------|----------|----------------|-------------|
| **Research** | Researcher | Producer | 2 | Gather facts, sources, competitive analysis, define unique angle |
| **Script** | Writer | Producer | 3 | Write screenplay in channel character voice |
| **Storyboard** | Storyboarder | Producer | 2 | Plan visual sequences and scene layouts |
| **Assets** | Asset Finder | — | 1 | Find and download media resources |
| **Compositing** | Compositor | Producer | 3 | Assemble Remotion video from 65+ components |
| **Export** | Render Worker | — | 1 | Render final MP4 via Chromium (dispatched to `worker-render`) |
| **Review** | Producer | — | 1 | Holistic quality gate across all artifacts — always requires human approval |
| **Publish** | — | — | 1 | Guard on review approval, mark episode complete |

## Storyboard stage — Open editor

The storyboard stage row has a special **Open editor** button. It jumps to the [Storyboard editor](/guide/storyboard) for this episode — a dedicated UI for planning per-scene visuals, shot types, and attached image/clip resources. That's normally where you'd land rather than running the AI storyboarder directly. If the episode has a linked script, the editor auto-populates; otherwise there's a script dropdown to pick one.

## Execution modes

- **Full Pipeline** — click **Run Pipeline** in the header to execute from the next pending stage through to completion (or until a stage requires human intervention).
- **Single Stage** — click **Run** on any individual stage row to execute just that stage.

## Quality gates

The producer agent scores each stage output 1–10. Stages scoring 7+ pass automatically. Failed stages trigger a feedback loop:

1. Producer writes structured revision notes.
2. Notes are saved as stage feedback.
3. The responsible agent re-runs with the feedback context.
4. Repeat up to the stage's max iterations.

If iterations exhaust without passing, the stage is marked `needs_human` and the pipeline pauses for manual intervention.

### Upstream issues

If the producer identifies a problem originating from an earlier stage (e.g., a weak script caused by thin research), both the current stage and the upstream stage are marked `changes_requested`. The pipeline halts so a human can decide whether to re-run the upstream stage.

### Soft recovery

If an agent hits its turn limit but still produced the expected artifact (e.g., `research.md` exists), the orchestrator proceeds to review rather than hard-failing — the artifact may be good enough to pass.

## Stage statuses

| Status | Meaning | Colour |
|--------|---------|--------|
| `not_started` | Stage hasn't been run | Gray |
| `in_progress` | Agent or render currently executing | Blue (pulsing) |
| `review` | Producer is evaluating the output | Yellow |
| `complete` | Stage passed quality gate | Green |
| `approved` | Human explicitly approved (review stage) | Green |
| `changes_requested` | Feedback provided, needs re-run | Gray |
| `needs_human` | Max iterations exhausted or human gate | Pink |
| `error` | Agent or render failed | Red |

## Artifact viewers

Research, script, and storyboard rows have a chevron for viewing the produced artifact inline. The artifact is a text blob fetched from `/channels/:channelId/episodes/:episodeId/artifacts/:stage`. For **storyboard**, the artifact is a summary — the full interactive editor is behind **Open editor**.

## Composition

The header's **Composition** button opens the timeline editor for direct composition editing (Remotion composition format). Useful for fine-tuning once the AI has produced a first pass.

## Episode files

Each episode lives in `channels/{channel}/episodes/{slug}/` with:

```
manifest.yml          # Pipeline state (stage statuses + scriptId + audioProjectId)
research.md           # Research output
script.md             # Written screenplay
storyboard.md         # Visual plan (or JSON if generated)
Episode.tsx           # Remotion composition
feedback/             # Producer review notes per stage
  research.md
  script.md
  ...
output/               # Rendered video
  {slug}.mp4
```

::: tip
Episodes require NATS workers. Workers are deployed as Kubernetes Deployments in Helm (see the `workers` values section). For local dev: `docker compose -f docker-compose.dev.yml up -d`.
:::
