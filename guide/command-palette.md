# Top chrome & ⌘K

The Studio runs on a single top bar — the **top chrome** — instead of a left sidebar. Everything reachable from the old nav now lives either on the stage rail, inside the channel pill dropdown, or behind the avatar menu.

<SchemeImage name="top-chrome" alt="Top chrome: channel pill, peer avatars, stage rail, ⌘K slot, and avatar" />

## What's where

**Row 1 — identity & search**

- **`craft.`** logo (top-left) — click to clear the channel and return to the landing page.
- **Channel pill** — shows the current channel. Click to open the dropdown: switch channels, open channel settings, jump to Proposals or Jobs (if you're premium), or add a new channel.
- **Peer avatars** — the next few channels' initials, one click to switch.
- **⌘K search slot** — opens the command palette. Click or press `⌘K` (`Ctrl+K` on Linux/Windows).
- **Avatar** (top-right) — opens a menu with API keys, change password, color scheme & light/dark, documentation, and sign out.

**Row 2 — the stage rail**

The five primary workflow stages are `Discover → Ideas → Scripts → Audio → Episodes`. The current stage is underlined in accent. On the right side of the rail: `Resources`, `Settings` (when a channel is selected), `Marketplace`, and `Feedback`.

## Command palette (⌘K)

<SchemeImage name="command-palette" alt="Command palette overlay" />

The command palette is the fastest way to navigate. Open it anywhere with `⌘K` or by clicking the search slot.

- **Arrow keys** — move through results
- **Enter** — run the highlighted action
- **Esc** — dismiss

It fuzzy-matches across:

- **Actions** — "Go to Ideas", "Go to Scripts", "Go to Discover", "Go to Audio", "Go to Episodes", "Go to Resources", "Go to Marketplace", "Channel settings".
- **Channel switchers** — "Switch to {channel name}" for every channel you own.

The footer shows your current channel and reminds you of the key bindings.

## Avatar menu

Behind the avatar you'll find:

- **API keys** — paste Claude OAuth tokens, Gemini / OpenAI / ElevenLabs keys, YouTube Data API, GitHub PAT for feedback → issues, etc. All encrypted server-side.
- **Change password** — inline form; uses Keycloak admin REST under the hood.
- **Theme & colors** — the seven color schemes (Classic / Purple / Blue / Amber / Rose / Liquid gold / Otter) plus light/dark mode toggle.
- **Documentation** — links to this guide.
- **Sign out** — ends your Keycloak session and returns to the login flow.

::: tip
Any channel-scoped nav (Proposals, Jobs, channel Settings) is only ever one click deep — open the channel pill and everything for the current channel is listed inline. No more hunt-and-click through nested nav.
:::
