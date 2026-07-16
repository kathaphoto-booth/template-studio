import { chromium } from '@playwright/test';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set a nice viewport size for the screenshots
    await page.setViewportSize({ width: 1280, height: 900 });

    console.log("Navigating to contract...");
    await page.goto('http://localhost:3000/portal/123/contract', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/jedg./.gemini/antigravity/brain/ea423d19-1480-4182-8b3c-2ef20ce6f910/contract_visual.png', fullPage: true });

    console.log("Navigating to invoice...");
    await page.goto('http://localhost:3000/portal/123/invoice', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/jedg./.gemini/antigravity/brain/ea423d19-1480-4182-8b3c-2ef20ce6f910/invoice_visual.png', fullPage: true });

    console.log("Navigating to questionnaire...");
    await page.goto('http://localhost:3000/portal/123/questionnaire', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/jedg./.gemini/antigravity/brain/ea423d19-1480-4182-8b3c-2ef20ce6f910/questionnaire_visual.png', fullPage: true });

    await browser.close();
    console.log('Screenshots saved!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
