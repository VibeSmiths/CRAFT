import { defineConfig } from '@playwright/test';

// Screenshots are taken via port-forwarded frontend nginx service,
// which proxies /api/ to studio. Auth is simulated via X-Auth-Request-* headers.
//
// Usage:
//   kubectl port-forward svc/craft-frontend 3000:3000 &
//   npx playwright test

const useDirectAuth = !process.env.SCREENSHOT_URL?.includes('https://');

export default defineConfig({
  testDir: '.',
  testMatch: 'screenshots.spec.ts',
  timeout: 90000,
  use: {
    baseURL: process.env.SCREENSHOT_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
    ...(useDirectAuth ? {
      extraHTTPHeaders: {
        'X-Auth-Request-User': 'localdev',
        'X-Auth-Request-Email': 'localdev@craft.local',
        'X-Auth-Request-Access-Token': 'eyJhbGciOiJub25lIn0.eyJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiYWRtaW4iLCJwcmVtaXVtIl19LCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJsb2NhbGRldiIsImVtYWlsIjoibG9jYWxkZXZAY3JhZnQubG9jYWwiLCJnaXZlbl9uYW1lIjoiTG9jYWwifQ.',
      },
    } : {}),
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    screenshot: 'off',
  },
});
