# CRAFT — Documentation

User guide built with [VitePress](https://vitepress.dev/), with automated screenshots via [Playwright](https://playwright.dev/).

## Local Development

```bash
cd docs
npm install        # first time only
npm run dev        # starts at http://localhost:5173/VideoIdeas/
```

## Build

```bash
npm run build      # outputs to .vitepress/dist/
npm run preview    # preview the built site
```

## Screenshots

Screenshots are captured automatically by Playwright against the running studio Docker container.

### Take Screenshots Locally

1. Start the studio with seed data:
   ```bash
   # From the repo root
   docker build -t studio-local -f app/Dockerfile app/
   docker run -d --name studio-screenshots \
     -p 8080:8080 \
     -v "$(pwd)/docs/seed/channels:/channels" \
     -e GEMINI_API_KEY="" \
     -e ANTHROPIC_API_KEY="" \
     studio-local
   ```

2. Run Playwright:
   ```bash
   cd docs
   npx playwright install --with-deps chromium   # first time only
   npm run screenshots
   ```

3. Screenshots are saved to `public/screenshots/`.

4. Clean up:
   ```bash
   docker stop studio-screenshots && docker rm studio-screenshots
   ```

### CI Pipeline

On **pull requests**, the CI pipeline automatically:
1. Builds the studio Docker image
2. Starts it with the seed data from `docs/seed/`
3. Runs Playwright to capture screenshots
4. Uploads them as a build artifact

Screenshots are **not** auto-committed — download the artifact from the PR checks and commit manually if they look good.

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
  guide/               # 10 guide pages (setup, ideas, scripts, etc.)
  mobile/              # 3 mobile app pages
  seed/                # Demo data for screenshots
  index.md             # Landing page with hero
  screenshots.spec.ts  # Playwright test spec
  playwright.config.ts # Playwright config
  package.json         # VitePress + Playwright deps
```

## Deployment

The docs deploy to GitHub Pages automatically on push to `main` via the CI workflow. The site is available at:

**https://vibesmiths.github.io/VideoIdeas/**
