import { test, expect } from '@playwright/test';

test('take screenshot of studio', async ({ page }) => {
  await page.goto('http://admin:zhepbFryujzGdw0u4byii34Y@localhost:3000/studio');
  await page.waitForTimeout(2000); // wait for canvas
  await page.screenshot({ path: 'public/studio_redesign.png', fullPage: true });
});
