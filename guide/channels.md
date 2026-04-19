# Channels

Channels are the top-level organizer in CRAFT. Each channel has its own character personality, topics, voice settings, and content library.

## Creating a channel

1. Click the **channel pill** in the top chrome (left side, next to the logo) to open the dropdown.
2. Click **+ New channel** at the bottom.
3. Enter a **Channel name** and optional **Character name**.
4. Click **Create**.

<SchemeImage name="create-channel" alt="Create Channel dialog inside the channel pill dropdown" />

You'll land in the new channel's Settings so you can configure character, voice, and topics.

## Channel settings

Open them from the top chrome — either the **Settings** link in the right-rail (only visible when a channel is selected) or the channel-pill dropdown → **Channel settings**. See the full [Settings guide](/guide/settings).

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

## Switching channels

The top chrome gives you three ways to switch:

- **Peer avatars** — the next few channels sit as small avatars next to the channel pill. One click to switch.
- **Channel pill dropdown** — shows every channel you own with subs/character, click to select.
- **⌘K command palette** — type a channel name, hit enter. See [Top chrome & ⌘K](/guide/command-palette).

## Channel Ownership & Multi-Tenant Isolation

Each channel is owned by the user who created it. Access is controlled by Keycloak roles:

| Role | See Own Channels | See Others' Channels | Edit Others' Channels |
|------|-----------------|---------------------|----------------------|
| **Admin** | Yes | Yes | Yes |
| **Editor** | Yes | Yes (read-only) | No |
| **Standard** | Yes | No | No |

When you create a channel, it is automatically assigned to your user account. Admins can view and manage all channels across all users.

Your username and role live under the avatar menu in the top-right of the chrome.

## Multiple Channels

You can create as many channels as you need — one per YouTube channel, or separate ones for different content series.
