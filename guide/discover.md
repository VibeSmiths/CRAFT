# Discover

The Discover panel is a YouTube research tool powered by yt-dlp. Search for videos, analyze channels, estimate earnings, and save inspiring content as ideas.

## Searching

Enter a search query and press Enter. Results show video cards with thumbnails, view counts, duration, and channel info. Results load progressively — scroll down to automatically fetch more.

<SchemeImage name="discover-search" alt="Discover Search" />

::: tip No API Key Needed
Basic search works without a YouTube API key (uses yt-dlp). Adding a key enables subscriber cap/outlier filters and channel comparison.
:::

## Filters

All filters trigger a re-search immediately:

| Filter | Options | What It Does |
|--------|---------|-------------|
| **Sort** | Relevance, Most viewed, Newest | Result ordering |
| **Duration** | Any, Short (<4m), Medium (4-20m), Long (20m+) | Video length filter |
| **Channel Size** | Any, <1M, <100K, <10K, <1K subs | Subscriber cap — requires API key |
| **Outliers** | All, 5x+, 10x+, 50x+ | Videos with views far above the channel's average — requires API key |

::: info Progressive Loading
Results load in batches as you scroll. With tight filters (e.g. 10x outliers + <10K subs), the backend searches progressively wider — up to 6000 raw results — to find matches.
:::

## Channel Deep Dive

Click a **channel name** (teal link) on any video card to open the deep dive:

<SchemeImage name="channel-dive" alt="Channel Deep Dive" />

Multi-creator videos (collabs) show each creator as a separate link once expanded. The primary channel links to the deep dive, others link to YouTube search.

### Analytics

- **Subscribers**, **Total Views**, **Video Count**
- **Avg Views**, **Upload Frequency**, **Engagement Rate**
- **Subs/Day**, **Shorts Ratio**, **Videos in Last 30 Days**
- **Monetization** badge

### Estimated Earnings

Based on your channel's RPM setting (configurable in [Settings](/guide/settings)):

- **Monthly Revenue** — estimated monthly views x RPM
- **Per Video** — average views x RPM
- **30-Day Views** — projected monthly view count

### Channel Comparison

Inside the deep dive, click **+ Add this channel** to add it to the comparison table. Compare up to 3 channels side-by-side: subscribers, total views, average views, and estimated earnings per video.

### Recent Videos

Scrollable list of the channel's latest videos. Click any to view full metadata.

## Video Detail

Click a video card to see full metadata:

- Views, likes, comments, duration, upload date
- Full description
- Tags and categories
- Chapters (if available)
- **View Transcript** — fetches and displays captions
- **Save as Idea** — creates an idea with all enrichment data

## Save as Idea

Every video card and detail view has a **Save as Idea** button. This creates an idea with:

- Video title as the idea title
- Channel name in the hook
- Enrichment data: views, duration, description, transcript (if fetched)
- Source tracking: `discover` with the original URL
