import { test, expect } from '@playwright/test';

test.describe('Challenger Modal Interaction & Accessibility Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to 375px mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/portal/guest/template-design');
    
    // Wait 5 seconds to let Next.js dev server stabilize and finish hot reloading
    await page.waitForTimeout(5000);
    
    // Ensure the explore details buttons are visible
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await expect(exploreBtn).toBeVisible({ timeout: 15000 });
  });

  test('verify modal centering, scrollability, and close button clickability', async ({ page }) => {
    // 1. Open the modal
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await exploreBtn.click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 2. Verify Horizontal Centering
    const previewContainer = modal.locator('div.relative.flex.items-center.justify-center').first();
    await expect(previewContainer).toBeVisible();
    const previewBox = await previewContainer.boundingBox();
    if (previewBox) {
      const viewportWidth = 375;
      const previewCenter = previewBox.x + previewBox.width / 2;
      const expectedCenter = viewportWidth / 2;
      const centeringOffset = Math.abs(previewCenter - expectedCenter);
      console.log(`[VERIFICATION] Preview Center: ${previewCenter}px (offset: ${centeringOffset}px)`);
      expect(centeringOffset).toBeLessThan(15);
    }

    // 3. Verify bounds fit inside the viewport (responsive check)
    const modalBox = await modal.boundingBox();
    if (modalBox) {
      console.log(`[VERIFICATION] Modal bounds: x=${modalBox.x}, w=${modalBox.width}`);
      expect(modalBox.x).toBeGreaterThanOrEqual(0);
      expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(375);
    }

    // 4. Verify scrollability
    const isScrollable = await modal.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });
    console.log(`[VERIFICATION] Modal is scrollable: ${isScrollable}`);
    // Since mobile viewport has limited height (667px) and form is long, it must be scrollable
    expect(isScrollable).toBe(true);

    // Scroll to the bottom to verify inputs at the bottom are scrollable/visible
    await modal.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(300);

    const notesInput = page.locator('#katha-notes');
    await expect(notesInput).toBeVisible();

    // 5. Verify close button clickability (ensure no click interception)
    const closeBtn = modal.locator('button[aria-label="Close template preview"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('verify Escape close interaction', async ({ page }) => {
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await exploreBtn.click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('verify accessibility attributes', async ({ page }) => {
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await exploreBtn.click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible();

    // dialog and modal attributes
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');

    // aria-labelledby links to modal title
    const modalTitle = modal.locator('h2').first();
    const titleId = await modalTitle.getAttribute('id');
    expect(titleId).toBeTruthy();
    await expect(modal).toHaveAttribute('aria-labelledby', titleId!);

    // Two role="group" regions: Text Position toggle + Installation/service-tier picker
    const groups = modal.locator('[role="group"]');
    await expect(groups).toHaveCount(2);
    await expect(modal.locator('[role="group"][aria-labelledby="text-position-label"]')).toHaveCount(1);
    await expect(modal.locator('[role="group"][aria-labelledby="katha-service-tier-label"]')).toHaveCount(1);
  });

  test('verify focus trapping loop when submit button is DISABLED (initial state)', async ({ page }) => {
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await exploreBtn.click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible();

    // Focus the Close button (first element)
    const closeBtn = modal.locator('button[aria-label="Close template preview"]');
    await closeBtn.focus();

    // Press Shift+Tab (should wrap backward to the last enabled element, e.g. upload or textarea, but NOT the disabled submit button)
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    // Verify the currently active element is NOT the close button, nor the disabled submit button
    const activeTextContent = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName || '');
    const activeElementId = await page.evaluate(() => document.activeElement?.id || '');
    const isDisabled = await page.evaluate(() => (document.activeElement as any)?.disabled || false);

    console.log(`[VERIFICATION-DISABLED] Shift+Tab active element: Tag=${activeTagName}, ID=${activeElementId}, Text="${activeTextContent}", disabled=${isDisabled}`);
    expect(isDisabled).toBe(false);
    expect(activeElementId).not.toBe('katha-submit-btn'); // Submit button is disabled, so focus should wrap to some enabled element.

    // Let's explicitly check forward tabbing wrap-around.
    // The last enabled element should be the file upload input or the notes textarea.
    // Let's focus the notes textarea and press Tab
    const notesInput = page.locator('#katha-notes');
    await notesInput.focus();
    
    // The photo upload is actually after notes. Let's tab from photo upload or notes.
    // Let's find all enabled focusable elements in the modal
    const focusableIds = await page.evaluate(() => {
      const modalEl = document.getElementById('katha-modal');
      if (!modalEl) return [];
      const els = Array.from(modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      return els.filter(el => !(el as any).disabled).map(el => el.id || el.tagName || el.getAttribute('aria-label') || el.textContent?.trim());
    });
    console.log(`[VERIFICATION-DISABLED] Focusable elements list (enabled only):`, focusableIds);

    // Let's focus the last element in that list and tab.
    // In our code: First name input, Second name, Email, Phone, Event date, Venue, Font selector, Bottom, Top, Notes, Photo upload input.
    // The last enabled element in the DOM is the photo upload input or notes. Let's focus #katha-notes and press Tab.
    // Wait, the input #katha-photo-upload is also an input:not([disabled]) and is after #katha-notes.
    // The photo upload is NOT last anymore: the service-tier group and the
    // venue-address input come after it. With submit disabled, the last enabled
    // focusable element is #katha-venue-address — Tab from it wraps to Close.
    const lastElement = page.locator('#katha-venue-address');
    await lastElement.focus();
    await page.keyboard.press('Tab');

    // It should wrap focus to the Close button
    const isCloseFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
    });
    console.log(`[VERIFICATION-DISABLED] Tab on last enabled element focuses Close: ${isCloseFocused}`);
    expect(isCloseFocused).toBe(true);
  });

  test('verify focus trapping loop when submit button is ENABLED', async ({ page }) => {
    const exploreBtn = page.getByRole('button', { name: /explore details/i }).first();
    await exploreBtn.click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible();

    // Fill in required fields to enable the submit button
    await modal.getByLabel('First name').fill('Ana');
    await modal.getByLabel('Email address').fill('ana.reyes@example.com');
    // Submit also requires a selected installation (serviceTier gate).
    await modal.getByRole('button', { name: /Signature Installation/i }).click();
    await page.waitForTimeout(200);

    // Verify the submit button is enabled (label is "Send Inquiry").
    const submitBtn = modal.getByRole('button', { name: /send inquiry/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).not.toBeDisabled();

    // Focus the Close button (first element)
    const closeBtn = modal.locator('button[aria-label="Close template preview"]');
    await closeBtn.focus();

    // Press Shift+Tab (should wrap backward to the enabled submit button, which is now the last element)
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    const activeTextContent = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
    console.log(`[VERIFICATION-ENABLED] Shift+Tab active element on close: "${activeTextContent}"`);
    expect(activeTextContent).toMatch(/send inquiry/i);

    // Focus the submit button and press Tab (should wrap forward to the Close button)
    await submitBtn.focus();
    await page.keyboard.press('Tab');

    const isCloseFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
    });
    console.log(`[VERIFICATION-ENABLED] Tab on submit button focuses Close: ${isCloseFocused}`);
    expect(isCloseFocused).toBe(true);
  });
});
