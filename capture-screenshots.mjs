import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const artifactDir = '/Users/jedg./.gemini/antigravity/brain/d16e2d36-4943-4f7b-b61d-e66f03fc2020';
  const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
  
  console.log("Starting Chrome...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2
  });
  
  const page = await context.newPage();

  try {
    console.log("Navigating to Admin Studio...");
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle', timeout: 30000 });
    // Wait for the UI to settle
    await page.waitForTimeout(2000);
    const adminPath = path.join(artifactDir, 'admin_studio_quieter.png');
    await page.screenshot({ path: adminPath, fullPage: true });
    console.log(`Saved ${adminPath}`);

    console.log("Navigating to Template Design Gallery...");
    await page.goto(`${baseUrl}/portal/test-lead/template-design`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const galleryPath = path.join(artifactDir, 'gallery_quieter.png');
    await page.screenshot({ path: galleryPath, fullPage: true });
    console.log(`Saved ${galleryPath}`);
    
    // Open the modal by clicking a template
    console.log("Opening modal...");
    await page.locator('button.group.flex-none').first().click();
    await page.waitForTimeout(1000);
    const modalPath = path.join(artifactDir, 'modal_quieter.png');
    await page.screenshot({ path: modalPath });
    console.log(`Saved ${modalPath}`);
    
  } catch (err) {
    console.error("Screenshot capture failed:", err);
  } finally {
    await browser.close();
  }
})();
