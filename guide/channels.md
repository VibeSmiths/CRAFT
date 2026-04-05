# Channels

Channels are the top-level organizer in CRAFT. Each channel has its own character personality, topics, voice settings, and content library.

## Creating a Channel

1. Click **+ Add Channel** in the sidebar
2. Enter a **Channel Name** (e.g., "Tech Explained")
3. Enter a **Character Name** (your on-screen persona, e.g., "Alex")
4. Click **Create**

<SchemeImage name="create-channel" alt="Create Channel" />

## Channel Settings

Click the **gear icon** that appears when hovering over a channel in the sidebar.

### Character

- **Name** — your character's display name
- **Description** — personality, tone, speaking style. This is fed to the AI for all content generation.
- **Topics** — content themes (e.g., "cloud computing", "DevOps", "terraform"). Used as default search hints in Discover.
- **Tags** — organizational labels for your ideas and scripts

::: tip AI Character Creator
Click **Create Character** in Settings to have AI generate a full character description from a few inputs: tone, audience, inspiration, and quirks.
:::

### Voice

Configure a default TTS voice for audio generation:
- **Service** — Edge TTS (free), ElevenLabs, or OpenAI
- **Voice** — cascading filters by language, gender, then specific voice
- **Test** — preview the voice before saving

### Analytics

- **RPM** — Revenue Per Mille (per 1,000 views). Used for earnings estimates in Discover.
- **Niche Presets** — quick-select RPM values (Gaming $3, Tech $6, Finance $10, etc.)

### CLAUDE.md

The AI Context editor lets you view and edit the CLAUDE.md file that shapes Claude's responses for this channel. In **Character** mode, it's auto-generated from your settings. In **Raw** mode, you can write custom instructions.

## Switching Channels

Click any channel in the sidebar to switch. All panels (Ideas, Scripts, Discover, etc.) update to show that channel's content.

## Channel Ownership & Multi-Tenant Isolation

Each channel is owned by the user who created it. Access is controlled by Keycloak roles:

| Role | See Own Channels | See Others' Channels | Edit Others' Channels |
|------|-----------------|---------------------|----------------------|
| **Admin** | Yes | Yes | Yes |
| **Editor** | Yes | Yes (read-only) | No |
| **Standard** | Yes | No | No |

When you create a channel, it is automatically assigned to your user account. Admins can view and manage all channels across all users.

The sidebar shows your username and role badge at the bottom.

## Multiple Channels

You can create as many channels as you need — one per YouTube channel, or separate ones for different content series.
