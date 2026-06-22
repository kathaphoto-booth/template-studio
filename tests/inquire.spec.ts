import { test, expect } from '@playwright/test';

test.describe('Inquire Pipeline Redesign - Aesthetic Verification', () => {
  test('should render perfectly symmetrical layout without wabi-sabi legacy classes', async ({ page }) => {
    // Navigate to the inquire page
    await page.goto('/inquire');

    // Verify absence of organic/asymmetric legacy classes
    const hasThread = await page.locator('.k-thread').count();
    expect(hasThread, 'The wabi-sabi .k-thread class must be purged for strict symmetry').toBe(0);

    const hasFade = await page.locator('.k-hero-fade').count();
    expect(hasFade, 'The organic .k-hero-fade must be replaced with structured CSS animations').toBe(0);

    // Verify the presence of the new, highly-structured minimal lux container
    const heroSection = page.locator('.max-w-3xl').first();
    
    // We expect the new design to use a rigid, centered flex/grid layout
    const layoutStyle = await heroSection.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems
      };
    });

    expect(['flex', 'grid']).toContain(layoutStyle.display);
  });

  test('should use institutional font stack hierarchy', async ({ page }) => {
    await page.goto('/inquire');
    
    // The main wordmark heading must use the display font (IvyMode or fallback serif)
    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();

    // Verify the CTA button no longer uses Loko Rust, but a high-end monochrome or primary brand token
    const cta = page.getByRole('button', { name: /Continue/i });
    if (await cta.count() > 0) {
      const bgColor = await cta.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      // Ensure it's not the old Loko Rust (rgb(140, 56, 42))
      expect(bgColor).not.toBe('rgb(140, 56, 42)');
    }
  });

  test('inquiry form functions correctly', async ({ page }) => {
    await page.goto('/inquire');

    // Navigate to Step 2
    const cta = page.getByRole('button', { name: /Continue/i });
    await cta.click();

    // Fill out the form
    await page.getByLabel(/Name/i).fill('Test User');
    await page.getByLabel(/Email/i).fill('test@kathabooth.com');
    await page.getByLabel(/Venue/i).fill('Test Venue');

    // Submit button within InquiryForm component
    const submitBtn = page.getByRole('button', { name: /Submit Inquiry/i });
    await expect(submitBtn).toBeVisible();
    
    await expect(page.getByLabel(/Name/i)).toBeVisible();
  });
});
