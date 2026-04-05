import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'CRAFT Studio',
  description: 'Content Refinement & Authoring Framework Toolkit — User Guide',
  base: '/CRAFT/',
  ignoreDeadLinks: [/localhost/],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Mobile', link: '/mobile/' },
      { text: 'Open Studio', link: 'https://dev.rudolphhome.com/studio/', target: '_blank' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Kubernetes / Helm', link: '/guide/kubernetes' },
          { text: 'Local Dev (Docker)', link: '/guide/setup' },
          { text: 'AI Providers', link: '/guide/ai-providers' },
          { text: 'Authentication & Roles', link: '/guide/auth' },
        ],
      },
      {
        text: 'Content Studio',
        items: [
          { text: 'Channels', link: '/guide/channels' },
          { text: 'Ideas', link: '/guide/ideas' },
          { text: 'Scripts', link: '/guide/scripts' },
          { text: 'Episodes', link: '/guide/episodes' },
          { text: 'Proposals', link: '/guide/proposals' },
          { text: 'Discover', link: '/guide/discover' },
          { text: 'Audio (TTS)', link: '/guide/audio' },
          { text: 'Resources', link: '/guide/resources' },
          { text: 'Feedback', link: '/guide/feedback' },
          { text: 'Settings', link: '/guide/settings' },
          { text: 'MCP Servers', link: '/guide/mcp-guide' },
        ],
      },
      {
        text: 'Infrastructure',
        items: [
          { text: 'AI Agents', link: '/guide/agents' },
          { text: 'Jobs & Workers', link: '/guide/jobs' },
        ],
      },
      {
        text: 'Mobile App',
        items: [
          { text: 'Overview', link: '/mobile/' },
          { text: 'Setup', link: '/mobile/setup' },
          { text: 'Features', link: '/mobile/features' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/VibeSmiths/VideoIdeas' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Built by <a href="https://github.com/VibeSmiths" target="_blank">VibeSmiths</a>',
    },
  },
  appearance: 'dark',
});
