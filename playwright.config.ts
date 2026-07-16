import { defineConfig, devices } from '@playwright/test';

// Single source of truth for the app origin. Tests use relative paths only;
// point the suite at any environment via PLAYWRIGHT_BASE_URL.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // Harvest-lineage a11y sweep (axe) — mobile + desktop viewports.
    { name: 'iphone-se', testDir: './playwright', use: { ...devices['iPhone SE'] } },
    { name: 'desktop', testDir: './playwright', use: { viewport: { width: 1280, height: 800 } } },
    // Intake-funnel / modal e2e suite from main.
    { name: 'chromium', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // Production server: tests measure the product surface, not dev chrome
    // (the Next dev-tools overlay fails the 44px tap-target law). Run
    // `npm run build` before `npx playwright test`.
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
