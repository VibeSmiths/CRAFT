# Settings

Access channel settings by clicking the **gear icon** on a channel in the sidebar, or by clicking the **Settings** nav item that appears under the channel name in the sidebar when a channel is selected.

## Character

### Name & Description

Your character's name and personality description. The description is fed to the AI for all content generation — it shapes the tone, humor style, and voice of generated scripts and ideas.

### AI Character Creator

Click **Create Character** to have AI generate a full personality description from a few inputs:

- **Tone** — e.g., sarcastic, educational, energetic
- **Audience** — e.g., developers, gamers, students
- **Inspiration** — e.g., "like if Linus Tech Tips and John Oliver had a baby"
- **Quirks** — e.g., "always makes food analogies", "references Lord of the Rings"

### Topics

Content themes for your channel (e.g., "cloud computing", "DevOps", "terraform"). These are used as default search hints in Discover and help the AI stay on-topic.

## Voice

Configure the default TTS voice for audio generation:

1. Select a **Service** — Edge TTS (free), ElevenLabs, OpenAI, or OpenedAI Speech (local GPU)
2. Filter by **Language** and **Gender**
3. Select a **Voice**
4. Click **Test** to hear a preview

<SchemeImage name="voice-picker" alt="Voice Picker" />

The selected voice pre-populates when creating new audio projects.

### RVC Voice Clone (Optional)

RVC is a post-processing toggle, not a standalone TTS service. After selecting any carrier voice above, you can optionally enable RVC conversion:

1. Enable the **RVC Voice Clone (optional)** dropdown below the voice picker
2. Select an **RVC Voice Model** — your trained/downloaded model from Audio > Train Voice
3. Save — new audio projects will use the two-stage pipeline (chosen TTS service → RVC conversion)

Any carrier voice (Edge TTS, ElevenLabs, OpenAI, or OpenedAI Speech) can be post-processed through RVC.

If no RVC models are installed, you'll see a prompt to visit **Audio > Train Voice** where you can:
- **Search HuggingFace** for community voice models and install with one click
- **Upload** your own trained `.pth` model files
- **Browse** [voice-models.com](https://voice-models.com/) for the largest community catalog

## Analytics (RPM)

Revenue Per Mille ($ per 1,000 views) is used for earnings estimates in the [Discover](/guide/discover) channel deep dive.

- **Default**: $4/1000 views
- **Niche Presets**: quick-select chips — Gaming $3, Tech $6, Finance $10, Health $8, etc.
- Adjust based on your actual YouTube analytics

## AI Context (CLAUDE.md)

The CLAUDE.md editor manages the context document used when Claude processes AI requests:

- **Character mode** — auto-generated from your character name, description, topics, and style rules
- **Raw mode** — fully custom instructions

Click **Regenerate from Character** to rebuild from your current settings, or edit manually and **Save**.

## Color Schemes

Click the **palette icon** in the sidebar footer to choose from 7 color schemes:

- **Classic** — teal accent (default)
- **Purple** — violet accent with purple-tinted surfaces
- **Blue** — blue accent
- **Amber** — warm amber accent
- **Rose** — rose/pink accent
- **Liquid Gold** — golden amber accent
- **Otter** — warm brown with kelp-green accents

Dark/light mode toggle is available inside the same palette popup.
