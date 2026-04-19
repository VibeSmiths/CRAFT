import { test, type Page } from '@playwright/test';
import { join } from 'path';

const SCREENSHOT_DIR = join(__dirname, 'public', 'screenshots');
const BASE = `${(process.env.SCREENSHOT_URL || 'http://localhost:3000').replace(/\/studio\/?$/, '')}/api`;
const CHANNEL_NAME = 'Lorem Ipsum Tech';
const CHARACTER_NAME = 'TechExplorer';

// ── Color schemes ─────────────────────────────────────────────────────────────

const SCHEMES = ['xanderu', 'purple', 'blue', 'amber', 'rose', 'liquidgold', 'otter'] as const;

async function setScheme(page: Page, schemeId: string) {
  await page.evaluate((scheme) => {
    const root = document.documentElement;
    root.className = root.className.replace(/\bscheme-\w+\b/g, '').trim();
    if (scheme !== 'xanderu') root.classList.add(`scheme-${scheme}`);
  }, schemeId);
  await page.waitForTimeout(500);
}

/** Take a screenshot in all 7 color schemes for the current view. */
async function shotAllSchemes(page: Page, name: string) {
  for (const scheme of SCHEMES) {
    await setScheme(page, scheme);
    await page.screenshot({ path: join(SCREENSHOT_DIR, `${name}-${scheme}.png`), fullPage: false });
  }
}

// ── Fixtures: dummy data for screenshots ────────────────────────────────────

const DUMMY_IDEAS = [
  { title: 'Why Quantum Computers Will Change Everything', type: 'long', source: 'ai' },
  { title: 'The Hidden Cost of Free Software', type: 'long', source: 'ai' },
  { title: '5 Linux Commands You Use Wrong', type: 'short', source: 'ai' },
  { title: 'Is Rust Actually Faster Than C?', type: 'long', source: 'discover', sourceUrl: 'https://youtube.com/watch?v=example' },
  { title: 'How DNS Actually Works (60s)', type: 'short', source: 'manual' },
];

const DUMMY_SCRIPT = {
  title: 'Why Quantum Computers Will Change Everything',
  content: `---
title: "Why Quantum Computers Will Change Everything"
status: "review"
type: "long"
---

## Introduction

**TechExplorer:** Hey everyone, welcome back to Lorem Ipsum Tech! Today we're diving into something that's going to fundamentally reshape computing as we know it — quantum computers.

*(dramatic pause)*

Now, I know what you're thinking — "quantum computers have been 'five years away' for the last twenty years." And you're not wrong. But here's the thing...

## The Quantum Advantage

**TechExplorer:** Classical computers use bits — zeros and ones. Quantum computers use qubits, which can exist in a superposition of both states simultaneously.

Think of it like this: a classical computer trying to find the exit in a maze has to try each path one at a time. A quantum computer? It explores *every path at once*.

---

## Real-World Applications

**TechExplorer:** So where does this actually matter?

- **Drug discovery** — simulating molecular interactions that would take classical supercomputers millennia
- **Cryptography** — breaking RSA encryption becomes trivial (yes, that's terrifying)
- **Climate modeling** — finally accurate long-term weather prediction
- **AI training** — exponentially faster neural network optimization

## Conclusion

**TechExplorer:** The quantum revolution isn't coming — it's already here. The question isn't *if* it will change everything, but *how fast*.

Thanks for watching! Hit subscribe if you want to stay ahead of the curve. See you in the next one.`,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

let dummyChannelId: string | null = null;

const AUTH_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Auth-Request-User': 'localdev',
  'X-Auth-Request-Email': 'localdev@craft.local',
  'X-Auth-Request-Access-Token': 'eyJhbGciOiJub25lIn0.eyJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iLCJwcmVtaXVtIl19LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsb2NhbGRldiIsImVtYWlsIjoibG9jYWxkZXZAY3JhZnQubG9jYWwiLCJnaXZlbl9uYW1lIjoiTG9jYWwifQ.',
};

async function apiPost(path: string, body: object) {
  const resp = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: AUTH_HEADERS,
    body: JSON.stringify(body),
  });
  return resp.json();
}

async function apiPut(path: string, body: object) {
  const resp = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: AUTH_HEADERS,
    body: JSON.stringify(body),
  });
  return resp.json();
}

async function apiDelete(path: string) {
  await fetch(`${BASE}${path}`, { method: 'DELETE', headers: AUTH_HEADERS });
}

// TopChrome navigation helpers (post-Flow-redesign).
//
// The old Sidebar (<aside>) was replaced by TopChrome (<header>) with a
// channel pill + stage rail (Discover / Ideas / Scripts / Audio / Episodes)
// + right-rail links (Resources / Settings / Marketplace / Feedback).
// Channel-scoped actions (Proposals / Jobs / Channel settings) live inside
// the channel-pill dropdown. Test hook: window.__craftStore exposes the
// Zustand store for views not on the chrome.

async function selectChannel(page: Page) {
  if (!dummyChannelId) return;
  // Fastest + most stable: go through the store directly.
  await page.evaluate((id) => {
    const store = (window as any).__craftStore;
    if (store) store.setState({ selectedChannelId: id });
  }, dummyChannelId);
  await page.waitForTimeout(400);
}

/** Click a primary stage-rail button (Discover / Ideas / Scripts / Audio / Episodes). */
async function clickStageRail(page: Page, label: string) {
  const btn = page.locator('header button', { hasText: new RegExp(`^\\s*${label}\\s*$`, 'i') }).first();
  if (await btn.isVisible()) {
    await btn.click();
    await page.waitForTimeout(800);
  }
}

/** Set the activeView directly through the exposed store. Use for views without a chrome entry. */
async function setView(page: Page, view: string) {
  await page.evaluate((v) => {
    const store = (window as any).__craftStore;
    if (store) store.setState({ activeView: v });
  }, view);
  await page.waitForTimeout(800);
}

/** Open the channel pill dropdown and click a labelled action (Channel settings / Proposals / Jobs). */
async function clickChannelDropdown(page: Page, label: string) {
  // The pill is the first button in the header after the logo.
  const pill = page.locator('header button:has(> div.rounded-full)').first();
  if (!(await pill.isVisible())) return;
  await pill.click();
  await page.waitForTimeout(300);
  const item = page.locator('header button', { hasText: new RegExp(`^\\s*${label}\\s*$`, 'i') }).first();
  if (await item.isVisible()) {
    await item.click();
    await page.waitForTimeout(800);
  } else {
    // Close dropdown if not found
    await page.keyboard.press('Escape');
  }
}

/** Back-compat shims so existing test bodies keep working. */
async function clickChannelNav(page: Page, label: string) {
  // Ideas / Scripts / Audio / Episodes now sit on the stage rail.
  // Channel settings / Proposals / Jobs live in the channel-pill dropdown.
  if (['Ideas', 'Scripts', 'Audio', 'Episodes', 'Discover'].includes(label)) {
    await clickStageRail(page, label);
  } else if (['Settings', 'Channel settings'].includes(label)) {
    await clickChannelDropdown(page, 'Channel settings');
  } else if (['Proposals', 'Jobs'].includes(label)) {
    await clickChannelDropdown(page, label);
  } else {
    // Fallback: try a header text match
    const btn = page.locator('header button', { hasText: label }).first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(800);
    }
  }
}

async function clickGlobalNav(page: Page, label: string) {
  // Discover is on the stage rail; Resources/Marketplace/Feedback are on the right rail.
  await clickStageRail(page, label);
}

// Intercept channel list to show only the dummy channel
async function mockChannelList(page: Page) {
  await page.route('**/api/channels', async (route: any, request: any) => {
    if (request.method() === 'GET') {
      // Fetch real response, filter to only show our dummy channel
      const resp = await route.fetch();
      const channels = await resp.json();
      const filtered = channels.filter((c: any) => c.id === dummyChannelId);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(filtered) });
    } else {
      await route.continue();
    }
  });

  // Mock RVC models — show friendly names instead of real .pth files
  await page.route('**/api/tts/rvc-models', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        models: [
          { name: 'Studio Narrator v2' },
          { name: 'Warm Baritone' },
          { name: 'Energetic Host' },
        ],
      }),
    });
  });
}

// ── Setup / Teardown ────────────────────────────────────────────────────────

test.describe('Documentation Screenshots', () => {
  test.beforeAll(async () => {
    try {
      // Clean up any leftover dummy channels from previous runs
      const channelsResp = await fetch(`${BASE}/channels`, { headers: AUTH_HEADERS });
      const existing = channelsResp.ok ? (await channelsResp.json()) : [];
      for (const ch of Array.isArray(existing) ? existing : []) {
        if (ch.name === CHANNEL_NAME) {
          dummyChannelId = ch.id; // Reuse existing channel
          return; // Skip recreation if it already exists with data
        }
      }

      // Create dummy channel with data
      const ch = await apiPost('/channels', {
        name: CHANNEL_NAME,
        character: CHARACTER_NAME,
        character_description: 'A tech enthusiast who breaks down complex topics with humor and clarity. Known for deep dives into computing, open source, and emerging technology.',
        topics: ['quantum computing', 'programming', 'open source', 'linux', 'cybersecurity'],
        tags: ['tech', 'science', 'tutorial'],
      }) as any;
      dummyChannelId = ch.id;

      // Create dummy ideas
      for (const idea of DUMMY_IDEAS) {
        await apiPost(`/channels/${dummyChannelId}/ideas`, idea);
      }

      // Create dummy script and set to review status (required for audio panel)
      const script = await apiPost(`/channels/${dummyChannelId}/scripts`, {
        title: DUMMY_SCRIPT.title,
        content: DUMMY_SCRIPT.content,
        type: 'long',
      }) as any;
      await apiPut(`/channels/${dummyChannelId}/scripts/${script.id}`, { status: 'review' });
    } catch (err) {
      console.warn('[SCREENSHOTS] beforeAll setup failed, using existing data:', err);
      // Try to find existing channel for screenshots even if setup fails
      try {
        const resp = await fetch(`${BASE}/channels`);
        const channels = resp.ok ? await resp.json() : [];
        const found = Array.isArray(channels) ? channels.find((c: any) => c.name === CHANNEL_NAME) : null;
        if (found) dummyChannelId = found.id;
      } catch { /* give up */ }
    }
  });

  test.afterAll(async () => {
    if (dummyChannelId) {
      await apiDelete(`/channels/${dummyChannelId}`);
    }
  });

  // ── Screenshots (all schemes per view) ──────────────────────────────────

    test.beforeEach(async ({ page }) => {
      await mockChannelList(page);
      await page.goto('/');
      await page.waitForSelector('header', { timeout: 15000 });
      // Wait for the store hook to be attached
      await page.waitForFunction(() => typeof (window as any).__craftStore !== 'undefined', { timeout: 10000 });
    });

      test('landing page', async ({ page }) => {
        await page.waitForTimeout(1000);
        await shotAllSchemes(page, 'landing-page');
      });

      test('ideas panel', async ({ page }) => {
        await selectChannel(page);
        await clickChannelNav(page, 'Ideas');
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'ideas-panel');
      });

      test('ideas generate form', async ({ page }) => {
        await selectChannel(page);
        await clickChannelNav(page, 'Ideas');
        await page.waitForTimeout(300);
        const genBtn = page.locator('button:has(svg)', { hasText: 'Generate' }).first();
        if (await genBtn.isVisible()) {
          await genBtn.click();
          await page.waitForTimeout(500);
        }
        await shotAllSchemes(page, 'ideas-generate');
      });

      test('script editor - draft', async ({ page }) => {
        await selectChannel(page);
        await clickChannelNav(page, 'Scripts');
        await page.waitForTimeout(500);
        const script = page.locator('[class*="cursor-pointer"]').first();
        if (await script.isVisible()) {
          await script.click();
          await page.waitForTimeout(1000);
          await shotAllSchemes(page, 'script-editor');
        }
      });

      test('script editor - fact check', async ({ page }) => {
        await selectChannel(page);
        await clickChannelNav(page, 'Scripts');
        await page.waitForTimeout(500);
        const script = page.locator('[class*="cursor-pointer"]').first();
        if (await script.isVisible()) {
          await script.click();
          await page.waitForTimeout(1000);
          const factBtn = page.locator('button', { hasText: /fact.check/i }).first();
          if (await factBtn.isVisible()) {
            await factBtn.click();
            await page.waitForTimeout(8000);
            await shotAllSchemes(page, 'fact-check');
          }
        }
      });

      test('discover panel', async ({ page }) => {
        test.setTimeout(180000);
        await selectChannel(page);
        await clickGlobalNav(page, 'Discover');
        await page.waitForTimeout(1000);
        const searchInput = page.locator('input[placeholder*="Search YouTube"]').first();
        if (await searchInput.isVisible()) {
          await searchInput.fill('quantum computing explained');
          await searchInput.press('Enter');
          // yt-dlp search can take 30-120s — wait generously
          try {
            await page.locator('text=/views/i').first().waitFor({ state: 'visible', timeout: 120000 });
            await page.waitForTimeout(2000);
          } catch {
            // Take screenshot even with skeletons — better than failing
          }
        }
        await shotAllSchemes(page, 'discover-search');
      });

      test('discover - channel dive', async ({ page }) => {
        test.setTimeout(180000);
        await selectChannel(page);
        await clickGlobalNav(page, 'Discover');
        await page.waitForTimeout(500);
        // The left filter rail has a single search input at the top
        const searchInput = page.locator('aside input[type="text"], main input[type="text"]').first();
        if (await searchInput.isVisible()) {
          await searchInput.fill('tech review');
          await searchInput.press('Enter');
          try {
            await page.locator('text=/views/i').first().waitFor({ state: 'visible', timeout: 120000 });
            await page.waitForTimeout(2000);
          } catch { /* proceed with what we have */ }
        }
        // Click the first channel link inside a video card (accent color)
        const channelBtn = page.locator('main button.text-accent-400').first();
        if (await channelBtn.isVisible()) {
          await channelBtn.click();
          await page.waitForTimeout(8000);
        }
        await shotAllSchemes(page, 'channel-dive');
      });

      test('resources panel', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'resources-search');
        const searchInput = page.locator('input[placeholder*="Search"]').first();
        if (await searchInput.isVisible()) {
          await searchInput.fill('nature');
          await searchInput.press('Enter');
          await page.waitForTimeout(5000);
        }
        await shotAllSchemes(page, 'resources-search');
      });

      test('resources - library', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'resources-library');
        await shotAllSchemes(page, 'resources-library');
      });

      test('resources - audio sections', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'audio-create');
        // Try to select the channel and script to show sections
        try {
          const channelCard = page.locator('main button', { hasText: CHANNEL_NAME }).first();
          if (await channelCard.isVisible({ timeout: 3000 })) {
            await channelCard.click();
            await page.waitForTimeout(1000);
          }
          // Try all selects — the script dropdown may be the first or second
          const selects = page.locator('main select');
          const count = await selects.count();
          for (let i = 0; i < count; i++) {
            const sel = selects.nth(i);
            const options = await sel.locator('option').allTextContents();
            const scriptOpt = options.find(o => o.includes('Quantum') || (o !== '' && !o.startsWith('—') && !o.startsWith('Select')));
            if (scriptOpt) {
              await sel.selectOption({ label: scriptOpt });
              await page.waitForTimeout(1500);
              break;
            }
          }
        } catch { /* proceed with whatever state we have */ }
        await shotAllSchemes(page, 'audio-sections');
      });

      test('settings panel - overview', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'settings');
        await shotAllSchemes(page, 'settings-panel');
      });

      test('settings panel - mcp servers', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'settings');
        await page.evaluate(() => {
          const el = document.querySelector('main');
          if (el) el.scrollTop = el.scrollHeight * 0.7;
        });
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'mcp-servers');
      });

      test('settings panel - voice picker', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'settings');
        await page.evaluate(() => {
          const el = document.querySelector('main');
          if (el) el.scrollTop = el.scrollHeight * 0.4;
        });
        await page.waitForTimeout(300);
        await shotAllSchemes(page, 'voice-picker');
      });

      test('settings panel - ollama models', async ({ page }) => {
        await page.waitForTimeout(1500);
        await selectChannel(page);
        await setView(page, 'settings');
        await page.evaluate(() => {
          const headings = Array.from(document.querySelectorAll('h3'));
          const ollamaH3 = headings.find(h => h.textContent?.includes('Local AI'));
          if (ollamaH3) {
            ollamaH3.scrollIntoView({ block: 'start', behavior: 'instant' });
          } else {
            const el = document.querySelector('main');
            if (el) el.scrollTop = el.scrollHeight * 0.85;
          }
        });
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'ollama-models');
      });

      test('image generate panel', async ({ page }) => {
        test.setTimeout(120000);
        await page.waitForTimeout(1500);
        await selectChannel(page);
        await setView(page, 'image-generate');
        // Fill in a prompt for a nicer screenshot
        const promptArea = page.locator('main textarea').first();
        if (await promptArea.isVisible()) {
          await promptArea.fill('futuristic cityscape at sunset, cyberpunk neon lights, detailed architecture, cinematic lighting');
          await page.waitForTimeout(500);
          // Try to generate if ComfyUI is available — click the Generate button in the main content area (not sidebar)
          const generateBtn = page.locator('main button:has-text("Generate")').first();
          if (await generateBtn.isVisible() && await generateBtn.isEnabled()) {
            await generateBtn.click();
            try {
              // Wait for image to appear in gallery
              await page.locator('main img[src*="/api/"]').first().waitFor({ state: 'visible', timeout: 60000 });
              await page.waitForTimeout(2000);
            } catch {
              // ComfyUI may be processing — wait for any status change
              await page.waitForTimeout(5000);
            }
          }
        }
        await shotAllSchemes(page, 'image-generate');
      });

      test('music generate panel', async ({ page }) => {
        test.setTimeout(180000);
        await page.waitForTimeout(1500);
        await selectChannel(page);
        await setView(page, 'audio-music');
        // Fill in a dummy prompt and generate — scope to main content area (not sidebar)
        const main = page.locator('main, [class*="flex-1"]').last();
        const promptArea = main.locator('textarea').first();
        if (await promptArea.isVisible()) {
          await promptArea.fill('upbeat cinematic orchestral theme, triumphant brass, epic drums, no vocals');
          // Click the Generate Music button in the main panel (not sidebar)
          const genBtn = main.locator('button', { hasText: 'Generate Music' }).first();
          if (await genBtn.isVisible() && await genBtn.isEnabled()) {
            await genBtn.click();
            // Wait for generated track to appear, or error/timeout
            try {
              await page.locator('text=Generated Tracks').first().waitFor({ state: 'visible', timeout: 120000 });
              await page.waitForTimeout(2000);
            } catch {
              // GPU service unavailable — wait for error state to settle
              await page.waitForTimeout(10000);
            }
          }
        }
        await shotAllSchemes(page, 'music-generate');
      });

      test('voice train panel', async ({ page }) => {
        await page.waitForTimeout(1500);
        await selectChannel(page);
        await setView(page, 'audio-train');
        await shotAllSchemes(page, 'voice-train');
      });

      test('proposals panel', async ({ page }) => {
        // Mock proposals API with dummy data
        await page.route('**/api/channels/*/proposals**', async (route: any, request: any) => {
          if (request.method() === 'GET') {
            const now = new Date().toISOString();
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ proposals: [
                { id: 'p1', channelId: dummyChannelId, title: 'Why Everyone Is Wrong About Quantum Error Correction', hook: 'The biggest breakthrough in quantum computing isn\'t what you think', angle: 'Debunk popular misconceptions about QEC using recent IBM/Google papers', type: 'long', tags: ['quantum', 'computing', 'science'], score: 92, reasoning: 'Strong search trend + gap in explainer content', trendSignals: [{ source: 'Google Trends', metric: '↑ 340% (30d)' }, { source: 'YouTube', metric: '< 5 videos in last 90d' }], status: 'proposed', created: now },
                { id: 'p2', channelId: dummyChannelId, title: 'Linux Gaming in 2026: The Year It Actually Happened', hook: 'Steam Deck changed everything — here\'s the data', angle: 'Data-driven analysis of Linux gaming market share shift', type: 'long', tags: ['linux', 'gaming', 'steam'], score: 87, reasoning: 'Timely — Steam hardware survey shows Linux at 4.2%', trendSignals: [{ source: 'Steam Survey', metric: 'Linux 4.2% (+1.8% YoY)' }], status: 'approved', created: now },
                { id: 'p3', channelId: dummyChannelId, title: 'The USB-C Cable Scam Nobody Talks About', hook: '90% of USB-C cables can\'t do what you think', angle: 'Test 20 popular cables and expose misleading marketing', type: 'short', tags: ['tech', 'consumer', 'hardware'], score: 78, reasoning: 'High engagement potential — consumer frustration topic', trendSignals: [{ source: 'Reddit', metric: '12 front-page posts (7d)' }], status: 'proposed', created: now },
                { id: 'p4', channelId: dummyChannelId, title: 'Building a Home Server for $50', hook: 'Old hardware + open source = unlimited power', angle: 'Step-by-step with Proxmox on salvaged hardware', type: 'long', tags: ['homelab', 'linux', 'tutorial'], score: 71, reasoning: 'Evergreen topic, strong search volume', trendSignals: [{ source: 'YouTube', metric: 'Avg 200K views in niche' }], status: 'rejected', created: now },
                { id: 'p5', channelId: dummyChannelId, title: 'AI Code Editors Ranked (Honest Review)', hook: 'I used every AI coding tool for a month', angle: 'Head-to-head comparison with real projects, not toy demos', type: 'long', tags: ['ai', 'programming', 'tools'], score: 95, reasoning: 'Highest search volume in dev tools category', trendSignals: [{ source: 'Google Trends', metric: '↑ 520% (90d)' }, { source: 'HN', metric: '3 front-page discussions' }], status: 'in_production', created: now },
              ] }),
            });
          } else {
            await route.continue();
          }
        });

        await selectChannel(page);
        await setView(page, 'proposals');
        await shotAllSchemes(page, 'proposals-panel');
      });

      test('jobs panel', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'jobs');
        await shotAllSchemes(page, 'jobs-panel');
      });

      test('episodes panel', async ({ page }) => {
        // Mock episodes API with dummy data at various stages
        await page.route(`**/api/channels/*/episodes`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                episodes: [
                  { id: 'ep-quantum-error', title: 'Quantum Error Correction Explained', slug: 'ep-quantum-error', channelId: dummyChannelId, targetDuration: '12:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'in_progress' }, compositing: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-linux-gaming', title: 'Linux Gaming: The Year It Happened', slug: 'ep-linux-gaming', channelId: dummyChannelId, targetDuration: '15:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'complete' }, compositing: { status: 'complete' }, export: { status: 'complete' }, review: { status: 'needs_human' }, publish: { status: 'not_started' } } },
                  { id: 'ep-usb-scam', title: 'The USB-C Cable Scam', slug: 'ep-usb-scam', channelId: dummyChannelId, targetDuration: '0:58', pipeline: { research: { status: 'complete' }, script: { status: 'review' }, storyboard: { status: 'not_started' }, assets: { status: 'not_started' }, compositing: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-home-server', title: 'Home Server for $50', slug: 'ep-home-server', channelId: dummyChannelId, targetDuration: '10:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'complete' }, compositing: { status: 'complete' }, export: { status: 'complete' }, review: { status: 'approved' }, publish: { status: 'complete' } } },
                  { id: 'ep-ai-editors', title: 'AI Code Editors Ranked', slug: 'ep-ai-editors', channelId: dummyChannelId, targetDuration: '18:00', pipeline: { research: { status: 'in_progress' }, script: { status: 'not_started' }, storyboard: { status: 'not_started' }, assets: { status: 'not_started' }, compositing: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-rust-vs-c', title: 'Is Rust Actually Faster Than C?', slug: 'ep-rust-vs-c', channelId: dummyChannelId, targetDuration: '14:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'error' }, assets: { status: 'not_started' }, compositing: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                ],
              }),
            });
          } else {
            await route.continue();
          }
        });

        await selectChannel(page);
        await setView(page, 'episodes');
        await page.waitForTimeout(1000);
        await shotAllSchemes(page, 'episodes-panel');
      });

      test('episode detail - pipeline stages', async ({ page }) => {
        // Mock episodes with one that has compositing complete for preview
        await page.route(`**/api/channels/*/episodes`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                episodes: [
                  { id: 'ep-quantum-error', title: 'Quantum Error Correction Explained', slug: 'ep-quantum-error', channelId: dummyChannelId, targetDuration: '12:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'needs_human' }, assets: { status: 'not_started' }, compositing: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                ],
              }),
            });
          } else {
            await route.continue();
          }
        });
        // Mock artifacts for the storyboard viewer
        await page.route(`**/api/channels/*/episodes/ep-quantum-error/artifacts/storyboard`, async (route: any) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ type: 'storyboard', content: '# Storyboard: Quantum Error Correction\n\n## Scene 1: Hook (0:00-0:15)\n**Components:** `<TitleSection>`, `<ParticleBackground>`\n**Layout:** Centered title over animated particles\n**Timing:** Frames 0-450 at 30fps\n**Animation:** Title springs in, particles drift upward\n\n## Scene 2: The Problem (0:15-0:45)\n**Components:** `<Container>`, `<CodeBlock>`\n**Layout:** Split — diagram left, code right\n**Animation:** Slide in from left, code types in character by character' }),
          });
        });

        await selectChannel(page);
        await setView(page, 'episodes');
        await page.waitForTimeout(1000);
        // Click the first episode card to open detail
        const card = page.locator('button', { hasText: 'Quantum Error Correction' }).first();
        if (await card.isVisible()) {
          await card.click();
          await page.waitForTimeout(500);
          // Expand the storyboard artifact viewer
          const chevron = page.locator('button[title="View artifact"]').first();
          if (await chevron.isVisible()) await chevron.click();
          await page.waitForTimeout(500);
        }
        await shotAllSchemes(page, 'episode-detail');
      });

      test('pipeline config in settings', async ({ page }) => {
        await selectChannel(page);
        await selectChannel(page);
        await setView(page, 'settings');
        // Scroll to Pipeline Configuration section
        const pipelineSection = page.locator('h3', { hasText: 'Pipeline Configuration' }).first();
        if (await pipelineSection.isVisible()) {
          await pipelineSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(300);
        }
        await shotAllSchemes(page, 'pipeline-config');
      });

      test('create channel form', async ({ page }) => {
        // Open the channel pill dropdown and click "New channel"
        const pill = page.locator('header button:has(> div.rounded-full)').first();
        if (await pill.isVisible()) {
          await pill.click();
          await page.waitForTimeout(300);
          const newBtn = page.locator('header button', { hasText: /new channel/i }).first();
          if (await newBtn.isVisible()) {
            await newBtn.click();
            await page.waitForTimeout(500);
            await shotAllSchemes(page, 'create-channel');
          }
        }
      });

      test('profile popover', async ({ page }) => {
        // Avatar button lives in the top-right of the header
        const avatar = page.locator('header button.bg-accent-500').first();
        if (await avatar.isVisible()) {
          await avatar.click();
          await page.waitForTimeout(500);
          await shotAllSchemes(page, 'profile-popover');
        }
      });

      test('password change form', async ({ page }) => {
        const avatar = page.locator('header button.bg-accent-500').first();
        if (await avatar.isVisible()) {
          await avatar.click();
          await page.waitForTimeout(500);
          const passwordBtn = page.locator('button', { hasText: /change password/i }).first();
          if (await passwordBtn.isVisible()) {
            await passwordBtn.click();
            await page.waitForTimeout(500);
            await shotAllSchemes(page, 'password-change');
          }
        }
      });

      test('settings nav — channel pill dropdown', async ({ page }) => {
        await selectChannel(page);
        await page.waitForTimeout(400);
        // Open the channel pill dropdown so Settings/Proposals/Jobs items are visible
        const pill = page.locator('header button:has(> div.rounded-full)').first();
        if (await pill.isVisible()) {
          await pill.click();
          await page.waitForTimeout(300);
          await shotAllSchemes(page, 'settings-nav');
        }
      });

      test('ollama models in model select', async ({ page }) => {
        // Mock Ollama models endpoint
        await page.route('**/api/ai/models', async (route: any) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              ollama: [
                { name: 'llama3.1:8b', size: '4.7 GB' },
                { name: 'mistral:7b', size: '4.1 GB' },
                { name: 'codellama:13b', size: '7.4 GB' },
              ],
              claude: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250414'],
              gemini: ['gemini-2.0-flash'],
            }),
          });
        });

        await selectChannel(page);
        await setView(page, 'ideas');
        await page.waitForTimeout(500);
        // Open the model select dropdown in the new ModelSelect
        const modelSelect = page.locator('main select').first();
        if (await modelSelect.isVisible()) {
          await modelSelect.click();
          await page.waitForTimeout(300);
          await shotAllSchemes(page, 'ollama-model-select');
        }
      });

      // ── New views added for the Flow redesign ────────────────────────

      test('top chrome — landing with stage rail', async ({ page }) => {
        // Visit landing without selecting a channel; header shows pill + stage rail
        await page.evaluate(() => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ selectedChannelId: null, activeView: 'ideas' });
        });
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'top-chrome');
      });

      test('command palette — ⌘K overlay', async ({ page }) => {
        await selectChannel(page);
        await page.waitForTimeout(400);
        // Trigger via the custom event to avoid OS-specific key combos
        await page.evaluate(() => document.dispatchEvent(new CustomEvent('craft:cmdk')));
        await page.waitForTimeout(400);
        await shotAllSchemes(page, 'command-palette');
      });

      test('marketplace — browse', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'marketplace');
        await page.waitForTimeout(800);
        await shotAllSchemes(page, 'marketplace-browse');
      });

      test('marketplace — my studio', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'marketplace');
        await page.waitForTimeout(400);
        // Click "My studio" sub-tab in the marketplace chrome
        const studioTab = page.locator('button', { hasText: /^\s*My studio\s*$/i }).first();
        if (await studioTab.isVisible()) {
          await studioTab.click();
          await page.waitForTimeout(600);
        }
        await shotAllSchemes(page, 'marketplace-studio');
      });

      test('storyboard editor', async ({ page }) => {
        // Mock episode + script preview-sections endpoints so the editor populates
        await page.route(`**/api/channels/*/episodes/*`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                episode: {
                  id: 'ep-quantum-error',
                  title: 'Quantum Error Correction Explained',
                  channelId: dummyChannelId,
                  scriptId: null, // force script-picker to reveal the dropdown
                  pipeline: { storyboard: { status: 'in_progress' } },
                },
                artifacts: {},
              }),
            });
          } else {
            await route.continue();
          }
        });

        await selectChannel(page);
        // Set both openEpisodeId and activeView in one go
        await page.evaluate(() => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ openEpisodeId: 'ep-quantum-error', activeView: 'storyboard' });
        });
        await page.waitForTimeout(1200);
        // Pick the first script from the dropdown so the 3-col layout renders
        const select = page.locator('main select').first();
        if (await select.isVisible()) {
          const opts = await select.locator('option').allTextContents();
          const scriptOpt = opts.find(o => o && !o.startsWith('—') && !o.startsWith('No scripts'));
          if (scriptOpt) {
            await select.selectOption({ label: scriptOpt });
            await page.waitForTimeout(1500);
          }
        }
        await shotAllSchemes(page, 'storyboard-editor');
      });
});
