---
layout: home
hero:
  name: CRAFT Studio
  text: The Complete YouTube Content Studio
  tagline: "AI scripts. Competitive research. Audio production. GPU-accelerated generation. 14 media sources. One studio."
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/Mossworks-Labs/docs
features:
  - icon: "\u270D\uFE0F"
    title: AI Script Writing
    details: Write, revise, polish, fact-check, and humanize scripts with Claude, Gemini, or local Ollama models in your channel's voice.
  - icon: "\uD83D\uDD0D"
    title: YouTube Research
    details: Search YouTube with outlier detection, channel deep dives, earnings estimates, and competitive analysis.
  - icon: "\uD83C\uDFA7"
    title: Audio Production
    details: 4 TTS providers (Edge free, ElevenLabs, OpenAI, OpenedAI Speech local). AI background music generation with MusicGen.
  - icon: "\uD83C\uDFA8"
    title: Storyboard Editor
    details: Plan every scene with shot type, duration, transitions, director notes, and per-scene resource attachments before composition begins.
  - icon: "\u2702\uFE0F"
    title: Video Editor
    details: Multi-track timeline editor with chapters, V/A tracks, clip inspector, library panel, and direct render to MP4.
  - icon: "\uD83C\uDFAC"
    title: 7-Stage Pipeline
    details: Automated content pipeline — Research, Script, Storyboard, Assets, Export, Review, Publish — orchestrated by AI agents with quality gates.
  - icon: "\uD83D\uDCCB"
    title: AI Proposals
    details: AI-scored content proposals with trend analysis, timeliness signals, and approval workflows before entering production.
  - icon: "\uD83D\uDCDA"
    title: Resource Library
    details: Search 14 royalty-free sources for video, image, audio, and reference material with auto-attribution.
  - icon: "\uD83D\uDD10"
    title: Authentication & Role-Based Access
    details: Single sign-on with four roles (admin, editor, premium, standard). Multi-tenant channel isolation, 3-tier model access, and per-user encrypted API key storage.
  - icon: "\uD83D\uDCE4"
    title: "Multi-Platform Publishing \u2728"
    details: "Coming Soon — Publish directly to YouTube, TikTok, Facebook, and X from a single workflow."
---

<div class="craft-showcase">

## Numbers That Matter

<div class="stats-row">
  <div class="stat-card">
    <div class="stat-number">14</div>
    <div class="stat-label">Media Sources</div>
  </div>
  <div class="stat-card">
    <div class="stat-number">300+</div>
    <div class="stat-label">TTS Voices</div>
  </div>
  <div class="stat-card">
    <div class="stat-number">14</div>
    <div class="stat-label">AI Agents</div>
  </div>
  <div class="stat-card">
    <div class="stat-number">9</div>
    <div class="stat-label">Pipeline Workers</div>
  </div>
</div>

## How It Works

<div class="steps">
  <div class="step">
    <div class="step-number">1</div>
    <div class="step-content">
      <strong>Create a Channel</strong>
      <p>Define your channel's character, voice, and niche. The AI adapts to your persona.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-number">2</div>
    <div class="step-content">
      <strong>Generate Ideas</strong>
      <p>AI brainstorms based on your topics, or save inspiration from YouTube research.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-number">3</div>
    <div class="step-content">
      <strong>Run the Pipeline</strong>
      <p>AI agents research, write, storyboard, and compose your video through 7 stages with automated quality gates.</p>
    </div>
  </div>
  <div class="step">
    <div class="step-number">4</div>
    <div class="step-content">
      <strong>Review & Publish</strong>
      <p>Producer agent scores each stage. Review the final cut, approve, and publish — all from one dashboard.</p>
    </div>
  </div>
</div>

## Feature Highlights

<div class="feature-section">
  <div class="feature-text">
    <h3>Episodes — your single backlog</h3>
    <p>Every show is an episode card moving across a kanban: <strong>Backlog → Script → Assets → Storyboard → Export → Review → Publish</strong>. AI proposals and YouTube Discover both drop ideas straight onto the board, so there's no stand-alone Ideas tab to babysit.</p>
    <ul>
      <li><strong>Proposals</strong> — AI ranks 5 content angles per channel, scored on trend, gap, alignment, and timeliness. <em>Create Episode</em> turns one into a backlog card with a starter script.</li>
      <li><strong>Discover → Inspire</strong> — save any YouTube video as an episode; metadata, transcript, and earnings carry through.</li>
      <li><strong>Drag forward</strong> — drop a backlog card on Script and the write → fact-check → humanize worker chain spins up automatically.</li>
      <li><strong>Per-stage Run</strong> — every pipeline row has a Run button that queues a worker job and shows a Queued spinner immediately; the embedded Jobs panel under Proposals tracks progress.</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="episodes-panel" alt="Episodes kanban" />
  </div>
</div>

<div class="feature-section reverse">
  <div class="feature-text">
    <h3>AI Script Editor</h3>
    <p>Open a script from any episode card. The editor writes, revises, fact-checks, humanizes, and translates in your channel's voice — and the back button always returns you to the episodes board.</p>
    <ul>
      <li><strong>Write with Voice</strong> — AI drafts in character; per-row Run ▶ kicks it off without leaving the rail.</li>
      <li><strong>Revise</strong> with custom instructions, tone, or pacing notes.</li>
      <li><strong>Fact Check</strong> — every claim labelled verified / unverified / disputed / opinion with sources.</li>
      <li><strong>Humanize</strong> — flags AI-sounding phrases and rewrites them.</li>
      <li><strong>Localize</strong> — spawn a translation child script (BCP-47 locales like es, pt-BR, ja, hi) right from the Revise tab.</li>
      <li>Status workflow: <strong>Draft → Review → Final</strong>, with autosave every 30 seconds.</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="script-editor" alt="Script Editor" />
  </div>
</div>

<div class="feature-section">
  <div class="feature-text">
    <h3>YouTube Discover</h3>
    <p>Research trending content with yt-dlp-powered search. No API key needed for basic search. Progressive loading fetches more results as you scroll.</p>
    <ul>
      <li>Filter by duration, date, subscriber cap</li>
      <li>Outlier detection — find viral hits (5x/10x/50x avg)</li>
      <li>Channel deep dive with earnings estimates</li>
      <li>Compare up to 3 channels side-by-side</li>
      <li>Save any video as an idea with full metadata</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="discover-search" alt="Discover Search" />
  </div>
</div>

<div class="feature-section reverse">
  <div class="feature-text">
    <h3>Storyboard Editor</h3>
    <div class="feature-stats">
      <span class="feature-stat">Per-scene Planning</span>
      <span class="feature-stat">Shot &amp; Transition</span>
      <span class="feature-stat">Resource Attach</span>
    </div>
    <p>Plan every scene before composition begins. The storyboard parses your script into beats and lets you set shot type, duration, transitions, and director notes per scene — then attach the exact images, videos, or sound effects each scene needs from the resource library.</p>
    <ul>
      <li>3-column editor: beat list / scene detail / resource picker</li>
      <li>Shot type chips (wide, medium, close, cutaway, insert, aerial)</li>
      <li>Director notes — framing, lighting, pacing, music cues</li>
      <li>Per-scene resource attachments feed straight into composition</li>
      <li>Auto-generated status bar tallies resources, duration, save state</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="storyboard-editor" alt="Storyboard Editor" />
  </div>
</div>

<div class="feature-section">
  <div class="feature-text">
    <h3>Video Editor</h3>
    <div class="feature-stats">
      <span class="feature-stat">Multi-track Timeline</span>
      <span class="feature-stat">Chapter Markers</span>
      <span class="feature-stat">MP4 Export</span>
    </div>
    <p>Composition is the studio's video editor — a multi-track timeline where storyboard scenes, voiceover, music beds, and B-roll come together. Inspect any clip, scrub the playhead, drop chapter markers, and render straight to MP4 without leaving the studio.</p>
    <ul>
      <li>V/A track stack with reorderable, lockable, mutable lanes</li>
      <li>Chapter strip across the top — jump to any beat with one tap</li>
      <li>Library panel with Effects, Transitions, Text, Audio, Captions, AI tabs</li>
      <li>Clip inspector with opacity, in/out points, source preview</li>
      <li>One-click MP4 export via the composition worker</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="compose-editor" alt="Video Editor (Composition)" />
  </div>
</div>

<div class="feature-section reverse">
  <div class="feature-text">
    <h3>AI Proposals</h3>
    <p>AI-scored content proposals analyze trends, channel history, and audience signals to surface your best next video topic. <strong>Create Episode</strong> drops the winning proposal straight onto the kanban with a starter script — no Ideas tab to babysit.</p>
    <ul>
      <li>0-100 confidence scoring with trend signals</li>
      <li>Timeliness indicators for time-sensitive topics</li>
      <li>Approve to convert into production-ready ideas</li>
      <li>Powered by Curator and Trend Analyst agents</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="proposals-panel" alt="AI Proposals" />
  </div>
</div>

<div class="feature-section">
  <div class="feature-text">
    <h3>Audio Production</h3>
    <p>Full audio pipeline from TTS to final mix. 300+ voices with screenplay-aware section parsing. Background music layering and SFX insertion.</p>
    <ul>
      <li>4 TTS providers — Edge (free), ElevenLabs, OpenAI, OpenedAI Speech</li>
      <li>Upload your own voiceover and split at timestamps</li>
      <li>SFX sections between speech sections</li>
      <li>Background music with volume, fade, and loop controls</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="audio-sections" alt="Audio Production" />
  </div>
</div>

<div class="feature-section reverse">
  <div class="feature-text">
    <h3>Channel Settings & Voice</h3>
    <p>Configure your channel's personality, voice, and analytics. The AI Character Creator generates a full persona from a few questions.</p>
    <ul>
      <li>AI Character Creator — tone, quirks, audience</li>
      <li>Voice picker with 300+ voices and preview</li>
      <li>Stability and similarity tuning for ElevenLabs</li>
      <li>RPM presets for earnings estimates</li>
      <li>MCP server management</li>
    </ul>
  </div>
  <div class="feature-screenshot">
    <SchemeImage name="settings-panel" alt="Settings Panel" />
  </div>
</div>

</div>
