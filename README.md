# CRAFT — Documentation

User guide built with [VitePress](https://vitepress.dev/), with automated screenshots via [Playwright](https://playwright.dev/).

## Local Development

```bash
cd docs
npm install        # first time only
npm run dev        # starts at http://localhost:5173/
```

## Build

```bash
npm run build      # outputs to .vitepress/dist/
npm run preview    # preview the built site
```

## Screenshots

Screenshots are captured automatically by Playwright against a running studio. The spec covers **40 view groups × 7 colour schemes = 280 PNGs** including the top chrome, ⌘K palette, marketplace (browse / gigs / post-gig / partners / my-studio with tiers + badges), publishing accounts + short-form variants, composition editor, and storyboard editor.

### Take screenshots locally

Two options — port-forward a running k3s deployment, or build and run the studio container directly.

**Option A: port-forward (recommended if you have k3s)**

```bash
kubectl port-forward svc/craft-frontend 3000:3000 &
cd docs
npx playwright install --with-deps chromium   # first time only
npx playwright test screenshots.spec.ts
```

**Option B: Docker container**

```bash
# From the repo root
docker build -t studio-local -f app/Dockerfile app/
docker run -d --name studio-screenshots \
  -p 3000:3000 \
  -v "$(pwd)/docs/seed/channels:/channels" \
  -e GEMINI_API_KEY="" \
  -e ANTHROPIC_API_KEY="" \
  studio-local

cd docs && npx playwright test screenshots.spec.ts
```

Screenshots are saved to `public/screenshots/`.

### Test hook

The Playwright spec navigates via `window.__craftStore` (exposed in `app/frontend/src/store/appStore.ts`) rather than chrome selectors, so tests don't drift when the UI changes layout. Call `store.setState({ activeView: '...', openEpisodeId: '...' })` to reach any view.

### CI Pipeline

On **pull requests**, the CI pipeline automatically:
1. Builds the studio Docker image
2. Starts it with the seed data from `docs/seed/`
3. Runs Playwright to capture screenshots
4. Uploads them as a build artifact

Screenshots are **not** auto-committed — download the artifact from the PR checks and commit manually if they look good.

### Adding a new screenshot

1. Add a `test(...)` block in `screenshots.spec.ts` that navigates via `setView(page, '<activeView>')` or by clicking the relevant TopChrome button, then calls `await shotAllSchemes(page, 'name-of-view')`.
2. Run the spec against a live deployment — it writes 7 PNGs (one per scheme).
3. Reference the image in any `docs/guide/*.md` page with `<SchemeImage name="name-of-view" alt="…" />` — VitePress picks the PNG matching the active scheme automatically.

## Seed Data

The `seed/` directory contains demo channel data used for screenshots:

```
seed/channels/demo-channel/
  channel.json         # Channel config (Lorem Ipsum Tech)
  ideas/               # 3 sample ideas (manual, AI, discover)
  scripts/
    drafts/            # 1 draft Short script
    final/             # 1 final Long script
```

To add more seed data, follow the JSON/Markdown formats in `app/backend/src/lib/fileStore.ts`.

## Directory Structure

```
docs/
  .vitepress/
    config.mts         # VitePress config (sidebar, nav, theme)
  public/
    screenshots/       # Playwright-captured images
  guide/               # 18 guide pages (top-chrome / ideas / scripts / discover / audio / storyboard / marketplace / etc.)
  seed/                # Demo data for screenshots
  index.md             # Landing page with hero
  screenshots.spec.ts  # Playwright test spec
  playwright.config.ts # Playwright config
  package.json         # VitePress + Playwright deps
```

## Deployment

The docs deploy automatically on push to `main` via the CI workflow. The site is available at:

**https://docs.mossworks.io/**
