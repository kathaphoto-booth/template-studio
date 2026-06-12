# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/tier2-boundary-corner/f7_template_selection_boundary.spec.ts >> F7: Template Selection - Tier 2 Boundary/Corner >> T2.5: surfaces a submission error when the network drops
- Location: tests/e2e/tier2-boundary-corner/f7_template_selection_boundary.spec.ts:55:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /explore details/i }).first()

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // F7: Template Selection — Tier 2 Boundary / Corner
  4  | // No timing-based or load-state waits: every wait is a web-first assertion.
  5  | // Network failure is simulated with Playwright-native context.setOffline —
  6  | // the app's own APIs are never mocked.
  7  | 
  8  | test.describe('F7: Template Selection - Tier 2 Boundary/Corner', () => {
  9  |   test('T2.1: renders the gallery gracefully for an unknown portal id', async ({ page }) => {
  10 |     await page.goto('/portal/unknown-lead-9999/template-design');
  11 | 
  12 |     await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
  13 |     await expect(page.getByRole('button', { name: /explore details/i }).first()).toBeVisible();
  14 |   });
  15 | 
  16 |   test('T2.2: gates submission until a name and a valid email are provided', async ({ page }) => {
  17 |     await page.goto('/portal/guest/template-design');
  18 |     await page.getByRole('button', { name: /explore details/i }).first().click();
  19 | 
  20 |     const modal = page.getByRole('dialog');
  21 |     await expect(modal).toBeVisible();
  22 | 
  23 |     const submit = modal.getByRole('button', { name: 'Submit Design Inquiry' });
  24 |     await expect(submit).toBeDisabled();
  25 | 
  26 |     await modal.getByLabel('First name').fill('Ana');
  27 |     await modal.getByLabel('Email address').fill('not-an-email');
  28 | 
  29 |     await expect(modal.getByText('Please enter a valid email address.')).toBeVisible();
  30 |     await expect(submit).toBeDisabled();
  31 |   });
  32 | 
  33 |   test('T2.3: format filter toggles exclusively via aria-pressed', async ({ page }) => {
  34 |     await page.goto('/portal/guest/template-design');
  35 | 
  36 |     const stripFilter = page.getByRole('button', { name: '2×6 Strip' });
  37 |     await stripFilter.click();
  38 | 
  39 |     await expect(stripFilter).toHaveAttribute('aria-pressed', 'true');
  40 |     await expect(page.getByRole('button', { name: 'All formats' })).toHaveAttribute('aria-pressed', 'false');
  41 |     await expect(page.getByText(/\d+ templates?/)).toBeVisible();
  42 |   });
  43 | 
  44 |   test('T2.4: renders cards and opens the modal on a mobile viewport', async ({ page }) => {
  45 |     await page.setViewportSize({ width: 375, height: 667 });
  46 |     await page.goto('/portal/guest/template-design');
  47 | 
  48 |     const cards = page.getByRole('button', { name: /explore details/i });
  49 |     await expect(cards.first()).toBeVisible();
  50 | 
  51 |     await cards.first().click();
  52 |     await expect(page.getByRole('dialog')).toBeVisible();
  53 |   });
  54 | 
  55 |   test('T2.5: surfaces a submission error when the network drops', async ({ context, page }) => {
  56 |     await page.goto('/portal/guest/template-design');
> 57 |     await page.getByRole('button', { name: /explore details/i }).first().click();
     |                                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  58 | 
  59 |     const modal = page.getByRole('dialog');
  60 |     await expect(modal).toBeVisible();
  61 | 
  62 |     await modal.getByLabel('First name').fill('Ana');
  63 |     await modal.getByLabel('Email address').fill('ana.reyes@example.com');
  64 | 
  65 |     // Playwright-native offline simulation — never mock our own API.
  66 |     await context.setOffline(true);
  67 |     await modal.getByRole('button', { name: 'Submit Design Inquiry' }).click();
  68 | 
  69 |     await expect(modal.getByText('Submission failed. Please try again.')).toBeVisible();
  70 |   });
  71 | });
  72 | 
```