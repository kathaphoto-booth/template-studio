import { test, expect } from '@playwright/test';

// F7: Template Selection — Tier 1 Happy Path
// Client gallery lives at /portal/[id]/template-design ("guest" = organic visitor).
// Every template tile is a <button> whose hover overlay carries "Explore Details".

test.describe('F7: Template Selection - Tier 1 Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portal/guest/template-design');
  });

  test('T1.1: displays the gallery with collections and template cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Choose your style' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The Signature Collection' })).toBeVisible();

    const cards = page.getByRole('button', { name: /explore details/i });
    await expect(cards.first()).toBeVisible();
  });

  test('T1.2: offers more than one template to browse, with a result count', async ({ page }) => {
    const cards = page.getByRole('button', { name: /explore details/i });
    await expect(cards.nth(1)).toBeVisible();

    await expect(page.getByText(/\d+ templates?/)).toBeVisible();
  });

  test('T1.3: opens the personalization modal when a template card is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /explore details/i }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    // Modal title is the template name (aria-labelledby → h2).
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Close template preview' })).toBeVisible();
  });

  test('T1.4: submits a personalized design inquiry and shows the confirmation', async ({ page }) => {
    await page.getByRole('button', { name: /explore details/i }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByLabel('First name').fill('Ana');
    await modal.getByLabel('Email address').fill('ana.reyes@example.com');
    // New serviceTier gate: submit stays disabled until an installation is chosen.
    await expect(modal.getByRole('button', { name: 'Submit Design Inquiry' })).toBeDisabled();
    await modal.getByRole('button', { name: /Signature Installation/i }).click();
    await modal.getByRole('button', { name: 'Submit Design Inquiry' }).click();

    await expect(modal.getByText('Your design is saved')).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Back to gallery' })).toBeVisible();
  });

  test('T1.5: filters the gallery to the Katha Signature tier', async ({ page }) => {
    const signatureFilter = page.getByRole('button', { name: 'Katha Signature' });
    await signatureFilter.click();

    await expect(signatureFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'All styles' })).toHaveAttribute('aria-pressed', 'false');

    // Classic collection drops out of the gallery; Signature remains.
    await expect(page.getByRole('heading', { name: 'The Signature Collection' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The Classic Atelier' })).not.toBeVisible();
  });
});
