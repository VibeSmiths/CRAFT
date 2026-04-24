# AI Agents

CRAFT uses specialized AI agents that collaborate through the content pipeline. Each agent has a defined role, structured output format, and quality expectations. Agents are invoked via the Claude Agent SDK with full tool access (Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch).

## Pipeline Agents

These agents are directly wired into the 7-stage orchestration pipeline:

| Agent | Pipeline Stage | Tools | Output |
|-------|---------------|-------|--------|
| **Researcher** | Research | Web search, file read/write | `research.md` — sources, data, competitive analysis, unique angle |
| **Writer** | Script | File read/write | `script.md` — screenplay in channel character voice |
| **Storyboarder** | Storyboard | File read/write | `storyboard.md` — visual sequences, scene layouts, timing |
| **Asset Finder** | Assets | Web search, file tools | Downloads media resources to episode directory |
| **Producer** | Review (all stages) | Read-only | Structured JSON: score (1-10), pass/fail, feedback, upstream issues |

## Support Agents

These agents handle tasks outside the main pipeline:

| Agent | Role |
|-------|------|
| **Content Architect** | Episode structure and outline generation |
| **Brand Designer** | Visual branding and identity |
| **Trend Analyst** | Trend identification and scoring |
| **Channel Wizard** | Channel setup and onboarding |
| **Curator** | Content proposal evaluation |
| **Discovery** | YouTube trend discovery |
| **Idea Router** | Idea classification and channel routing |
| **Channel Strategist** | Long-form channel growth analysis |

## How Agents Execute

1. The `worker-orchestrate` service determines the next stage to run
2. It loads the agent definition from `app/agents/{name}.md`
3. Builds a prompt with episode context (channel, episode dir, iteration, prior feedback)
4. Invokes the Claude Agent SDK with `--dangerously-skip-permissions` (agents run in Docker)
5. The agent reads the episode directory, does its work, writes artifacts
6. The orchestrator checks the result and runs the **Producer** for review

## Producer Review

The Producer agent is the quality gate. After each stage, it:

- Reads the channel's `CHANNEL.md` for tone and audience expectations
- Reads the stage output artifact
- Scores 1-10 with structured JSON output
- Provides actionable feedback if the score is below 7
- Can flag **upstream issues** (e.g., "the script is weak because the research missed X")

The review uses the Agent SDK's `outputFormat: json_schema` for guaranteed structured output.

## Budget Controls

Each agent invocation has configurable budget limits:

| Stage | Max Turns | Budget | Review Budget |
|-------|-----------|--------|---------------|
| Research | 30 | $2.00 | $0.50 |
| Script | 30 | $3.00 | $0.50 |
| Storyboard | 25 | $2.00 | $0.50 |
| Assets | 30 | $3.00 | — |
| Final Review | 15 | $1.00 | — |

::: tip
Agent definitions live in `app/agents/*.md` — each file defines the agent's persona, instructions, and output expectations. Edit them to customize behavior.
:::
