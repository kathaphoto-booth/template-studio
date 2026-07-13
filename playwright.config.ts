import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120_000 },
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
