# Audio Production

The Audio panel generates speech from your scripts using text-to-speech, handles uploaded voiceovers with timestamp-based splitting, supports sound effect sections, and can layer background music under the voice track.

## Prerequisites

- A script in **Review** or **Final** status (drafts are blocked)
- A voice configured in [Settings](/guide/settings) or selected per-project

## Two Modes

### TTS Mode (AI Voice)
Generate speech from script text using one of four TTS providers:

| Provider | Voices | Cost | Quality |
|----------|--------|------|---------|
| **Edge TTS** | 300+ Microsoft Neural voices | Free | Good |
| **ElevenLabs** | Premium cloned/generated voices | Paid | Excellent |
| **OpenAI** | 6 voices | Paid | Very Good |
| **OpenedAI Speech** | 6 voices (local GPU) | Free | Very Good |

Any of these carrier voices can optionally be post-processed through **RVC Voice Clone** to sound like your trained voice model (see [Voice Cloning](#voice-cloning-rvc) below).

::: tip
Edge TTS is the default — no API key needed. **OpenedAI Speech** is also free if you have a GPU. Enable GPU services via Helm (`gpu.enabled: true` in values.yaml) or with `docker compose -f docker-compose.dev.yml --profile gpu up -d` for local dev.
:::

### Upload Mode (Recorded Voiceover)
Upload your own recorded voiceover and split it into sections by timestamp:

1. Create a project in **Upload** mode
2. Upload your voiceover recording (MP3, WAV, OGG, FLAC)
3. Set start/end timestamps (mm:ss) for each section
4. Click **Split All** — sections are extracted as lossless WAV files
5. Re-upload individual sections if needed (re-record a single section without re-doing everything)

::: info Lossless Splits
Upload splits use WAV format to preserve audio quality. You can replace any section independently without generation loss.
:::

## Creating a Project

1. Navigate to **Audio > Create**
2. Select a script (must be Review or Final status)
3. Choose **AI Voice (TTS)** or **Upload** mode
4. If TTS: select a voice and service
5. Click **Create Project**

The script is automatically parsed into sections.

## Section Parsing

The parser uses three strategies (in order):

1. **Screenplay format** — detects stage directions `*(...)* ` and character dialog `**Name:** text`
2. **Structural markers** — splits on `### headings`, `---` dividers, and `**Bold Headers**`
3. **Paragraph fallback** — splits on double newlines if the above produce only 1 section

::: info Stage Directions
Text in `*(stage direction)*` markers becomes **scene context** — it's not spoken by TTS but appears as production notes you can show/hide per section.
:::

## Sound Effect Sections

Insert SFX/transition sections anywhere in the timeline:

1. Click the **+** button between sections
2. Choose **Sound Effect** (instead of Speech)
3. Upload an audio file for the SFX (WAV, MP3, etc.)
4. SFX sections appear with an amber badge and Music icon

Use SFX sections for: transition stingers, sound effects, intro/outro jingles, ambient breaks.

## Background Music

Layer background music under the voice track:

1. Expand **Background Track** below the section timeline
2. Choose **Upload** or **Generate** (if MusicGen GPU service is running):
   - **Upload** — any audio file (MP3, WAV, OGG, FLAC)
   - **Generate** — describe the music (e.g. "upbeat lo-fi hip hop"), set duration (5-30s), click Generate
3. Configure:
   - **Volume** — 0-100% (default 15%)
   - **Fade In/Out** — seconds for gradual volume ramp
   - **Mode** — Loop (repeats to match voice), Trim (cuts at voice end), Once (plays once)
4. Background is mixed in during **Merge**

::: tip MusicGen
The Generate tab appears when the MusicGen GPU service is running. Enable it via Helm (`gpu.enabled: true` in values.yaml) or `docker compose -f docker-compose.dev.yml --profile gpu up -d` for local dev. It creates instrumental tracks from text prompts using Meta's AudioCraft model.
:::

### Standalone Music Generation

The **Audio > Music** panel generates tracks without needing an audio project:

1. Describe the music (e.g. "upbeat lo-fi hip hop, chill vibes")
2. Set duration (5-30s) and click **Generate Music**
3. Play back generated tracks inline with the play button
4. **Download** as WAV or **Save to Project** as background music via the dropdown
5. Use **AI Generate** to auto-create a prompt based on your channel's topics

Generated tracks persist for the session — you can preview multiple takes and pick the best one.

## Generating Audio

- **Generate All** — processes every pending section sequentially
- **Generate One** — click refresh on any section to generate just that one
- **Regenerate** — re-generate with different voice settings

Each section shows its status: pending, generating, ready, or error.

## Voice Controls

- **Speed** — playback speed multiplier (Edge TTS, OpenAI)
- **Stability** (ElevenLabs) — lower = more expressive, higher = more consistent
- **Similarity Boost** (ElevenLabs) — how closely to match the original voice

## Linking Resources

Click the **paperclip** icon on any section to link downloaded resources (images, video, audio) from your Resource Library. Linked resources appear as chips — useful for tracking which B-roll goes with which section for later video assembly.

## Text Preprocessing

Edge TTS doesn't support SSML, so text is automatically preprocessed:

- Dashes become commas (natural pauses)
- Ellipses become periods (longer pauses)
- Units spelled out: `°C` becomes "degrees C"
- Abbreviations expanded: `e.g.` becomes "for example"

## Merging

Click **Merge** to combine all ready sections into a single audio file:

- Configurable silence gaps between sections (0-10000ms)
- Mixed formats supported (WAV + MP3 sections normalized automatically)
- If a background track is configured, it's layered under the voice with fade in/out

### Merge with RVC

When your channel has an **RVC Voice Model** configured in Settings, two additional buttons appear:

- **Merge All + RVC** — merges all sections, applying RVC voice conversion to each section before concatenation. Sections are copied to temp files, converted through RVC, then concatenated and cleaned up
- **Preview RVC** — converts just the first section through RVC so you can quickly audition the cloned voice without a full merge

The final output is an MP3 file ready for video production.

## Voice Cloning (RVC)

Clone your voice using RVC v2 — it post-processes **any** TTS carrier voice into your custom voice. RVC is not a standalone TTS service; it's an optional post-processing toggle that works with Edge TTS, ElevenLabs, OpenAI, or OpenedAI Speech. Requires the GPU profile.

### Step 1: Collect Voice Samples

Record or gather 10-50 minutes of clean audio of the target voice.

- Avoid background music or noise — consistent mic setup and room acoustics improve results
- Multiple recordings from the same session work best
- Supported formats: WAV, MP3, OGG, FLAC, M4A

Navigate to **Audio > Train Voice** and drag-and-drop your files into the upload zone. The Setup Guide is located at the top of VoiceTrainPanel, next to the **Record Session** button. The progress bar tracks total duration — aim for at least 10 minutes (30 minutes ideal).

::: tip
You can also record audio externally and upload it via [Audio > Create](./audio#upload-mode) in Upload mode, then export the sections as WAV files for training input.
:::

### Step 2: Train a Model

Training happens outside CRAFT using free tools:

- **[Applio](https://github.com/IAHispano/Applio)** — recommended GUI for RVC training (free, runs locally)
- **Google Colab notebooks** — free GPU training in the cloud

Use your uploaded voice samples as input. Training takes 20-60 minutes depending on settings (2000-6000 steps). The output is a `.pth` model file.

### Step 3: Upload Your Model

1. In the **Upload Voice Model** section, select your `.pth` file (or a `.zip` containing `.pth` + `.index`)
2. The model appears in the Trained Models list
3. Upload multiple models for different voices or styles

### Step 4: Enable RVC on Your Channel

1. Open your channel's **Settings** (gear icon on channel hover)
2. Under **Default Voice**, select any TTS service (Edge TTS, ElevenLabs, OpenAI, or OpenedAI Speech) and choose a carrier voice
3. Enable the **RVC Voice Clone (optional)** dropdown and select your trained model
4. Click **Save**

When you create an audio project, it will use a two-stage pipeline:
1. Your chosen TTS service generates the base speech with the carrier voice
2. RVC converts the carrier audio into your cloned voice

::: tip
The carrier voice affects pacing and inflection but not the final timbre — RVC replaces the voice character entirely. Pair it with Edge TTS for a completely free pipeline, or use ElevenLabs/OpenAI for higher-quality carrier speech.
:::

### Quick Test

After configuring, go to **Audio > Create**, select a script, and click **Create Project**. The service will show your chosen TTS provider plus the RVC model name. Generate a section to hear the result.

## Preview

Use **Preview Sections** to see how your script will be split before creating a project.

<SchemeImage name="audio-sections" alt="Audio Sections" />
