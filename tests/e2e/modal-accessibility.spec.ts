import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Modal Layout & Accessibility Verification', () => {
  const screenshotDir = '/Users/jedg./Desktop/kat_ha_pb/.agents/challenger_m2_2';

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('verify personalization modal', async ({ page }) => {
    // 1. Navigate
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/portal/guest/template-design');

    // 2. Open Modal
    const cards = page.getByRole('button', { name: /explore details/i });
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    await cards.first().click();

    const modal = page.locator('#katha-modal');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 3. Screenshots (Top View)
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-modal-top.png') });
    console.log("Screenshot: mobile-modal-top.png saved.");

    // 4. Layout: Centered preview card
    const previewContainer = modal.locator('div.relative.flex.items-center.justify-center').first();
    await expect(previewContainer).toBeVisible();
    
    const previewBox = await previewContainer.boundingBox();
    if (previewBox) {
      const viewportWidth = 375;
      const previewCenter = previewBox.x + previewBox.width / 2;
      const expectedCenter = viewportWidth / 2;
      const centeringOffset = Math.abs(previewCenter - expectedCenter);
      console.log(`Preview center: ${previewCenter}px (offset: ${centeringOffset}px)`);
      expect(centeringOffset).toBeLessThan(15);
    }

    // 5. Layout: Border cut-off check
    const modalBox = await modal.boundingBox();
    if (modalBox) {
      console.log(`Modal bounds: x=${modalBox.x}, w=${modalBox.width}`);
      expect(modalBox.x).toBeGreaterThanOrEqual(0);
      expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(375);
    }

    // 6. Layout: Scroll check
    await modal.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(screenshotDir, 'mobile-modal-scrolled.png') });
    console.log("Screenshot: mobile-modal-scrolled.png saved.");

    // Check if input is visible after scroll
    const firstInput = page.locator('#katha-name-one');
    await expect(firstInput).toBeVisible();

    // 7. Accessibility: Role attributes on modal
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    
    const modalTitle = modal.locator('h2').first();
    const titleId = await modalTitle.getAttribute('id');
    await expect(modal).toHaveAttribute('aria-labelledby', titleId || '');

    // 8. Accessibility: role="group" on selectors
    const textPositionGroup = modal.locator('[role="group"]');
    await expect(textPositionGroup).toHaveCount(1);
    await expect(textPositionGroup).toHaveAttribute('aria-labelledby', 'text-position-label');

    // Fill name and email to enable the submit button
    await modal.getByLabel('First name').fill('Ana');
    await modal.getByLabel('Email address').fill('ana.reyes@example.com');
    await page.waitForTimeout(200);

    // 9. Accessibility: Keyboard Focus Trap
    const closeBtn = modal.locator('button[aria-label="Close template preview"]');
    await closeBtn.focus();
    
    // Press Shift+Tab (wrap backward to last element)
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    const activeLabelShiftTab = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
    console.log("Active element after Shift+Tab on close button:", activeLabelShiftTab);

    // Reset focus to last element, press Tab (wrap forward to first element)
    const submitBtn = modal.locator('button').last(); // Submit button is the last button
    await submitBtn.focus();
    
    await page.keyboard.press('Tab');
    
    const isCloseFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute('aria-label') === 'Close template preview' || active?.textContent?.trim() === '×';
    });
    console.log("Is close button focused after Tab on last element:", isCloseFocused);
    expect(isCloseFocused).toBe(true);
  });
});
