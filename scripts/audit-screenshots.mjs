import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('Navigating to Squarespace site...');
  await page.goto('https://swordfish-radish-kx7w.squarespace.com/', { waitUntil: 'networkidle' });

  if (await page.locator('input[type="password"]').count() > 0) {
    console.log('Password wall detected! We need the password.');
    await browser.close();
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), '../squarespace_screenshots/cropped_audits');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Capturing Hero Philosophy...');
  const philosophyText = page.locator('text="handcrafted dark"').first();
  if (await philosophyText.count() > 0) {
    const section = philosophyText.locator('xpath=./ancestor::section').first();
    await section.screenshot({ path: path.join(outDir, '01_hero_audit.png') });
    console.log('Hero captured.');
  }

  console.log('Capturing Testimonials...');
  const curatingText = page.locator('text="curating"').first();
  if (await curatingText.count() > 0) {
    const section = curatingText.locator('xpath=./ancestor::section').first();
    await section.screenshot({ path: path.join(outDir, '03_testimonials_audit.png') });
    console.log('Testimonials captured.');
  }

  console.log('Capturing Terms & Conditions...');
  const oaxText = page.locator('text="OAX Photo Booth"').first();
  if (await oaxText.count() > 0) {
    const parent = oaxText.locator('xpath=./ancestor::div[contains(@class, "sqs-block")]').first();
    await parent.screenshot({ path: path.join(outDir, '15_legal_audit.png') });
    console.log('Legal captured.');
  }

  await browser.close();
  console.log('Done!');
})();
