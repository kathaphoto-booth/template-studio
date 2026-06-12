import { test, expect } from '@playwright/test';

// F7: Template Selection — Tier 2 Boundary / Corner
// No timing-based or load-state waits: every wait is a web-first assertion.
// Network failure is simulated with Playwright-native context.setOffline —
// the app's own APIs are never mocked.

test.describe('F7: Template Selection - Tier 2 Boundary/Corner', () => {
  test('T2.1: renders the gallery gracefully for an unknown portal id', async ({ page }) => {
    await page.goto('/portal/unknown-lead-9999/template-design');

    await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
    await expect(page.getByRole('button', { name: /explore details/i }).first()).toBeVisible();
  });

  test('T2.2: gates submission until a name and a valid email are provided', async ({ page }) => {
    await page.goto('/portal/guest/template-design');
    await page.getByRole('button', { name: /explore details/i }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const submit = modal.getByRole('button', { name: 'Submit Design Inquiry' });
    await expect(submit).toBeDisabled();

    await modal.getByLabel('First name').fill('Ana');
    await modal.getByLabel('Email address').fill('not-an-email');

    await expect(modal.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(submit).toBeDisabled();
  });

  test('T2.3: format filter toggles exclusively via aria-pressed', async ({ page }) => {
    await page.goto('/portal/guest/template-design');

    const stripFilter = page.getByRole('button', { name: '2×6 Strip' });
    await stripFilter.click();

    await expect(stripFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'All formats' })).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText(/\d+ templates?/)).toBeVisible();
  });

  test('T2.4: renders cards and opens the modal on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/portal/guest/template-design');

    const cards = page.getByRole('button', { name: /explore details/i });
    await expect(cards.first()).toBeVisible();

    await cards.first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('T2.5: surfaces a submission error when the network drops', async ({ context, page }) => {
    await page.goto('/portal/guest/template-design');
    await page.getByRole('button', { name: /explore details/i }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByLabel('First name').fill('Ana');
    await modal.getByLabel('Email address').fill('ana.reyes@example.com');

    // Playwright-native offline simulation — never mock our own API.
    await context.setOffline(true);
    await modal.getByRole('button', { name: 'Submit Design Inquiry' }).click();

    await expect(modal.getByText('Submission failed. Please try again.')).toBeVisible();
  });
});
