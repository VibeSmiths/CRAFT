# Proposals

Proposals are AI-scored content ideas that go through a curation workflow before entering the production pipeline. Proposals are **channel-scoped** and available to **premium users** only.

## How It Works

1. **Generation** — the `proposal-generate` NATS worker analyzes trends, channel history, and audience signals to generate 5 scored proposals per run
2. **Scoring** — each proposal receives a 0-100 score based on weighted criteria (see below)
3. **Review** — browse proposals sorted by score, with trend signals and timeliness indicators
4. **Decision** — approve proposals to convert them into ideas, or reject to dismiss

Proposals appear **under channels** in the sidebar (not as a standalone section).

## Proposal Fields

Each generated proposal includes:

- **Title** — the proposed video topic
- **Hook** — an attention-grabbing opening line
- **Angle** — the unique perspective or framing
- **Score** — AI confidence score (0-100)
- **Reasoning** — why this topic scored the way it did
- **Content gap** — what's missing in existing coverage of this topic
- **Suggested angle** — recommended approach for the channel
- **Trend signals** — what data points support this topic
- **Timeliness** — how time-sensitive the topic is
- **Tags** — topic tags for categorization

## Scoring Criteria

The score (0-100) is a weighted composite:

| Factor | Weight | Description |
|--------|--------|-------------|
| Trend momentum | 40% | How strongly the topic is trending right now |
| Content gap | 30% | How underserved the topic is in existing content |
| Topic alignment | 20% | How well the topic fits the channel's themes |
| Timeliness | 10% | How time-sensitive the opportunity is |

<SchemeImage name="proposals-panel" alt="Proposals Panel" />

::: tip
Proposals require the `premium` Keycloak role (admin auto-qualifies). The `proposal-generate` worker is a fully implemented NATS consumer — not a stub.
:::
