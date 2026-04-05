# Mobile Features

## Ideas

The Ideas tab mirrors the web app's Ideas panel.

### List View
- Pull-to-refresh
- Search by title, hook, angle, or tags
- Type toggle: All / Short / Long
- "Hide converted" filter
- Long-press to delete

### Create
- Tap the **+** FAB (floating action button) to add a manual idea
- Tap the **AI** FAB (pink) to generate 5 ideas with optional context

### Detail / Edit
- Tap any idea to view/edit title, hook, angle, type, tags
- **Convert to Script** button (green) — creates a script with all idea data
- **View Script** button — appears after conversion, links to the script

## Scripts

### List View
- Status filter chips: All / Draft / Review / Final
- Search by title or tags
- Long-press to delete
- Pull-to-refresh (updates when navigating back from editor)

### Script Detail
- **Model picker** — tap to select Claude or Gemini model from bottom sheet
- **Write / Revise / Polish** buttons with selected model
- **View / Edit** toggle — markdown rendering or raw text editor
- **Status controls** — promote (draft → review → final) or demote
- **Delete** button in the toolbar

::: tip Model Picker
The model picker shows a shortened name (e.g., "sonnet-4-6" instead of "claude-sonnet-4-6"). Tap to open the full list.
:::

## Discover

### Search
- Search bar with submit
- **Dropdown filter pickers** (not toggles):
  - Sort: Relevance / Most viewed / Newest
  - Duration: Any / Short / Medium / Long
  - Channel Size: Any / <1M / <100K / <10K / <1K
  - Outliers: All / 5x+ / 10x+ / 50x+
  - Search Depth: 50 / 100 / 150 / 200
- Changing any filter immediately re-searches
- Results count displayed

### Video Cards
- Thumbnail, title, channel name (tappable), view count, duration
- **Save as Idea** button on each card

### Channel Deep Dive
Tap a channel name to open the deep dive modal:
- Subscriber count, total views, video count
- Avg views, upload frequency, engagement rate
- Subs/day, shorts ratio, 30-day video count
- **Estimated Earnings** — monthly revenue, per-video revenue, 30-day views (based on your RPM)
- Monetization badge, channel age
- Recent videos list (tappable)

### Video Detail
Tap a video card to see:
- Full metadata (views, likes, comments, duration, date)
- Description, tags, chapters
- **View Transcript** — modal with full captions
- **Save as Idea** button

## Episodes

Browse and manage video episodes on your phone:
- Episode list with pipeline stage progress indicators
- Tap to view episode detail with stage status (research → script → storyboard → assets → compositing → export → review → publish)

## Proposals

Review AI-scored content proposals:
- List sorted by score (0-100)
- Approve or reject proposals
- Approved proposals convert to ideas

## Jobs

Monitor async worker jobs in real-time:
- Job list with status filters (queued, running, completed, failed)
- Tap for job detail with output log

## Audio

Full audio production on mobile:
- Voice track listing per script
- Playback controls

## Resources

Browse your downloaded resource library:
- File browser with type filters
- Preview media files

## Settings

- **Server URL** — text input with **Test Connection** button (shows error details on failure)
- **Channel selector** — radio buttons for your channels
- Connection status indicator (green dot / red dot)
