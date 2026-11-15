import { defineConfig } from '@playwright/test';

/**
 * End-to-end tests: real browsers against `npm run start:all` (game server + `ng serve`).
 * They use the live Deezer API, so they need network access.
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start:all',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
