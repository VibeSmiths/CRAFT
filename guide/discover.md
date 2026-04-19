# Discover

The Discover panel is a YouTube research tool powered by yt-dlp. Search for videos, analyze channels, estimate earnings, and save inspiring content as ideas. Reach it from the top-chrome stage rail — **Discover** is the leftmost stage.

<SchemeImage name="discover-search" alt="Discover — left filter rail, channel strip, video grid" />

## Layout

- **Left — filter rail.** Search input at the top, then stacked filter sections (Sort by / Duration / Date / Channel size cap / Outlier / Topic tags) and a **Filter loop** status card at the bottom that shows how many videos are currently kept.
- **Main — results area.** Channel strip (when applicable) and the progressively-loaded video grid. Infinite scroll pulls more results when you approach the bottom.

## Searching

Type in the **Search** box in the left rail and hit Enter (or click the button beneath it). Results load in batches — scroll down to fetch more. Your channel's Topic tags show up as pill-buttons in the rail so you can jump straight to relevant queries.

::: tip No API key needed
Basic search works without a YouTube API key (uses yt-dlp). Adding a key enables subscriber-cap and outlier filters plus channel comparison. Status is reflected in which filter groups appear in the left rail.
:::

## Filters

All filters re-run the search as soon as they change.

| Filter | Options | What it does |
|--------|---------|--------------|
| **Sort by** | Relevance / Most viewed / Newest | Result ordering |
| **Duration** | Any / < 4 min (Shorts) / 4–20 min / 20+ min | Video length |
| **Date** | Any time / Past week / Past month / Past year | Recency |
| **Channel size cap** | Any / < 1M / < 100K / < 10K / < 1K | Subscriber cap — requires API key |
| **Outlier** | Any / ≥ 5× / ≥ 10× / ≥ 50× | Videos with views well above the channel's average — requires API key |
| **Topic tags** | Pill-buttons from your channel config | One-click topical searches |

## Filter loop

Because tight filters (e.g. 10× outliers + <10K subs) can eliminate most of any given batch, the backend searches progressively wider — up to ~6000 raw results — to surface matches. The **Filter loop** card at the bottom of the left rail shows live status (`142 kept`, `exhausted`, `searching…`) so you can tell whether to wait or loosen a filter.

## Channel deep dive

<SchemeImage name="channel-dive" alt="Channel Deep Dive" />

Click a **channel name** (accent link) on any video card to open the deep dive. The main column switches to channel-focused view.

**Analytics**

- **Subscribers**, **Total Views**, **Video Count**
- **Avg Views**, **Upload Frequency**, **Engagement Rate**
- **Subs/Day**, **Shorts Ratio**, **Videos in last 30 days**
- **Monetization** badge (≥1K subs + ≥4K watch hours in 12 months)

**Estimated earnings**

Based on your channel's RPM setting (configurable in [Settings](/guide/settings)):

- **Monthly revenue** — estimated monthly views × RPM
- **Per video** — average views × RPM
- **30-day views** — projected monthly view count

**Channel comparison**

Click **+ Add this channel** to add to the comparison table. Compare up to 3 channels side-by-side: subs, total views, avg views, and estimated earnings per video.

**Recent videos**

Scrollable list of the latest uploads. Click any to view full metadata.

## Video detail

Click any video card to expand in-place and see full metadata:

- Views, likes, comments, duration, upload date
- Full description
- Tags and categories
- Chapters (if available)
- **Transcript** — fetches and displays captions
- **Inspire** — creates an idea with all enrichment data

## Inspire

Every video card has an **Inspire** button. It creates an idea with:

- Video title as the idea title
- Channel name in the hook
- Enrichment: views, duration, description, transcript (if fetched)
- Source: `discover`, with the original URL stored for attribution

The idea appears immediately in the Ideas panel, tagged `⊕ Discover` with the view count visible in the list's source column.
