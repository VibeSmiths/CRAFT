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

/** Synthetic channel used when beforeAll fails to create one (which can happen
 * if the backend state isn't exactly what we expect). Keeps every
 * channel-dependent test from silently rendering "Select a channel". */
const SYNTHETIC_CHANNEL_ID = 'screenshot-dummy';
const SYNTHETIC_CHANNEL = {
  id: SYNTHETIC_CHANNEL_ID,
  name: CHANNEL_NAME,
  character: CHARACTER_NAME,
  character_description: 'A tech enthusiast who breaks down complex topics with humor and clarity.',
  voice: null,
  topics: ['quantum computing', 'programming', 'open source', 'linux', 'cybersecurity'],
  tags: ['tech', 'science', 'tutorial'],
  avatar: null,
  rpm: 4,
  color: null,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};
function effectiveChannelId(): string { return dummyChannelId ?? SYNTHETIC_CHANNEL_ID; }

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
  const id = effectiveChannelId();
  const synthetic = { ...SYNTHETIC_CHANNEL, id };
  // Poke channels[] directly too — mockChannelList populates the backend
  // response, but in some flows the store is loaded eagerly with a stale
  // empty list before the mock settles. This forces state consistency.
  await page.evaluate(({ id, synthetic }) => {
    const store = (window as any).__craftStore;
    if (!store) return;
    const existing = store.getState?.().channels ?? [];
    const hasIt = existing.some((c: any) => c.id === id);
    const channels = hasIt ? existing : [synthetic, ...existing];
    store.setState({ selectedChannelId: id, channels });
  }, { id, synthetic });
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

// ── Per-feature mocks (used by discover / ideas / audio tests so screenshots
//     don't depend on flaky backends or missing Ollama models) ─────────────

async function mockDiscover(page: Page) {
  // Fake videos + channels for /api/youtube/discover
  const videos = Array.from({ length: 8 }, (_, i) => ({
    id: `vid-${i}`,
    title: [
      'Quantum Computing, Explained in 10 Minutes',
      'Why I Stopped Using Docker (and what I use now)',
      'Rust is Faster Than C — Here\'s the Benchmark',
      'The Real Reason Your SSD is Slow',
      'A Linux Desktop That Actually Works in 2026',
      'Every Programmer Should Know This Algorithm',
      'I Built a Home Server for $47 — Here\'s How',
      'ChatGPT Can\'t Do This One Simple Task',
    ][i],
    channelId: `ch-${i}`,
    channelTitle: ['Quantum Weekly','Terminal Thoughts','Rust Dispatch','PixelForge','Linux Afternoon','AlgorithmsAreCool','TinyServer','AI Sceptic'][i],
    description: 'A deep, approachable dive with code examples, diagrams, and zero fluff.',
    thumbnail: `https://i.ytimg.com/vi/vid-${i}/mqdefault.jpg`,
    viewCount: ['240000','58000','812000','94000','1400000','320000','410000','78000'][i],
    publishedAt: new Date(Date.now() - (i + 1) * 86400_000 * 3).toISOString(),
    url: `https://www.youtube.com/watch?v=vid-${i}`,
    duration: [624, 1820, 941, 512, 2240, 1320, 720, 865][i],
    likeCount: ['18000','5200','92000','8200','140000','40000','35000','6900'][i],
    commentCount: ['1120','430','6100','760','8900','2900','3100','530'][i],
    vph: [420, 180, 950, 260, 1820, 540, 700, 200][i],
    isShort: false,
  }));
  const channels: Record<string, unknown> = {};
  for (let i = 0; i < 8; i++) {
    channels[`ch-${i}`] = {
      id: `ch-${i}`,
      name: videos[i].channelTitle,
      thumbnail: '',
      subscriberCount: ['48000','12000','210000','30000','940000','85000','120000','22000'][i],
      totalViews: ['3200000','420000','18000000','1100000','140000000','5900000','8400000','920000'][i],
      videoCount: ['210','54','320','97','610','180','240','68'][i],
      createdAt: new Date(Date.now() - (i + 3) * 365 * 86400_000).toISOString(),
    };
  }
  await page.route('**/api/youtube/discover*', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ videos, channels, hasApiKey: true, exhausted: false }) });
  });
  // Channel deep dive
  await page.route('**/api/youtube/channel/*', async (route: any) => {
    const url = new URL(route.request().url());
    const channelId = url.pathname.split('/').pop() || 'ch-0';
    const recent = videos.slice(0, 12).map((v, i) => ({ ...v, channelId, id: `vid-${channelId}-${i}` }));
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({
        channel: channels[channelId] ?? channels['ch-0'],
        recentVideos: recent,
        avgViews: 420_000,
        uploadFrequency: '2.4 videos / week',
        hasApiKey: true,
        analytics: {
          channelAgeDays: 1280, channelAgeYears: 3.5,
          subsPerDay: 22, avgEngagementRate: 0.038,
          shortsCount: 42, longsCount: 168, shortsRatio: 0.2,
          monetizationEligible: true, videosLast30Days: 8,
          estimatedMonthlyViews: 1_800_000,
        },
      }),
    });
  });
}

async function mockAiIdeas(page: Page) {
  await page.route('**/api/ai/ideas', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { title: 'Why the M5 Pro Changed Laptop Benchmarks Forever', hook: 'It\'s not the chip — it\'s the memory.', angle: 'Bench-heavy with side-by-side latency graphs.', tags: ['apple','hardware','benchmarks'], generatedByModel: 'qwen2.5:7b' },
        { title: 'The Quietest Tech Revolution: File Systems', hook: 'Nobody noticed btrfs grew up.', angle: 'Casual explainer; show disk-layout diagrams.', tags: ['linux','filesystems','deep-dive'], generatedByModel: 'qwen2.5:7b' },
        { title: 'I Stopped Writing Tests for a Month. Here\'s What Broke.', hook: 'Spoiler: more than I expected, less than I feared.', angle: 'Personal, numbered findings.', tags: ['testing','engineering'], generatedByModel: 'qwen2.5:7b' },
        { title: 'Every Keyboard Shortcut I Actually Use, Ranked by Usage', hook: 'I tracked them for 30 days.', angle: 'Surprising list from a heatmap dashboard.', tags: ['productivity','keyboards'], generatedByModel: 'qwen2.5:7b' },
        { title: 'Why 90% of DIY Home Servers Die in Year 2', hook: 'Your NUC is a ticking UPS bomb.', angle: 'Field-report style; failure mode by root cause.', tags: ['homelab','self-hosting','reliability'], generatedByModel: 'qwen2.5:7b' },
      ]),
    });
  });
}

async function mockJobs(page: Page) {
  const now = Date.now();
  const jobs = [
    {
      id: 'job-1776607046-abc1',
      type: 'orchestrate',
      channelId: effectiveChannelId(),
      episodeId: 'ep-quantum-error',
      status: 'running',
      via: 'nats',
      startedAt: new Date(now - 4 * 60_000).toISOString(),
      output: ['[orchestrate] Stage: script — iteration 1/3', '[orchestrate] Agent running (qwen2.5:7b)'],
    },
    {
      id: 'job-1776606885-def2',
      type: 'proposal-generate',
      channelId: effectiveChannelId(),
      status: 'completed',
      via: 'nats',
      startedAt: new Date(now - 22 * 60_000).toISOString(),
      finishedAt: new Date(now - 20 * 60_000).toISOString(),
      durationMs: 118_000,
      output: ['[proposals] Generated 5 proposals (avg score 81/100)'],
    },
    {
      id: 'job-1776606720-ghi3',
      type: 'highlight-pick',
      channelId: effectiveChannelId(),
      episodeId: 'ep-quantum-error',
      status: 'completed',
      via: 'nats',
      startedAt: new Date(now - 48 * 60_000).toISOString(),
      finishedAt: new Date(now - 47 * 60_000).toISOString(),
      durationMs: 13_000,
      output: ['[highlight-pick] Picked 4 candidates (ytshorts: 2, tiktok: 1, x-clip: 1)'],
    },
    {
      id: 'job-1776606512-jkl4',
      type: 'render',
      channelId: effectiveChannelId(),
      episodeId: 'ep-quantum-error',
      status: 'completed',
      via: 'nats',
      startedAt: new Date(now - 90 * 60_000).toISOString(),
      finishedAt: new Date(now - 88 * 60_000).toISOString(),
      durationMs: 132_000,
      output: ['[composition-render] ffmpeg compose complete → final.mp4 (48.3 MB)'],
    },
    {
      id: 'job-1776606305-mno5',
      type: 'upload-youtube',
      channelId: effectiveChannelId(),
      episodeId: 'ep-linux-gaming',
      status: 'failed',
      via: 'nats',
      error: 'YouTube API: The request cannot be completed because you have exceeded your quota.',
      startedAt: new Date(now - 155 * 60_000).toISOString(),
      finishedAt: new Date(now - 154 * 60_000).toISOString(),
      durationMs: 62_000,
      output: ['[upload-youtube] Resumable session initialized', '[upload-youtube] ERROR: quota exceeded'],
    },
    {
      id: 'job-1776605988-pqr6',
      type: 'tts-generate',
      channelId: effectiveChannelId(),
      status: 'completed',
      via: 'nats',
      startedAt: new Date(now - 3 * 3600_000).toISOString(),
      finishedAt: new Date(now - 3 * 3600_000 + 240_000).toISOString(),
      durationMs: 240_000,
      output: ['[tts] Completed: 12/12 sections'],
    },
  ];
  await page.route('**/api/jobs*', async (route: any, request: any) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(jobs) });
    } else {
      await route.continue();
    }
  });
}

async function mockAudioProject(page: Page) {
  const projectId = 'audio-demo-proj';
  const scriptId = 'script-demo-id';
  // Ensure listScripts + getScript return our demo script so the user can pick it
  await page.route(`**/api/channels/*/scripts`, async (route: any, request: any) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{
        id: scriptId, title: 'Why Quantum Computers Will Change Everything',
        type: 'long', status: 'review', tags: ['quantum','tech'],
        wordCount: 840, generatedByModel: 'qwen2.5:7b',
        created: new Date().toISOString(), updated: new Date().toISOString(),
      }]) });
    } else {
      await route.continue();
    }
  });
  await page.route(`**/api/channels/*/scripts/${scriptId}`, async (route: any, request: any) => {
    if (request.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        id: scriptId, title: 'Why Quantum Computers Will Change Everything',
        type: 'long', status: 'review', tags: ['quantum','tech'],
        wordCount: 840,
        content: '## Cold open\n\n**TechExplorer:** Hey everyone...\n\n## The Qubit, Plain-English\n\nClassical bits are off or on...\n',
        generatedByModel: 'qwen2.5:7b',
        created: new Date().toISOString(), updated: new Date().toISOString(),
      }) });
    } else {
      await route.continue();
    }
  });
  // TTS services + voices so the voice picker doesn't error out
  await page.route('**/api/tts/services', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      edge: true, openai: false, elevenlabs: false, openedai: false,
    }) });
  });
  await page.route('**/api/tts/voices**', async (route: any) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
      { id: 'en-US-GuyNeural', name: 'Guy (US Male)', language: 'en-US', gender: 'male' },
      { id: 'en-US-JennyNeural', name: 'Jenny (US Female)', language: 'en-US', gender: 'female' },
    ]) });
  });
  const sections = [
    { id: 's0', index: 0, title: 'Cold open', text: 'Hey everyone, today we\'re diving into quantum computers — and for once, I think the hype actually earns its keep.', delayAfter: 400, status: 'ready', audioFile: 'section-000.mp3', duration: 6.2 },
    { id: 's1', index: 1, title: 'The Qubit, Plain-English', text: 'Classical bits are off or on. Qubits can be both, simultaneously — and that changes everything about how search scales.', delayAfter: 300, status: 'ready', audioFile: 'section-001.mp3', duration: 9.8 },
    { id: 's2', index: 2, title: 'Real-world applications', text: 'Drug discovery. Cryptography — yes, including the one guarding your bank. Climate modeling, AI training. Not in ten years — in three.', delayAfter: 500, status: 'ready', audioFile: 'section-002.mp3', duration: 12.1 },
    { id: 's3', index: 3, title: 'The speed-bump', text: 'But qubits are fragile. A stray magnetic field and the whole calculation collapses. That\'s why error correction is the real frontier.', delayAfter: 400, status: 'ready', audioFile: 'section-003.mp3', duration: 10.7 },
    { id: 's4', index: 4, title: 'Call to action', text: 'If this made sense — hit subscribe. Next week: a live demo of Grover\'s algorithm solving a search faster than any classical machine can.', delayAfter: 0, status: 'ready', audioFile: 'section-004.mp3', duration: 8.9 },
  ];
  const project = {
    id: projectId, channelId: effectiveChannelId(), scriptId,
    scriptTitle: 'Why Quantum Computers Will Change Everything',
    service: 'edge', voiceId: 'en-US-GuyNeural', voiceName: 'Guy (Edge)',
    mergedFile: null, totalDuration: sections.reduce((a, s) => a + s.duration, 0),
    status: 'ready', episodeId: null, backgroundTrack: null,
    originalUpload: null,
    sections,
    created: new Date().toISOString(), updated: new Date().toISOString(),
  };
  await page.route('**/api/tts/projects*', async (route: any, request: any) => {
    if (request.method() === 'GET') {
      const url = request.url();
      if (/\/projects\/[^?]+/.test(new URL(url).pathname)) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(project) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([project]) });
      }
    } else {
      await route.continue();
    }
  });
}

// Intercept channel list to show only the dummy channel (falls back to a
// synthetic channel when beforeAll couldn't create one, so settings-family
// tests don't silently render "Select a channel").
async function mockChannelList(page: Page) {
  await page.route('**/api/channels', async (route: any, request: any) => {
    if (request.method() === 'GET') {
      let filtered: any[] = [];
      try {
        const resp = await route.fetch();
        const channels = await resp.json();
        if (Array.isArray(channels) && dummyChannelId) {
          filtered = channels.filter((c: any) => c.id === dummyChannelId);
        }
      } catch { /* fall through to synthetic */ }
      if (filtered.length === 0) {
        // Make the synthetic id match whatever effectiveChannelId() returns, so
        // mockChannelList + selectChannel can't disagree if beforeAll left a
        // stale dummyChannelId behind.
        filtered = [{ ...SYNTHETIC_CHANNEL, id: effectiveChannelId() }];
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(filtered) });
    } else {
      await route.continue();
    }
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
        await mockAiIdeas(page);
        await selectChannel(page);
        await clickChannelNav(page, 'Ideas');
        await page.waitForTimeout(300);
        const genBtn = page.locator('button:has(svg)', { hasText: 'Generate' }).first();
        if (await genBtn.isVisible()) {
          await genBtn.click();
          await page.waitForTimeout(1200);
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
        await mockDiscover(page);
        await selectChannel(page);
        await clickGlobalNav(page, 'Discover');
        await page.waitForTimeout(500);
        const searchInput = page.locator('input[placeholder*="Search YouTube"]').first();
        if (await searchInput.isVisible()) {
          await searchInput.fill('quantum computing explained');
          await searchInput.press('Enter');
          await page.locator('text=/views/i').first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
          await page.waitForTimeout(800);
        }
        await shotAllSchemes(page, 'discover-search');
      });

      test('discover - channel dive', async ({ page }) => {
        await mockDiscover(page);
        await selectChannel(page);
        await clickGlobalNav(page, 'Discover');
        await page.waitForTimeout(400);
        const searchInput = page.locator('aside input[type="text"], main input[type="text"]').first();
        if (await searchInput.isVisible()) {
          await searchInput.fill('tech review');
          await searchInput.press('Enter');
          await page.locator('text=/views/i').first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
          await page.waitForTimeout(600);
        }
        const channelBtn = page.locator('main button.text-accent-400').first();
        if (await channelBtn.isVisible()) {
          await channelBtn.click();
          await page.waitForTimeout(1500);
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
        await mockJobs(page);
        await selectChannel(page);
        await setView(page, 'jobs');
        await page.waitForTimeout(800);
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
                  { id: 'ep-quantum-error', title: 'Quantum Error Correction Explained', slug: 'ep-quantum-error', channelId: dummyChannelId, targetDuration: '12:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'in_progress' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-linux-gaming', title: 'Linux Gaming: The Year It Happened', slug: 'ep-linux-gaming', channelId: dummyChannelId, targetDuration: '15:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'complete' }, export: { status: 'complete' }, review: { status: 'needs_human' }, publish: { status: 'not_started' } } },
                  { id: 'ep-usb-scam', title: 'The USB-C Cable Scam', slug: 'ep-usb-scam', channelId: dummyChannelId, targetDuration: '0:58', pipeline: { research: { status: 'complete' }, script: { status: 'review' }, storyboard: { status: 'not_started' }, assets: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-home-server', title: 'Home Server for $50', slug: 'ep-home-server', channelId: dummyChannelId, targetDuration: '10:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'complete' }, assets: { status: 'complete' }, export: { status: 'complete' }, review: { status: 'approved' }, publish: { status: 'complete' } } },
                  { id: 'ep-ai-editors', title: 'AI Code Editors Ranked', slug: 'ep-ai-editors', channelId: dummyChannelId, targetDuration: '18:00', pipeline: { research: { status: 'in_progress' }, script: { status: 'not_started' }, storyboard: { status: 'not_started' }, assets: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
                  { id: 'ep-rust-vs-c', title: 'Is Rust Actually Faster Than C?', slug: 'ep-rust-vs-c', channelId: dummyChannelId, targetDuration: '14:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'error' }, assets: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
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
        await page.route(`**/api/channels/*/episodes`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                episodes: [
                  { id: 'ep-quantum-error', title: 'Quantum Error Correction Explained', slug: 'ep-quantum-error', channelId: dummyChannelId, targetDuration: '12:00', pipeline: { research: { status: 'complete' }, script: { status: 'complete' }, storyboard: { status: 'needs_human' }, assets: { status: 'not_started' }, export: { status: 'not_started' }, review: { status: 'not_started' }, publish: { status: 'not_started' } } },
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

      test('marketplace — gigs list', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'marketplace');
        await page.waitForTimeout(400);
        const gigsTab = page.locator('button', { hasText: /^\s*Gigs\s*$/i }).first();
        if (await gigsTab.isVisible()) {
          await gigsTab.click();
          await page.waitForTimeout(600);
        }
        await shotAllSchemes(page, 'marketplace-gigs');
      });

      test('marketplace — post a gig', async ({ page }) => {
        await selectChannel(page);
        await setView(page, 'marketplace');
        await page.waitForTimeout(400);
        // "Post a gig" button is in the top-right of the marketplace chrome
        const postBtn = page.locator('button', { hasText: /^\s*Post a gig\s*$/i }).first();
        if (await postBtn.isVisible()) {
          await postBtn.click();
          await page.waitForTimeout(600);
        }
        await shotAllSchemes(page, 'marketplace-post-gig');
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

      // ── Publish panel ─────────────────────────────────────────────────────

      /** Mock the publish endpoints so the panel renders with realistic data
       * regardless of what's actually rendered on the cluster. */
      async function mockPublish(page: Page, opts: {
        canPublish: boolean;
        youtubeTitle?: string;
        youtubeDescription?: string;
        youtubeTags?: string[];
        chaptersText?: string | null;
        variants?: Array<Record<string, unknown>>;
        suggestedHighlights?: Array<Record<string, unknown>>;
      }) {
        const body = {
          id: 'pub-demo',
          episodeId: 'ep-quantum-error',
          channelId: dummyChannelId,
          status: 'draft',
          youtubeTitle: opts.youtubeTitle ?? null,
          youtubeDescription: opts.youtubeDescription ?? null,
          youtubeTags: opts.youtubeTags ?? [],
          chaptersText: opts.chaptersText ?? null,
          thumbnailPath: null,
          variants: opts.variants ?? [],
          suggestedHighlights: opts.suggestedHighlights ?? [],
          canPublish: opts.canPublish,
          renderedVideoUrl: opts.canPublish ? `/api/channels/${dummyChannelId}/episodes/ep-quantum-error/video` : null,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
        await page.route(`**/api/channels/*/episodes/*/publish`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
          } else {
            await route.continue();
          }
        });
        await page.route(`**/api/channels/*/episodes`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200, contentType: 'application/json',
              body: JSON.stringify({ episodes: [
                { id: 'ep-quantum-error', title: 'Quantum Error Correction Explained', channelId: dummyChannelId,
                  targetDuration: '12:00', pipeline: {
                    research: { status: 'complete' }, script: { status: 'complete' },
                    storyboard: { status: 'complete' }, assets: { status: 'complete' }, export: { status: opts.canPublish ? 'complete' : 'not_started' },
                    review: { status: 'not_started' }, publish: { status: 'not_started' },
                  },
                },
                { id: 'ep-linux-gaming', title: 'Linux Gaming: The Year It Happened', channelId: dummyChannelId,
                  targetDuration: '15:00', pipeline: {
                    research: { status: 'complete' }, script: { status: 'complete' },
                    storyboard: { status: 'complete' }, assets: { status: 'complete' }, export: { status: 'complete' },
                    review: { status: 'approved' }, publish: { status: 'not_started' },
                  },
                },
              ]}),
            });
          } else {
            await route.continue();
          }
        });
      }

      test('publish panel — empty state (pick an episode)', async ({ page }) => {
        await mockPublish(page, { canPublish: false });
        await selectChannel(page);
        await setView(page, 'publish');
        await page.waitForTimeout(800);
        await shotAllSchemes(page, 'publish-empty');
      });

      test('publish panel — YouTube long-form', async ({ page }) => {
        await mockPublish(page, {
          canPublish: true,
          youtubeTitle: 'Why Quantum Computers Will Change Everything',
          youtubeDescription: 'A plain-English dive into qubits, superposition, and the jobs that quantum computing is actually about to eat. We cover real applications — drug discovery, cryptography, climate — and why the "5-years-away" meme is finally dying.\n\n{{CHAPTERS}}\n\nSubscribe for more weekly tech deep-dives.',
          youtubeTags: ['quantum', 'computing', 'tutorial', 'science', 'tech', 'explainer'],
          chaptersText: '0:00 Why this moment matters\n1:42 Classical vs. quantum bits\n4:30 Superposition, in pictures\n7:58 Real-world applications\n10:22 What you should do about it',
          suggestedHighlights: [
            { platform: 'youtube-shorts', startSec: 42, endSec: 88, hook: "The 2-line explainer that finally makes qubits click", caption: "If you've ever bounced off qubits, start here.", score: 92, reasoning: 'Clean hook with a payoff at 1:18.' },
            { platform: 'tiktok', startSec: 210, endSec: 275, hook: "RSA is about to stop working. Here's why.", caption: "The cryptography half of the room is sweating.", score: 88, reasoning: 'Tension + visible stake.' },
            { platform: 'instagram-reels', startSec: 460, endSec: 540, hook: "What quantum actually fixes in drug discovery", caption: "Simulating molecules a classical supercomputer can't.", score: 85, reasoning: 'Concrete imagery.' },
          ],
        });
        await selectChannel(page);
        await page.evaluate(() => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ openEpisodeId: 'ep-quantum-error', activeView: 'publish' });
        });
        await page.waitForTimeout(1200);
        await shotAllSchemes(page, 'publish-youtube');
      });

      test('publish panel — short-form variant detail', async ({ page }) => {
        await mockPublish(page, {
          canPublish: true,
          youtubeTitle: 'Why Quantum Computers Will Change Everything',
          youtubeTags: ['quantum', 'computing', 'tutorial'],
          variants: [{
            id: 'var-shorts-demo',
            platform: 'youtube-shorts',
            aspect: '9:16',
            burnSubtitles: true,
            title: 'The 2-line explainer that finally makes qubits click',
            caption: "If you've ever bounced off qubits, start here.",
            hashtags: ['#quantum', '#explainer', '#shorts', '#tech'],
            clipStartSec: 42, clipEndSec: 88,
            renderStatus: 'ready',
            renderedPath: `${dummyChannelId}/episodes/ep-quantum-error/publish/var-shorts-demo.mp4`,
            subjectTrack: true,
            trackingPath: `${dummyChannelId}/episodes/ep-quantum-error/publish/track-var-shorts-demo.json`,
            updated: new Date().toISOString(),
          }],
        });
        await selectChannel(page);
        await page.evaluate(() => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ openEpisodeId: 'ep-quantum-error', activeView: 'publish' });
        });
        await page.waitForTimeout(1000);
        // Click the Shorts variant in the left rail
        const row = page.locator('main aside button', { hasText: /YouTube Shorts/i }).first();
        if (await row.isVisible()) await row.click();
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'publish-shorts-variant');
      });

      test('publish panel — accounts modal', async ({ page }) => {
        await mockPublish(page, {
          canPublish: true,
          youtubeTitle: 'Why Quantum Computers Will Change Everything',
        });
        // Mock the OAuth status endpoint — show a mix of configured/connected platforms
        await page.route(`**/api/oauth/status`, async (route: any) => {
          await route.fulfill({
            status: 200, contentType: 'application/json',
            body: JSON.stringify({ platforms: [
              { platform: 'youtube', configured: true, connection: {
                platform: 'youtube', accountId: 'UC_fake', accountName: 'Lorem Ipsum Tech',
                connectedAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
                expiresAt: new Date(Date.now() + 3500_000).toISOString(),
              }},
              { platform: 'tiktok', configured: true, connection: null },
              { platform: 'meta', configured: false, connection: null },
              { platform: 'x', configured: true, connection: null },
            ]}),
          });
        });
        await selectChannel(page);
        await page.evaluate(() => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ openEpisodeId: 'ep-quantum-error', activeView: 'publish' });
        });
        await page.waitForTimeout(900);
        // Click the Accounts button in the header
        const btn = page.locator('header button', { hasText: /Accounts/i }).first();
        if (await btn.isVisible()) await btn.click();
        await page.waitForTimeout(500);
        await shotAllSchemes(page, 'publish-accounts');
      });

      test('audio — re-record sections', async ({ page }) => {
        await mockAudioProject(page);
        await selectChannel(page);
        await setView(page, 'audio-create');
        await page.waitForTimeout(1200);
        // Select the demo script in the header dropdown — that auto-opens the
        // single matching project, revealing the per-section re-record view.
        const scriptSelect = page.locator('main select').first();
        if (await scriptSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
          const opts = await scriptSelect.locator('option').allTextContents();
          const match = opts.find(o => /quantum/i.test(o));
          if (match) {
            await scriptSelect.selectOption({ label: match });
            await page.waitForTimeout(1200);
          }
        }
        await shotAllSchemes(page, 'audio-recordings');
      });

      test('settings — brand templates', async ({ page }) => {
        // Synthesize a minimal channel so SettingsPanel has something to render
        // even when beforeAll didn't leave a Lorem-Ipsum-Tech channel behind.
        const syntheticChannelId = 'screenshot-brand-channel';
        await page.unroute('**/api/channels').catch(() => {});
        await page.route('**/api/channels', async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{
              id: syntheticChannelId, name: CHANNEL_NAME, character: CHARACTER_NAME,
              character_description: 'Demo channel for brand-template screenshots.',
              voice: null, topics: ['tech'], tags: ['tech','science','tutorial'],
              avatar: null, rpm: 4, color: null,
              created: new Date().toISOString(), updated: new Date().toISOString(),
            }]) });
          } else {
            await route.continue();
          }
        });
        await page.route(`**/api/channels/${syntheticChannelId}/brand-templates*`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({
              status: 200, contentType: 'application/json',
              body: JSON.stringify([
                { id: 'bt-intro-1', channelId: syntheticChannelId, name: 'Tech stinger (3s)', kind: 'intro',
                  mediaPath: `${syntheticChannelId}/brand/bt-intro-1.mp4`, position: null, autoApply: true, created: new Date().toISOString() },
                { id: 'bt-outro-1', channelId: syntheticChannelId, name: 'Subscribe outro (5s)', kind: 'outro',
                  mediaPath: `${syntheticChannelId}/brand/bt-outro-1.mp4`, position: null, autoApply: true, created: new Date().toISOString() },
                { id: 'bt-wm-1', channelId: syntheticChannelId, name: 'Corner logo', kind: 'watermark',
                  mediaPath: `${syntheticChannelId}/brand/bt-wm-1.png`,
                  position: { x: 0.92, y: 0.92, scale: 0.08, opacity: 0.85 },
                  autoApply: true, created: new Date().toISOString() },
                { id: 'bt-lt-1', channelId: syntheticChannelId, name: 'Lower-third name tag', kind: 'lower-third',
                  mediaPath: null,
                  position: { x: 0.5, y: 0.85, scale: 0.5, opacity: 0.9 },
                  autoApply: false, created: new Date().toISOString() },
              ]),
            });
          } else {
            await route.continue();
          }
        });
        // Reload so the mocked channel list lands in the zustand store
        await page.reload();
        await page.waitForSelector('header');
        await page.waitForFunction(() => typeof (window as any).__craftStore !== 'undefined');
        await page.evaluate((id) => {
          const store = (window as any).__craftStore;
          if (store) store.setState({ selectedChannelId: id, activeView: 'settings' });
        }, syntheticChannelId);
        await page.waitForTimeout(1200);
        const heading = page.locator('h3', { hasText: 'Brand templates' }).first();
        if (await heading.isVisible()) {
          await heading.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);
        }
        await shotAllSchemes(page, 'brand-templates');
      });

      test('compose — reimagined editor', async ({ page }) => {
        const channelId = effectiveChannelId();
        const episodeId = 'ep-quantum-compose';
        const fps = 30;
        const SEC = (s: number) => Math.round(s * fps);
        const durationInFrames = SEC(72);

        // Mock the episode list so the picker has something, though we'll
        // inject composition state directly to skip it.
        await page.route(`**/api/channels/*/episodes`, async (route: any, request: any) => {
          if (request.method() === 'GET') {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
              episodes: [{ id: episodeId, title: 'Build Your First MCP Server in 10 Minutes', slug: 'ep-mcp-server', channelId, targetDuration: '10:00' }],
            }) });
          } else {
            await route.continue();
          }
        });
          await route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body style="background:#000"></body></html>' });
        });

        await selectChannel(page);
        await setView(page, 'video-create');
        await page.waitForTimeout(500);

        // Inject a populated composition so the panel renders chapter strip,
        // timeline clips, and scene list. Bypasses the episode picker flow.
        await page.evaluate(({ channelId, episodeId, durationInFrames, fps }) => {
          const store = (window as any).__craftCompositionStore;
          if (!store) return;
          const SEC = (s: number) => Math.round(s * fps);
          const composition = {
            id: 'comp-demo', episodeId, channelId,
            fps, width: 1920, height: 1080, durationInFrames,
            created: new Date().toISOString(), updated: new Date().toISOString(),
            tracks: [
              { id: 't-v2', name: 'V2', type: 'video', order: 0, visible: true, locked: false, muted: false, volume: 1, clips: [
                { id: 'c1', trackId: 't-v2', fromFrame: SEC(0),    durationInFrames: SEC(3.5),  mediaType: 'image', source: 'file', label: 'Title card', inPoint: 0, outPoint: SEC(3.5), opacity: 1 },
                { id: 'c2', trackId: 't-v2', fromFrame: SEC(3.5),  durationInFrames: SEC(6.8),  mediaType: 'video', source: 'file', label: '01_intro_wide', inPoint: 0, outPoint: SEC(6.8), opacity: 1 },
                { id: 'c3', trackId: 't-v2', fromFrame: SEC(10.3), durationInFrames: SEC(18.2), mediaType: 'video', source: 'file', label: '02_talking_head', inPoint: 0, outPoint: SEC(18.2), opacity: 1 },
                { id: 'c4', trackId: 't-v2', fromFrame: SEC(28.5), durationInFrames: SEC(22.4), mediaType: 'video', source: 'file', label: '03_screen_rec', inPoint: 0, outPoint: SEC(22.4), opacity: 1 },
                { id: 'c5', trackId: 't-v2', fromFrame: SEC(50.9), durationInFrames: SEC(14.6), mediaType: 'video', source: 'file', label: '02_talking_head', inPoint: 0, outPoint: SEC(14.6), opacity: 1 },
                { id: 'c6', trackId: 't-v2', fromFrame: SEC(65.5), durationInFrames: SEC(5.8),  mediaType: 'video', source: 'file', label: 'outro_subscribe', inPoint: 0, outPoint: SEC(5.8), opacity: 1 },
              ] },
              { id: 't-v3', name: 'V3', type: 'overlay', order: 1, visible: true, locked: false, muted: false, volume: 1, clips: [
                { id: 'c7', trackId: 't-v3', fromFrame: SEC(12.4), durationInFrames: SEC(4.1), mediaType: 'video', source: 'file', label: 'broll_keyboard', inPoint: 0, outPoint: SEC(4.1), opacity: 1 },
                { id: 'c9', trackId: 't-v3', fromFrame: SEC(30.2), durationInFrames: SEC(5.4), mediaType: 'image', source: 'file', label: 'code_snippet_1', inPoint: 0, outPoint: SEC(5.4), opacity: 1 },
                { id: 'c10', trackId: 't-v3', fromFrame: SEC(40.1), durationInFrames: SEC(6.2), mediaType: 'image', source: 'file', label: 'code_snippet_2', inPoint: 0, outPoint: SEC(6.2), opacity: 1 },
              ] },
              { id: 't-a1', name: 'Voice', type: 'audio', order: 2, visible: true, locked: false, muted: false, volume: 1, clips: [
                { id: 'a1', trackId: 't-a1', fromFrame: SEC(3.5),  durationInFrames: SEC(26.8), mediaType: 'audio', source: 'file', label: 'narration (pt 1)', inPoint: 0, outPoint: SEC(26.8), opacity: 1 },
                { id: 'a2', trackId: 't-a1', fromFrame: SEC(31.5), durationInFrames: SEC(19.1), mediaType: 'audio', source: 'file', label: 'narration (pt 2)', inPoint: 0, outPoint: SEC(19.1), opacity: 1 },
                { id: 'a3', trackId: 't-a1', fromFrame: SEC(51.2), durationInFrames: SEC(18.6), mediaType: 'audio', source: 'file', label: 'narration (pt 3)', inPoint: 0, outPoint: SEC(18.6), opacity: 1 },
              ] },
              { id: 't-a2', name: 'Music', type: 'audio', order: 3, visible: true, locked: false, muted: false, volume: 1, clips: [
                { id: 'a4', trackId: 't-a2', fromFrame: SEC(0), durationInFrames: SEC(71.3), mediaType: 'audio', source: 'file', label: 'bed_lofi_loop', inPoint: 0, outPoint: SEC(71.3), opacity: 1 },
              ] },
            ],
            markers: [
              { id: 'm1', frame: SEC(0),    type: 'chapter', label: 'Cold open' },
              { id: 'm2', frame: SEC(10.3), type: 'chapter', label: 'Intro' },
              { id: 'm3', frame: SEC(28.5), type: 'chapter', label: 'Tutorial' },
              { id: 'm4', frame: SEC(51.2), type: 'chapter', label: 'Recap' },
              { id: 'm5', frame: SEC(65.5), type: 'chapter', label: 'Outro' },
            ],
          };
          store.setState({ composition, episodeId, channelId, playheadFrame: SEC(14), zoom: 6, isDirty: false });
        }, { channelId, episodeId, durationInFrames, fps });
        await page.waitForTimeout(1000);
        await shotAllSchemes(page, 'compose-editor');
      });
});
