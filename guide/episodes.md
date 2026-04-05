# Episodes

Episodes represent complete video productions that move through an 8-stage content pipeline, fully orchestrated by AI agents with automated quality gates.

## Pipeline Stages

Each episode progresses through these stages sequentially. The `worker-orchestrate` service coordinates execution, invoking specialized agents and managing feedback loops automatically.

| Stage | Agent | Reviewer | Max Iterations | Description |
|-------|-------|----------|----------------|-------------|
| **Research** | Researcher | Producer | 2 | Gather facts, sources, competitive analysis, define unique angle |
| **Script** | Writer | Producer | 3 | Write screenplay in channel character voice |
| **Storyboard** | Storyboarder | Producer | 2 | Plan visual sequences and scene layouts |
| **Assets** | Asset Finder | — | 1 | Find and download media resources (stock footage, images, audio) |
| **Compositing** | Compositor | Producer | 3 | Assemble Remotion video composition from 65+ components |
| **Export** | Render Worker | — | 1 | Render final MP4 via Chromium (dispatched to `worker-render`) |
| **Review** | Producer | — | 1 | Holistic quality gate across all artifacts — always requires human approval |
| **Publish** | — | — | 1 | Guard on review approval, mark episode complete |

## Execution Modes

- **Full Pipeline** — click "Run Pipeline" to execute from the next pending stage through to completion (or until a stage requires human intervention)
- **Single Stage** — click "Run" on any individual stage to execute just that stage

## Quality Gates

The producer agent scores each stage output 1-10. Stages scoring 7+ pass automatically. Failed stages trigger a feedback loop:

1. Producer writes structured revision notes
2. Notes are saved as stage feedback
3. The responsible agent re-runs with the feedback context
4. This repeats up to the stage's max iterations

If max iterations are exhausted without passing, the stage is marked `needs_human` and the pipeline pauses for manual intervention.

### Upstream Issues

If the producer identifies a problem originating from an earlier stage (e.g., a weak script caused by thin research), both the current stage and the upstream stage are marked `changes_requested`. The pipeline halts so a human can decide whether to re-run the upstream stage.

### Soft Recovery

If an agent hits its turn limit but still produced the expected artifact (e.g., `research.md` exists), the orchestrator proceeds to review rather than hard-failing — the artifact may be good enough to pass.

## Stage Statuses

| Status | Meaning | Color |
|--------|---------|-------|
| `not_started` | Stage hasn't been run | Gray |
| `in_progress` | Agent or render currently executing | Blue (pulsing) |
| `review` | Producer is evaluating the output | Yellow |
| `complete` | Stage passed quality gate | Green |
| `approved` | Human explicitly approved (review stage) | Green |
| `changes_requested` | Feedback provided, needs re-run | Gray |
| `needs_human` | Max iterations exhausted or human gate | Pink |
| `error` | Agent or render failed | Red |

<SchemeImage name="episodes-panel" alt="Episodes Panel" />

## Episode Files

Each episode lives in `channels/{channel}/episodes/{slug}/` with:

```
manifest.yml          # Pipeline state (stage statuses)
research.md           # Research output
script.md             # Written screenplay
storyboard.md         # Visual plan
Episode.tsx           # Remotion composition
feedback/             # Producer review notes per stage
  research.md
  script.md
  ...
output/               # Rendered video
  {slug}.mp4
```

::: tip
Episodes require NATS workers to be running. Workers are deployed as Kubernetes Deployments in Helm (see the `workers` values section). For local dev: `docker compose -f docker-compose.dev.yml up -d`.
:::
