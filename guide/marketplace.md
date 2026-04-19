# Marketplace

The Marketplace is where you hire voice actors, musicians, on-camera spokespersons, editors, and animators for your channel — and, if you're a creator, where you list yourself for hire.

::: warning Early-access preview
The Marketplace is currently a **UI preview**. Artist listings, contracts, and payments are mocked in the frontend — no real transactions happen yet. Back-end integration (escrow, payout, ratings, disputes) is the next phase.
:::

<SchemeImage name="marketplace-browse" alt="Marketplace browse" />

Open it from the top chrome right rail: **Marketplace**.

## The pricing model

The Marketplace's defining commitment: **creators keep 100%** of their quoted price. Buyers pay a flat **15% marketplace fee** on top, plus no card fees (payments settle against your channel wallet, bank, or card).

There is **one** bill for creators: **storage**. It scales with the library they upload — enough to prevent abuse, not enough to matter in practice ($4/mo for 25 GB in the current preview). Everything else — listings, demos, messaging, contracts, payout — is free.

## Sub-views

The Marketplace has its own sub-navigation (separate chrome from the Studio stage rail):

### Browse

Filter rail on the left (category, style/vibe, language, turnaround, price), hero stats, a **Spotlight rail** of top creators (4.8★+ with 25+ completed jobs), then a grid of everyone else. Each card shows role, rating, jobs completed, rate, and — for voice actors — a mini-waveform demo or filmstrip preview.

**Categories**

- **Voice actors** — narration, spokesperson, ad reads
- **Spokespersons** — on-camera hosts
- **Musicians** — custom tracks, ambient, orchestral, electronic
- **Editors** — pacing surgery, shorts-first cuts, long-form docs
- **Animators** — 2D motion, 3D, explainer, data-viz

### Artist profile

Cover image, demo reel with inline audio playback, reviews, and a sticky hire sidebar. The sidebar has:

- Headline rate
- Minimum order & typical reply time
- Package tiers (e.g. "Script under 500w · 24h · $60", "Documentary narration · 3 days · $210")
- **Request this creator →** (starts the hire flow)
- **Send a message first** (messaging layer is mocked for now)

### My studio

<SchemeImage name="marketplace-studio" alt="Marketplace — My studio dashboard" />

If you're a creator, this is your dashboard:

- **Earnings hero** — this month's take, emphasised that we didn't touch it
- **Storage meter** — your only bill
- **Five headline metrics** — this-month earnings, active gigs, 90-day rating, average reply time, on-time rate
- **Active gigs table** — status per row (in progress · awaiting script · awaiting review · paid · delivered)
- **Earnings chart** — 6-month bar chart
- **Next payout card** — amount, date, early-withdraw option ($5 fee)
- **Spotlight status** — your progress toward the next quarterly spotlight rotation

### Hire & contract

A 4-step stepper: **Brief → Scope & schedule → Contract → Pay & start**. The contract is CRAFT-standard with fields for parties, deliverable, format, revisions, delivery date, usage rights, and credit line. The payment summary breaks out:

- `{words} × {rate}` → creator receives
- `Marketplace fee (15%)`
- **You pay** total

Funds are held in escrow (plan; mocked now) until you approve delivery.

## Backend status

Everything above is rendered from `app/frontend/src/lib/marketplace.ts`. When the backend API for `/marketplace/artists`, `/marketplace/gigs`, `/marketplace/contracts`, `/marketplace/payouts` lands, those become real endpoints and the data layer swaps out transparently — the panel UI doesn't change.
