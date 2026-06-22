# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/inquire/layout.spec.ts >> ATELIER Inquiry Layout >> Hero Headline renders immediately without scroll dependence
- Location: tests/e2e/inquire/layout.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Select Your Event Details/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Select Your Event Details/i })

```

```yaml
- main:
  - text: Step 01
  - heading "The Prelude" [level=2]
  - paragraph: Every great celebration begins with intention. Tell us about your event, and we will begin crafting your bespoke photobooth experience.
  - button "Continue"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('ATELIER Inquiry Layout', () => {
  4  |   test('Hero Headline renders immediately without scroll dependence', async ({ page }) => {
  5  |     await page.goto('/inquire');
  6  |     const headline = page.getByRole('heading', { name: /Select Your Event Details/i });
  7  |     
  8  |     // Expect the headline to be instantly visible, protecting LCP
> 9  |     await expect(headline).toBeVisible();
     |                            ^ Error: expect(locator).toBeVisible() failed
  10 |     
  11 |     // Check computed font-family enforces serif or Playfair
  12 |     const fontFamily = await headline.evaluate((el) => window.getComputedStyle(el).fontFamily);
  13 |     expect(fontFamily).toMatch(/Playfair|serif/i);
  14 |   });
  15 | });
  16 | 
```