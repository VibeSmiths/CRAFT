# Scripts

The Script Editor is where ideas become content. AI writes, revises, and polishes scripts in your character's voice, with fact-checking and humanization tools.

## Script Editor

Click any script to open the editor. The toolbar provides:

<SchemeImage name="script-editor" alt="Script Editor" />

### AI Writing

| Button | What It Does |
|--------|-------------|
| **Write with Voice** | Generates a full script from the title and any existing content |
| **Revise** | Opens a prompt input — type what to change, then submit |
| **Polish** | Fixes awkward phrasing, ensures consistent voice, improves the ending |

::: tip Revise with Instructions
Click **Revise** to open an inline text field. Type specific instructions like "make the intro punchier" or "add more technical detail" then press Enter.
:::

### YouTube Shorts

Scripts marked as **Short** get special AI treatment:
- Loop structure — the last sentence trails off incomplete, completed by the first sentence on replay
- ~150 word target
- No hashtags in content (extracted to tags automatically)

### Model Selection

The model dropdown lets you choose between Claude and Gemini models. Each has different strengths — Claude (especially Opus) may use MCP research tools, while Gemini streams faster.

## Status Workflow

Scripts progress through three statuses:

| Status | Meaning | Audio |
|--------|---------|-------|
| **Draft** | Work in progress | Blocked |
| **Review** | Ready for review | Allowed |
| **Final** | Production ready | Allowed |

Change status via the dropdown in the editor toolbar.

## Fact Check

Click **Fact Check** to scan the script for factual claims:

<SchemeImage name="fact-check" alt="Fact Check Panel" />

- **Verified** (green) — confirmed accurate
- **Unverified** (amber) — plausible but not confirmed
- **Disputed** (red) — contradicts known facts
- **Opinion** (blue) — subjective, not a factual claim

Click any claim to **jump to that text** in the editor.

## Humanize

Click **Humanize** to detect and rewrite AI-sounding passages:

- **Fixed** (green) — auto-rewritten with strikethrough original and cyan replacement
- **Flagged** (amber) — needs manual attention

Actions:
- **Apply All Fixes** — replaces entire script with humanized version
- **Apply this fix** — replaces individual passage
- Click to jump to the passage in the editor

## Word Count

The word counter shows spoken words only — stage directions like `*(walks to camera)*`, `*[leans in]*`, and `[CUT TO]` are excluded. The progress bar fills based on the target (150 for Shorts, 1500 for Long).

## Auto-Save

Scripts auto-save every 30 seconds when modified. The Save button shows `Save*` when there are unsaved changes.
