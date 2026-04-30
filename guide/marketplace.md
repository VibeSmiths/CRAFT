# Marketplace

The Marketplace is where you hire voice actors, musicians, on-camera spokespersons, editors, and animators for your channel — and, if you're a creator, where you list yourself for hire.

It runs as a standalone app at **[marketplace.mossworks.io](https://marketplace.mossworks.io/)** and is reachable from CRAFT via the `craft ↗` link in the top-right of the marketplace chrome (and vice versa).

<SchemeImage name="marketplace-browse" alt="Marketplace browse" />

## The pricing model

The Marketplace's defining commitment: **sellers pay $0 in platform fees**. Buyers pay a flat **15% marketplace fee** on top of the seller's quoted price, and that's it — no card fees layered in, no hidden cuts on the seller side.

Storage is the only line item creators ever see. It scales with the library they upload — enough to prevent abuse, not enough to matter in practice ($4/mo for 25 GB at the current tier). Listings, demos, messaging, contracts, payouts (via Stripe Connect Express), and 1099 issuance are all free.

## Sub-views

The Marketplace's top nav has exactly four tabs: **Browse · Gigs · Brand partners · My Studio**.

### Browse

Filter rail on the left (category, style/vibe, language, turnaround, price), hero stats, a **Spotlight rail** of top creators (≥ 4.8★ with ≥ 25 completed jobs in any role), then a grid of everyone else. Each card shows role, rating, jobs completed, rate, and — for voice actors — a mini-waveform demo or filmstrip preview.

**Categories**

- **Voice actors** — narration, spokesperson, ad reads
- **Spokespersons** — on-camera hosts
- **Musicians** — custom tracks, ambient, orchestral, electronic
- **Editors** — pacing surgery, shorts-first cuts, long-form docs
- **Animators** — 2D motion, 3D, explainer, data-viz

### Gigs

<SchemeImage name="marketplace-gigs" alt="Open gigs — filter rail + gig cards" />

Gigs is the flip side of Browse — instead of buyers searching for creators, creators see **channels posting what they need** and apply with a message + quote.

**For creators**

1. Open **Gigs** in the marketplace top nav.
2. Filter by role, budget, deadline, status.
3. Click a gig card to see the full brief (description, deliverables, tags, budget).
4. Submit an application — short pitch + your quote.

The buyer sees your application under their gig. If they shortlist or accept you, the next step is the standard [Hire & contract](#hire-contract) flow against your quote.

**For buyers — Post a gig**

<SchemeImage name="marketplace-post-gig" alt="Post a gig form with live preview" />

Click **+ Post a gig** in the top-right of the marketplace chrome. The form has:

- **Title** — the headline creators see in the list
- **Role** — voice / spokesperson / music / editor / animator
- **Description** — the brief (context, tone, samples, deadlines)
- **Deliverables** — file formats, revisions, timeline
- **Budget min / max** — displayed as a range on the card
- **Deadline** — free-text (e.g. "Apr 28" or "Ongoing")
- **Tags** — comma-separated search keywords
- **Your name / channel** — attribution shown on the gig

A live preview card sits to the right so you can see the cards as applicants will. Nothing is charged at post-time — funds only move through escrow once you **accept** a specific applicant.

### Brand partners

::: info Coming soon
Brand-partner listings, two-sided reviews, and placement matching ship in the next phase. The tab renders a coming-soon slide today with placeholder partner cards behind a gradient veil so you can preview the IA.
:::

Brand partners is the **brand-sponsorship** side of the Marketplace — distinct from creators-for-hire. Two populations will live here:

- **Channels seeking sponsors** — audience, niche, sample reads, CPM ranges
- **Brands seeking channels** — products, campaigns, deliverable expectations, budgets

Both rendered as partner cards with hue-themed covers, tier badges (see [Gamification](#gamification-tiers-badges-streaks)), active listings count, and a spotlight flag for top performers. Reviews are **placement-scoped**, not gig-scoped — they reference a specific placement ID so both sides can back-reference the engagement. Same star-rating mechanics as creator reviews, same merit-only ranking — no paid boosts.

### Artist profile

Cover image, demo reel with inline audio playback, reviews, and a sticky hire sidebar. The sidebar has:

- Headline rate
- Minimum order & typical reply time
- Package tiers (e.g. "Script under 500w · 24h · $60", "Documentary narration · 3 days · $210")
- **Request this creator →** (starts the hire flow)
- **Send a message first** (real messaging — not mocked)

### My Studio

If you're a creator, this is your home. The page mirrors the craft team's design mock with three layers:

**Hero row** — `ProgressionTile` on the left (your tier badge, tier-score progress bar, top earned badges, active streak, recent achievements, onboarding completeness) + `SpotlightCard` on the right (this-quarter job progress against the goal, per-role eligibility breakdown, contribution weights — rating 40% / on-time 30% / volume 20% / reply 10%).

**Five-stat grid** — 90-day rating, active gigs, completed gigs, this-quarter progress, setup completion (X/21).

**Three internal tabs**

- **Metrics** (default) — earned + locked badges with show/hide toggle, and your most recent reviews.
- **Active gigs** — table of in-progress contracts with status, deadline, amount. Click a row for the full state-machine view.
- **Partnerships** — placeholder for "Brands I worked with" with a "Leave review" button per partner once the brand-partners backend lands.

**Quick links rail** at the bottom — Profile · Demos · Packages · Availability · Stripe · Storage · Invitations · Applications · Contracts · Disputes. These were top-level tabs in the previous IA; now they live here as one-click jumps so the top nav stays clean.

## Gamification: tiers, badges, streaks

Creators and brand partners earn **visible, criterion-based recognition** based on their public stats. Nothing here is pay-to-play — tiers and badges are computed from `rating`, `jobsCompleted`, `onTimePct`, and `replyHours`. The rationale for every badge is visible in the UI, so there's no mystery about what unlocked it.

### Tiers

Four tiers, gated on hard thresholds — all three criteria must be met to advance:

| Tier | Rating | Completed jobs | On-time |
|------|-------:|---------------:|--------:|
| **Bronze** | — | — | — |
| **Silver** | ≥ 4.5 | ≥ 10 | ≥ 90% |
| **Gold** | ≥ 4.8 | ≥ 50 | ≥ 95% |
| **Platinum** | ≥ 4.9 | ≥ 150 | ≥ 98% |

The profile card also shows a `tierScore` (0–100): **40% rating · 30% volume · 20% on-time · 10% reply speed**. It's a smooth signal between tier jumps so progress is legible.

### Badges

Badges are **current-state** flags — they turn on and off as stats move. Examples: `Spotlight eligible` (≥ 4.8★ + ≥ 25 jobs), `Fast replier` (avg reply ≤ 3h), `Multilingual` (two or more delivery languages), `Veteran` (100+ completed jobs). Each badge lists its rationale on hover so there's no guesswork.

### Achievements

Achievements are **permanent** milestones — once unlocked, they stay. Rarity tiers: `common` · `uncommon` · `rare` · `legendary`. Examples: `First gig delivered`, `First repeat client`, `Five-gig streak`, `Spotlighted 3 weeks`, `100 gigs completed`. Unlocks show the date in the profile's achievements strip.

### Streaks

Streaks are **consecutive counters** that reset when broken but remain visible as historical markers. Examples: `On-time streak · 47 days`, `Five-star streak · 6 deliveries`, `Reply-time streak · 21 days`. An inactive streak renders muted to show the last peak.

### Next-tier hint

Every profile shows what's still needed for the next tier — e.g. `Gold → Platinum: rating ≥ 4.9, +50 completed jobs, on-time ≥ 98%`. No gamified carrot; just a concrete list so creators know exactly what moves the needle.

## Hire & contract

A 4-step stepper: **Brief → Scope & schedule → Contract → Pay & start**. The contract is CRAFT-standard with fields for parties, deliverable, format, revisions, delivery date, usage rights, and credit line. The payment summary breaks out:

- `{words} × {rate}` → creator receives
- `Marketplace fee (15%)`
- **You pay** total

Funds are held in escrow via Stripe Connect Express's manual-capture PaymentIntent (single-mode contracts) or one PaymentIntent per milestone (milestone-mode). The seller's payout goes through Stripe's `transfer_data.destination` at capture; the platform fee comes off as `application_fee_amount`. Refunds, cancels, and dispute handling are first-class state-machine operations on the contract.

## Backend status

Marketplace runs as its own service in the `marketplace` Postgres schema, with ~150 endpoints across 17 route surfaces and 15 NATS workers (sanctions screening, watermark generation, attribution finalization, spotlight recompute, account purge, async data export, etc.). It deploys as a Helm subchart of CRAFT (`craft-marketplace-*` pods), reachable from the cluster at `marketplace-dev.mossworks.io` in dev environments.

Source: [Mossworks-Labs/marketplace](https://github.com/Mossworks-Labs/marketplace).
