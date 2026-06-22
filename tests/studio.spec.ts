import { test, expect } from '@playwright/test';

test.describe('Studio Panel Redesign - Aesthetic Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate with the basic auth credentials since it's the admin studio
    await page.goto('http://admin:zhepbFryujzGdw0u4byii34Y@localhost:3000/studio');
  });

  test('should not contain wabi-sabi legacy classes like k-thread or k-hero-fade', async ({ page }) => {
    const hasThread = await page.locator('.k-thread').count();
    expect(hasThread, 'The wabi-sabi .k-thread class must be purged for strict symmetry').toBe(0);

    const hasFade = await page.locator('.k-hero-fade').count();
    expect(hasFade, 'The organic .k-hero-fade must be replaced with structured CSS animations').toBe(0);
  });

  test('should implement strict symmetrical grid/flex layouts', async ({ page }) => {
    // Instead of arbitrary absolute positioning, the main workspace should use flex/grid
    const workspace = page.locator('#app-workspace-body');
    await expect(workspace).toHaveCSS('display', /flex|grid/);
  });

  test('should use institutional minimalist lux styling on the header', async ({ page }) => {
    const header = page.locator('#app-header');
    await expect(header).toBeVisible();

    // Verify absence of the wabi-sabi Heart icon if possible, or verify structural rigidity
    // For lux wow factor, header should be sleek.
    // The previous design used bg-[#131312]. Let's ensure it has standard border structure
    await expect(header).toHaveCSS('border-bottom-width', '1px');
  });

  test('should purge all wabi-sabi brass/gold and terracotta colors', async ({ page }) => {
    // #8A7342 (wabi-sabi gold) and #8C382A (terracotta) must be gone
    // We can evaluate if the body HTML contains these hex codes
    const html = await page.content();
    expect(html).not.toContain('#8A7342');
    expect(html).not.toContain('#8C382A');
  });
});
