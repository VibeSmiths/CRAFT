# Scripts

The Script Editor is where ideas become content. AI writes, revises, and polishes scripts in your character's voice, with fact-checking and humanization tools.

<SchemeImage name="script-editor" alt="Script Editor — three-column Flow layout" />

## Layout

The editor is a three-column grid:

- **Left — script list rail.** Every script in the channel, one row each with title, status badge (draft / review / final), and word count. Click to jump between scripts — unsaved work is committed first.
- **Centre — editor.** Sticky toolbar at the top, a giant serif title input, then the script body (JetBrains Mono, 15px). Stage directions and dialog render inline. Fact-check highlights overlay the text when a check is active.
- **Right — AI copilot rail.** Four tabs — **Revise**, **Facts**, **Humanize**, **Pacing** — plus a **Pipeline Spine** at the bottom that shows where this script sits in the Idea → Script → Audio → Episode → Publish arc.

## Toolbar

The sticky toolbar at the top of the editor holds:

- **Status badge** — draft / review / final, colour-coded
- **Type badge** — short or long
- **Word count** — spoken words only, with a progress bar toward the target (150 for Shorts, 1500 for Long-form)
- **Auto-save indicator** — `saving…` / `unsaved` / `auto-saved · 14s`
- **Status dropdown** — promote draft → review → final
- **Fact check / Humanize** buttons
- **Send to audio** (on review/final) or **Promote & send** (from draft — sets status to review and jumps straight to the Audio room)
- **Save*** button when there are unsaved changes

## AI writing — the Revise tab

The **Revise** tab in the right rail holds all generation controls:

| Button | What it does |
|--------|-------------|
| **Write with voice** | Generates a full script in your channel's character voice from the title and any existing content |
| **Revise** | Expands a textarea — type what to change ("make the intro punchier", "add more technical detail"), press **Go** |

Under those is a **Related** section with a shortcut to open the [Resource Search](/guide/resources) panel for adding reference material.

::: tip Shorts get special treatment
Scripts marked **Short** are generated with a seamless loop — the last sentence trails off incomplete and the first sentence completes it, so the video loops cleanly. No hashtags in the content (they're extracted to tags automatically).
:::

## Fact check

<SchemeImage name="fact-check" alt="Fact Check Panel" />

Click **Fact check** in the toolbar. The Facts tab lights up in the right rail and the editor body gets inline highlights that follow the classification:

- **Verified** (green) — confirmed accurate
- **Unverified** (amber) — plausible but not confirmed
- **Disputed** (red) — contradicts known facts
- **Opinion** (blue) — subjective, not a factual claim

Click any claim in the Facts panel to jump the editor cursor to that passage. Claims that don't match any text in the script appear under **Summary claims** — they're the AI's higher-level observations.

## Humanize

Click **Humanize** in the toolbar. The Humanize tab shows each detected passage:

- **Fixed** (green) — auto-rewritten; shows original with strikethrough + rewrite in info-blue
- **Flagged** (amber) — needs manual judgment

Use **Apply all fixes** for a wholesale rewrite, or **Apply this fix** on a single passage. Click any passage header to jump into the editor at that line.

## Pacing tab

Switch to **Pacing** for a read-only breakdown:

- Large serif word count vs. target with a progress bar
- Estimated read time at 150 wpm
- Structure — paragraphs, stage directions, average words per paragraph
- Section sizes — one bar per paragraph, longest normalised

Useful for spotting pacing problems (e.g. a 400-word dump that needs splitting, or a dozen 20-word graphs that read like twitter).

## Pipeline Spine

The bottom of the AI rail shows the five-step arc: `Idea → Script [here] → Audio → Episode → Publish`. It tells you at a glance what's upstream (what the script was derived from) and what's unblocked for the next stage (e.g. Audio lights up once status is review/final).

## Status workflow

Scripts progress through three statuses via the dropdown in the toolbar:

| Status | Meaning | Audio |
|--------|---------|-------|
| **Draft** | Work in progress | Blocked |
| **Review** | Ready for review | Allowed |
| **Final** | Production ready | Allowed |

The **Storyboard** editor under Episodes prefers review/final scripts too — once the script's there, the storyboard row on the episode lights up an **Open editor** action. See [Storyboard](/guide/storyboard).

## Auto-save

Scripts auto-save every 30 seconds when modified. The indicator in the toolbar shows `unsaved` when there are pending edits and counts up seconds since the last save when clean.
