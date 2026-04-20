# Audio production

The Audio room generates speech from your scripts using text-to-speech, handles uploaded voiceovers with timestamp-based splitting, supports sound effect sections, and layers background music under the voice track. Reach it via **Audio** on the top-chrome stage rail, or from the Script editor with **Send to audio** / **Promote & send**.

## Script breakdown (project setup)

Pick a script in Review or Final status from the header dropdown. CRAFT parses it into sections and shows you the breakdown before you commit to a voice or mode:

<SchemeImage name="audio-sections" alt="Script parsed into 5 sections before creating the project — pick AI Voice (TTS) or Upload mode, tune default pause, then Create" />

Toggle between **AI Voice (TTS)** and **Upload Recording** at the top. The numbered list below the tabs is a live preview of the parsed sections — any row tagged `scene` is a stage direction that becomes scene context rather than spoken text. Adjust the default pause slider to set the silence between sections (per-section overrides come later in the editor).

## Per-section editor (recording & re-record)

Once the project exists the view flips into the 3-column editor. Every parsed beat gets its own row with a waveform, play/regenerate/upload controls, and a delay-after slider. Click any row to focus it in the right rail, where you can edit the text, attach resources, or remove the section entirely:

<SchemeImage name="audio-recordings" alt="Per-section editor — 5 TTS sections with waveforms, status chips, and per-section regenerate/upload/record buttons; focused section detail in the right rail" />

This is where you iterate. Common moves:

- **Regenerate one section** — the loop-arrow icon on any row re-runs TTS with the current voice settings. Useful when a single beat comes out with bad pacing.
- **Upload one section** — replace a single beat with a recorded take without retaking the whole script. Drop a WAV/MP3 on the upload icon; it's stored lossless-first and the waveform updates in place.
- **Strip directions** — the right-rail shortcut scrubs `*(stage direction)*` markers from the focused section's text (or use **Strip all directions** in the left rail to do the whole project).
- **Insert SFX between rows** — hover the gap between two rows and click **+**; SFX rows carry an amber `sfx` chip.
- **Tune the pause after any row** — the delay-after slider in the right rail overrides the default for just this beat.

## Layout

Once a script and an active project are selected, the panel switches to a three-column **Audio room** layout:

- **Left rail** — voice header (inline rename), service/RVC chip, live stats (sections / ready / pending / duration), primary actions (Generate all · Merge · Preview RVC · Strip all directions), collapsible **Voice smoothing** (TTS-only sliders), collapsible **Background bed** (upload or MusicGen tabs + volume / fade / mode), collapsible **Orphaned** (audio files no longer linked to a section).
- **Centre** — script title + total duration at the top, **row-per-beat** section list with inline mini-waveform and status chip, insert-section + delay-ms between rows, and a **master timeline** footer with the merged output's play button and proportional timeline.
- **Right rail** — focused section detail: text (click **Edit** for a textarea), any scene context callout, linked resources, and actions (Play · Regenerate · Upload · Record · Strip directions · Remove · delay-after slider).

## Prerequisites

- A script in **Review** or **Final** status (drafts are blocked).
- A voice configured in [Settings](/guide/settings) — or selected per-project on the first creation screen.

## Two modes

### TTS (AI voice)

Generate speech from script text using one of four TTS providers:

| Provider | Voices | Cost | Quality |
|----------|--------|------|---------|
| **Edge TTS** | 300+ Microsoft Neural voices | Free | Good |
| **ElevenLabs** | Premium cloned/generated voices | Paid | Excellent |
| **OpenAI** | 6 voices | Paid | Very Good |
| **OpenedAI Speech** | 6 voices (local GPU) | Free | Very Good |

Any carrier voice can optionally be post-processed through **RVC Voice Clone** to sound like your trained voice model — see [Voice cloning (RVC)](#voice-cloning-rvc) below.

::: tip
Edge TTS is the default — no API key needed. **OpenedAI Speech** is also free if you have a GPU. Enable GPU services via Helm (`gpu.enabled: true`) or `docker compose -f docker-compose.dev.yml --profile gpu up -d` for local dev.
:::

### Upload (recorded voiceover)

1. Create a project in **Upload** mode.
2. Upload a recorded voiceover (MP3, WAV, OGG, FLAC, M4A).
3. Set start/end timestamps (mm:ss) for each section — the fields auto-format on blur.
4. Click **Split All** — sections are extracted as lossless WAV files.
5. Re-upload any single section independently if you need to retake just that part.

## Creating a project

1. Open the Audio room.
2. Select a script (must be Review or Final).
3. Choose **AI Voice (TTS)** or **Upload** mode.
4. If TTS: pick the service and a voice.
5. Click **Create Project**.

The script is automatically parsed into sections.

## Section parsing

The parser tries three strategies in order:

1. **Screenplay format** — detects stage directions `*(...)*` and character dialog `**Name:** text`.
2. **Structural markers** — splits on `### headings`, `---` dividers, and `**Bold Headers**`.
3. **Paragraph fallback** — splits on double newlines if the above produce only 1 section.

::: info Stage directions
Text in `*(stage direction)*` markers becomes **scene context** — not spoken by TTS but shown as an amber callout above the section row that can be toggled on/off with the eye icon.
:::

## Sound-effect sections

Insert SFX anywhere in the timeline: hover the gap between two rows, click **+**, pick **Sound Effect**. Upload any audio file; SFX rows carry an amber `sfx` chip and the waveform tracks the imported clip.

Use SFX for transition stingers, intro/outro jingles, or ambient breaks.

## Background bed

The **Background bed** section in the left rail controls the ambient layer:

- **Upload** — pick a file or drop it in. Configure volume, fade in/out, and mode (Loop / Trim to voice / Play once).
- **Generate** (tab, if MusicGen GPU service is running) — describe the music, set duration, generate.

Settings are applied during **Merge**.

### Standalone music generation

A dedicated **Music Generator** panel lives at `activeView: 'audio-music'` (reachable from the command palette or the resource sub-nav when applicable). It creates tracks without needing a project — useful for quickly auditioning ideas.

## Generating audio

- **Generate all** — left-rail button, processes every pending section sequentially.
- **Regenerate** (right rail / row icon) — re-generates a single section with current voice settings.

Each row shows its status: pending / generating / ready / error. Errors get an inline message plus a red border.

## Voice controls

In the left rail's **Voice smoothing** section:

- **Speed** — playback speed multiplier (Edge TTS, OpenAI, OpenedAI Speech)
- **Stability** (ElevenLabs) — lower = more expressive, higher = more consistent
- **Similarity boost** (ElevenLabs) — how closely to match the original voice

## Linking resources

In the right-rail section detail, click **Attach**. The picker shows downloaded resources from the channel library. Linked resources appear as chips on the row — useful for tracking which B-roll goes with which section when later assembling video.

## Merging

Click **Merge all** in the left rail to combine every ready section into a single audio file:

- Silence gaps between sections come from each row's `delayAfter` slider.
- Mixed formats (WAV + MP3) are normalised automatically.
- If a background track is configured, it's layered under the voice with fade in/out.

### Merge with RVC

When the channel has an **RVC Voice Model** configured, the merge button reads **Merge + RVC** and a **Preview RVC** shortcut appears next to it — it converts just the first section so you can audition the cloned voice without a full merge.

Once merged, the master timeline footer at the bottom of the centre column shows the play button, total duration, and a **Finalize & create episode** button that promotes the project into an Episode.

## Voice cloning (RVC)

Clone your voice using RVC v2 — it post-processes **any** TTS carrier voice into your custom voice. RVC is not a standalone TTS service; it's an optional post-processing toggle that works with Edge TTS, ElevenLabs, OpenAI, or OpenedAI Speech. Requires the GPU profile.

### Step 1 — Collect voice samples

Record or gather 10–50 minutes of clean audio. Avoid background music or noise; use a consistent mic and room. Supported formats: WAV, MP3, OGG, FLAC, M4A.

Open the **Voice training** panel (`activeView: 'audio-train'` — reachable via command palette). Drag-and-drop your files into the upload zone; the progress bar tracks total duration.

::: tip
You can also record externally and upload via the Audio room's Upload mode, then export the sections as WAV files for training input.
:::

### Step 2 — Train a model

Training happens outside CRAFT using free tools:

- **[Applio](https://github.com/IAHispano/Applio)** — recommended GUI for RVC training (free, local)
- **Google Colab notebooks** — free GPU training in the cloud

Use your uploaded voice samples as input. Training takes 20–60 minutes depending on settings (2000–6000 steps). The output is a `.pth` model file.

### Step 3 — Upload your model

1. In the voice-training panel, select your `.pth` file (or a `.zip` containing `.pth` + `.index`).
2. The model appears in the Trained Models list.
3. Upload multiple models for different voices or styles.

### Step 4 — Enable RVC on your channel

1. Open the channel-pill dropdown → **Channel settings**.
2. Under **Default Voice**, select any TTS service and choose a carrier voice.
3. Enable the **RVC Voice Clone (optional)** dropdown and select your trained model.
4. Click **Save**.

When you create an audio project, it uses a two-stage pipeline:
1. Your chosen TTS service generates the base speech with the carrier voice.
2. RVC converts the carrier audio into your cloned voice.

::: tip
The carrier voice affects pacing and inflection but not the final timbre — RVC replaces the voice character entirely. Pair it with Edge TTS for a completely free pipeline, or use ElevenLabs/OpenAI for higher-quality carrier speech.
:::

## Text preprocessing

Edge TTS doesn't support SSML, so text is automatically preprocessed:

- Dashes become commas (natural pauses)
- Ellipses become periods (longer pauses)
- Units spelled out: `°C` → "degrees C"
- Abbreviations expanded: `e.g.` → "for example"
