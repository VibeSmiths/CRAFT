# Ideas

The Ideas panel is where content starts. Generate ideas with AI, capture inspiration from YouTube, or add your own manually. It's the default view for a newly-selected channel — click **Ideas** on the top-chrome stage rail to reach it from anywhere.

<SchemeImage name="ideas-panel" alt="Ideas panel — three-column layout" />

## Layout

The panel is a three-column layout:

- **Left — filter rail.** Type (All / Shorts / Long-form), Source (All / AI / Discover / Manual — each with a live count and a coloured dot), Tags (pills that toggle in/out), a **Hide converted** checkbox, and a Sort dropdown.
- **Centre — dense list.** Each idea is a single row: checkbox · type badge · title + hook · source + source metadata · age · action arrow. Click any row to focus it in the right pane.
- **Right — focus pane.** Shows the selected idea's badges, serif title, italic hook, angle, tags, any discovery enrichment (views / likes / transcript), and an action footer (Edit · delete · Convert to script).

## Creating ideas

### Manual

Click **Manual** in the header. A pair of fields appears — title and hook — plus an **Add** button. Manual ideas track with `source: manual` and show a small `✎ Manual` chip.

### AI Generate

<SchemeImage name="ideas-generate" alt="AI generate with inline context hint" />

The **Generate 5 more** button is always visible. Above the list sits an inline **Context hint** input — anything you type there (e.g. "trending topic: kelp forests") is fed to the generator. The current model is shown next to the input; change it via the model picker. Click generate and five new ideas stream into the list, tagged with the model that produced them.

### From Discover

When researching YouTube videos in the [Discover](/guide/discover) panel, click **Inspire** on any video. The idea lands here with `source: discover` and the video's metadata (views, duration, description, transcript if available) carried as enrichment — visible in the focus pane.

## Working the list

- **Search** — type in the box above the list (`⌘F` focuses it in Chrome). Matches title, hook, angle, and tags.
- **Sort** — newest / oldest / title A–Z / source — switchable from the left rail's Sort dropdown.
- **Type toggle** — Short ↔ Long controls both filtering and what's used when you generate.
- **Multi-select** — checkboxes on each row. When anything is selected the toolbar shows **Delete (n)** and **Cancel**.
- **Hide converted** — checkbox in the left rail. Converted ideas still exist, just dim until the box is unchecked.

## Editing an idea

Click a row to focus it, then **Edit** in the right pane. Title / hook / angle are inline form fields; save commits immediately.

## Convert to script

From the focus pane, click **Convert to script**. A new script is created with the idea's title, hook, angle, and any enrichment data (e.g. Discover transcripts are carried in as reference material). The idea is marked `convertedToScript` and dims in the list; the Scripts stage rail lights up with a fresh draft.

::: info Source tracking
Every idea records its `source` (`manual` / `ai` / `discover`). AI-sourced ideas also record the `generatedByModel` for reproducibility. The source chip in the list (`✦ AI · claude sonnet` / `⊕ Discover · 2.4M views`) makes provenance visible at a glance.
:::
