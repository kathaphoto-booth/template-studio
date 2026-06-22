# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inquire.spec.ts >> Inquire Pipeline Redesign - Aesthetic Verification >> should use institutional font stack hierarchy
- Location: tests/inquire.spec.ts:31:3

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "rgb(140, 56, 42)"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - text: Step 01
        - heading "The Prelude" [level=2] [ref=e7]
        - paragraph [ref=e8]: Every great celebration begins with intention. Tell us about your event, and we will begin crafting your bespoke photobooth experience.
      - button "Continue" [ref=e9] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e15] [cursor=pointer]:
    - img [ref=e16]
  - alert [ref=e19]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Inquire Pipeline Redesign - Aesthetic Verification', () => {
  4  |   test('should render perfectly symmetrical layout without wabi-sabi legacy classes', async ({ page }) => {
  5  |     // Navigate to the inquire page
  6  |     await page.goto('/inquire');
  7  | 
  8  |     // Verify absence of organic/asymmetric legacy classes
  9  |     const hasThread = await page.locator('.k-thread').count();
  10 |     expect(hasThread, 'The wabi-sabi .k-thread class must be purged for strict symmetry').toBe(0);
  11 | 
  12 |     const hasFade = await page.locator('.k-hero-fade').count();
  13 |     expect(hasFade, 'The organic .k-hero-fade must be replaced with structured CSS animations').toBe(0);
  14 | 
  15 |     // Verify the presence of the new, highly-structured minimal lux container
  16 |     const heroSection = page.locator('.max-w-3xl').first();
  17 |     
  18 |     // We expect the new design to use a rigid, centered flex/grid layout
  19 |     const layoutStyle = await heroSection.evaluate((el) => {
  20 |       const style = window.getComputedStyle(el);
  21 |       return {
  22 |         display: style.display,
  23 |         justifyContent: style.justifyContent,
  24 |         alignItems: style.alignItems
  25 |       };
  26 |     });
  27 | 
  28 |     expect(['flex', 'grid']).toContain(layoutStyle.display);
  29 |   });
  30 | 
  31 |   test('should use institutional font stack hierarchy', async ({ page }) => {
  32 |     await page.goto('/inquire');
  33 |     
  34 |     // The main wordmark heading must use the display font (IvyMode or fallback serif)
  35 |     const heading = page.locator('h2').first();
  36 |     await expect(heading).toBeVisible();
  37 | 
  38 |     // Verify the CTA button no longer uses Loko Rust, but a high-end monochrome or primary brand token
  39 |     const cta = page.getByRole('button', { name: /Continue/i });
  40 |     if (await cta.count() > 0) {
  41 |       const bgColor = await cta.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  42 |       // Ensure it's not the old Loko Rust (rgb(140, 56, 42))
> 43 |       expect(bgColor).not.toBe('rgb(140, 56, 42)');
     |                           ^ Error: expect(received).not.toBe(expected) // Object.is equality
  44 |     }
  45 |   });
  46 | 
  47 |   test('inquiry form functions correctly', async ({ page }) => {
  48 |     await page.goto('/inquire');
  49 | 
  50 |     // Navigate to Step 2
  51 |     const cta = page.getByRole('button', { name: /Continue/i });
  52 |     await cta.click();
  53 | 
  54 |     // Fill out the form
  55 |     await page.getByLabel(/Name/i).fill('Test User');
  56 |     await page.getByLabel(/Email/i).fill('test@kathabooth.com');
  57 |     await page.getByLabel(/Venue/i).fill('Test Venue');
  58 | 
  59 |     // Submit button within InquiryForm component
  60 |     const submitBtn = page.getByRole('button', { name: /Submit Inquiry/i });
  61 |     await expect(submitBtn).toBeVisible();
  62 |     
  63 |     await expect(page.getByLabel(/Name/i)).toBeVisible();
  64 |   });
  65 | });
  66 | 
```