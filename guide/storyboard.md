# Storyboard

Once a script is in **review** or **final**, the Storyboard editor is where you plan the visuals beat-by-beat — shot type, notes, duration, transitions, and the images or clips you intend to drop into each scene during composition.

<SchemeImage name="storyboard-editor" alt="Storyboard editor — scene list, detail, and resource picker" />

## Opening the editor

There are two entry points that both land in the same place:

1. **From Episodes** — open an episode, find the `storyboard` row in the Pipeline Stages list, click **Open editor**. If the episode has a linked script, the storyboard auto-populates for it. If not, a dropdown at the top lets you pick one.
2. **Directly** — set the activeView to `storyboard` (via the command palette path or a saved link). The script dropdown at the top of the editor works the same way as the Audio room: review/final scripts listed first, drafts below a divider.

## Layout

### Left — scene list

One row per script beat, parsed from the same server-side splitter the Audio room uses:

- Numbered index
- Shot-type tag (if set)
- Beat text preview (2 lines)
- Attached-resource count on the right

The footer tallies total resources, estimated duration, and save state (autosaves every ~1.5 s to browser storage — see [Persistence](#persistence)).

### Center — scene detail

Each scene has:

- **Shot type** — wide, medium, close, cutaway, insert, aerial. Toggle-pill selection.
- **Estimated duration** — seconds (influences total at the bottom of the scene list).
- **Transition** — free-text (cut / fade / dissolve / etc.)
- **Director notes** — multiline textarea for framing, lighting, pacing, or music cues.
- **Planned resources** — grid of attached image/clip thumbnails; hover to reveal a remove button.

### Right — resource library picker

The right rail pulls from the channel's downloaded Resources library:

- **Search** by filename or title
- **Filter** to images or videos only
- Click the **+** button on a row to attach it to the currently focused scene
- Shortcuts to web-search (Resource Search) or AI image generation (Image Generate) if you don't already have what you need

## Typical workflow

1. Finalize a script (promote from draft → review → final in the Script editor).
2. Open its Episode — or create one — and click **Open editor** on the storyboard stage.
3. Walk beat-by-beat. For each scene, pick a shot type, jot notes, attach any images/clips from the library. If you're missing visuals, jump out to Resource Search or Image Generate and they'll appear in the right rail.
4. When every scene is populated, mark the storyboard stage complete in the Episode's pipeline and hand off to assets/compositing.

## Persistence

The current storyboard is saved to **`localStorage`** keyed by script ID (`craft:storyboard:<scriptId>`). That means:

- It survives page refresh and switching channels
- It's not synced across browsers or devices
- A proper backend schema is planned; when it lands, `loadStoryboard` / `saveStoryboard` in `app/frontend/src/lib/storyboard.ts` are the single swap point — the UI doesn't change

Because the key is the script ID (not the episode ID), you can re-link the script to a different episode and the storyboard follows the script.

::: tip
The split into beats comes from the same parser the Audio room uses, which means adding or removing paragraphs in the script after starting a storyboard can shift the beat indexing. Re-run the pipeline's `script` stage or touch up the text first to stabilise scene boundaries.
:::
