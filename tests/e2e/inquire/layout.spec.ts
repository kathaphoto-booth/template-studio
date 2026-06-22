import { test, expect } from '@playwright/test';

test.describe('ATELIER Inquiry Layout', () => {
  test('Hero Headline renders immediately without scroll dependence', async ({ page }) => {
    await page.goto('/inquire');
    const headline = page.getByRole('heading', { name: /Select Your Event Details/i });
    
    // Expect the headline to be instantly visible, protecting LCP
    await expect(headline).toBeVisible();
    
    // Check computed font-family enforces serif or Playfair
    const fontFamily = await headline.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(fontFamily).toMatch(/Playfair|serif/i);
  });
});
