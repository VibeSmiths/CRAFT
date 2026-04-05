# Jobs & Workers

CRAFT uses NATS JetStream for distributed async job processing. Long-running tasks (AI generation, video rendering, pipeline orchestration) run as background workers with real-time status updates via SSE. Jobs are **channel-scoped** and available to **premium users** only.

## Architecture

```
Frontend ──SSE──> Express API ──NATS──> Worker Pool
                       ↑                    │
                  Job Manager          Process & Ack
                       ↑                    │
                  Redis Cache        Result / Error
```

Jobs appear **under channels** in the sidebar (not as a standalone section). Use the `?channelId=` query parameter on `GET /api/jobs` to filter jobs by channel.

## Workers

All Claude-using workers run as the `studio` user (not root) to support the Agent SDK. NATS consumers use wildcard subjects for user-scoped routing (e.g., `pipeline.jobs.{username}.>`).

| Worker | Task | Memory | Concurrency |
|--------|------|--------|-------------|
| `worker-orchestrate` | 8-stage pipeline orchestration with quality gates | 4G | 1 (sequential) |
| `worker-idea` | AI idea generation | 2G | 2 |
| `worker-tts` | Text-to-speech rendering + merge | 1G | 2 |
| `worker-discover` | YouTube yt-dlp discovery | 2G | 2 |
| `worker-proposals` | AI proposal generation and scoring | 2G | 2 |
| `worker-fact-check` | Content fact-checking | 2G | 2 |
| `worker-humanize` | Text humanization | 2G | 2 |
| `worker-resource-download` | Asset downloading | 1G | 3 |
| `worker-render` | Remotion MP4 export (Chromium) | 8G | 1 |

## Job Lifecycle

1. **Queued** — job submitted via API, published to NATS JetStream
2. **Running** — worker picks up the job, sends progress updates via `publishOutput()`
3. **Completed** — worker acks the message, SSE event fired to frontend
4. **Failed** — error captured, message nak'd for retry (up to 3 attempts)

## Orchestration Jobs

The `worker-orchestrate` service is special — it coordinates multi-stage pipelines by:

1. Loading the episode manifest to find the next pending stage
2. Invoking the appropriate AI agent via the Claude Agent SDK
3. Running the Producer agent for quality review
4. Writing feedback and iterating if the review fails
5. Advancing to the next stage or pausing for human intervention

Orchestration jobs have a 1-hour ack timeout to accommodate long-running agent chains. The worker runs as the `studio` user (not root) to support the Agent SDK's `--dangerously-skip-permissions` flag.

## Cancellation

Jobs can be cancelled via `POST /api/jobs/:id/cancel`. The orchestrate worker subscribes to its cancel subject and checks between stages — a cancelled pipeline stops cleanly at the next stage boundary.

## Real-Time Updates

The SSE bridge subscribes to `pipeline.>` on NATS and translates events for the frontend:

| NATS Subject | SSE Event |
|-------------|-----------|
| `pipeline.job.status.*` | `job:status` |
| `pipeline.job.output.*` | `job:output` |
| `pipeline.stage.updated.*` | `stage:updated` |
| `pipeline.state.proposals.*` | `proposals:updated` |

<SchemeImage name="jobs-panel" alt="Jobs Panel" />

::: tip
Workers are deployed as Kubernetes Deployments via the `workers` range loop in the Helm chart — they start automatically with `helm upgrade --install craft ./helm/craft`. For local dev, use `docker compose -f docker-compose.dev.yml up -d`; workers share the `craft-studio:latest` image and connect to NATS automatically.
:::
