import { test, expect } from '@playwright/test';

// F6: URL Redirection — Tier 2 Boundary / Corner
// Absolute origins come strictly from env for production-gated cross-domain
// checks; all local checks are relative and resolve against baseURL.

const PROD_DOMAIN = process.env.PROD_DOMAIN;
const LEGACY_DOMAIN = process.env.LEGACY_DOMAIN;
const isProduction = process.env.TEST_ENV === 'production';

test.describe('F6: URL Redirection - Tier 2 Boundary/Corner', () => {
  test.beforeAll(() => {
    if (isProduction && (!PROD_DOMAIN || !LEGACY_DOMAIN)) {
      throw new Error('PROD_DOMAIN and LEGACY_DOMAIN env vars are required when TEST_ENV=production');
    }
  });

  test('T2.1: deep link preserves query string and hash across the domain redirect', async ({ page }) => {
    test.skip(!isProduction, 'Edge redirects only run against production');
    await page.goto(`${LEGACY_DOMAIN}/template-design?filter=classic#wabi-sabi`);
    await expect(page).toHaveURL(`${PROD_DOMAIN}/template-design?filter=classic#wabi-sabi`);
  });

  test('T2.2: trailing slash normalizes and still serves the gallery', async ({ page }) => {
    await page.goto('/template-design/');

    await expect(page).toHaveURL(/\/template-design\/?$/);
    // Harvest customizer landmark — the stepper's 'Inscription' step label.
    await expect(page.getByText('Inscription')).toBeVisible();
  });

  test('T2.3: unknown route returns the 404 page', async ({ page }) => {
    const response = await page.goto('/non-existent-page-123');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('T2.4: query parameters survive the /template-design rewrite', async ({ page }) => {
    await page.goto('/template-design?utm_source=instagram&ref=bio');

    await expect(page).toHaveURL(/\/template-design\?utm_source=instagram&ref=bio$/);
    // Harvest customizer landmark — the stepper's 'Inscription' step label.
    await expect(page.getByText('Inscription')).toBeVisible();
  });

  test('T2.5: deleted legacy route lands on the new domain with a 404', async ({ page }) => {
    test.skip(!isProduction, 'Edge redirects only run against production');
    await page.goto(`${LEGACY_DOMAIN}/non-existent-page-123`);

    await expect(page).toHaveURL(new RegExp(`^${PROD_DOMAIN}`));
    await expect(page.getByRole('heading', { name: /404|not found/i })).toBeVisible();
  });
});
