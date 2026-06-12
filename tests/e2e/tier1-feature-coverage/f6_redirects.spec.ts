import { test, expect } from '@playwright/test';

// F6: URL Redirection — Tier 1 Happy Path
// Cross-domain edge redirects genuinely require absolute URLs, so those come
// STRICTLY from env (no hardcoded production fallbacks — fail fast instead)
// and only run when TEST_ENV=production. Everything else is relative and
// resolves against baseURL from playwright.config.ts.

const PROD_DOMAIN = process.env.PROD_DOMAIN;
const LEGACY_DOMAIN = process.env.LEGACY_DOMAIN;
const isProduction = process.env.TEST_ENV === 'production';

test.describe('F6: URL Redirection - Tier 1 Happy Path', () => {
  test.beforeAll(() => {
    if (isProduction && (!PROD_DOMAIN || !LEGACY_DOMAIN)) {
      throw new Error('PROD_DOMAIN and LEGACY_DOMAIN env vars are required when TEST_ENV=production');
    }
  });

  test('T1.1: legacy domain 301s to the production domain', async ({ page }) => {
    test.skip(!isProduction, 'Edge redirects only run against production');
    await page.goto(`${LEGACY_DOMAIN}/`);
    await expect(page).toHaveURL(`${PROD_DOMAIN}/`);
  });

  test('T1.2: www redirects to the root domain', async ({ page }) => {
    test.skip(!isProduction, 'Edge redirects only run against production');
    const wwwDomain = (PROD_DOMAIN as string).replace('https://', 'https://www.');
    await page.goto(`${wwwDomain}/`);
    await expect(page).toHaveURL(`${PROD_DOMAIN}/`);
  });

  test('T1.3: http upgrades to https', async ({ page }) => {
    test.skip(!isProduction, 'Edge redirects only run against production');
    const httpDomain = (PROD_DOMAIN as string).replace('https://', 'http://');
    await page.goto(`${httpDomain}/`);
    await expect(page).toHaveURL(`${PROD_DOMAIN}/`);
  });

  test('T1.4: /template-design rewrite serves the guest gallery without changing the URL', async ({ page }) => {
    await page.goto('/template-design');

    // Rewrite (not redirect): the short URL is preserved, gallery renders.
    await expect(page).toHaveURL(/\/template-design$/);
    await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
  });

  test('T1.5: /secured landing routes inquirers into the template designer', async ({ page }) => {
    await page.goto('/secured');

    await expect(page.getByRole('heading', { name: 'Your inquiry is received' })).toBeVisible();

    await page.getByRole('link', { name: 'Begin shaping your edition' }).click();
    await page.waitForURL('**/template-design');
    await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
  });
});
