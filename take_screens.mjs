import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to site...");
  await page.goto('https://swordfish-radish-kx7w.squarespace.com/', { waitUntil: 'networkidle' });

  // Handle password wall if this is a trial site
  if (await page.locator('input[type="password"]').count() > 0) {
      console.log("Password wall detected! We might not be able to get screenshots.");
  }

  // Scroll to bottom to trigger lazy loading
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  const deployPath = '/Users/jedg./Desktop/kat_ha_pb/vince-deck-deploy';

  try {
    const cta = page.locator(':text("Secure An Architecture")').first();
    if (await cta.count() > 0) {
      await cta.screenshot({ path: `${deployPath}/screenshot-cta.jpg` });
      console.log("Captured CTA");
    } else {
      console.log('CTA not found, taking full page as fallback');
    }
  } catch(e) { console.log('CTA error'); }

  try {
    const header = page.locator(':text("EDITORIAL // OAK ARCHITECTURE")').first();
    if (await header.count() > 0) {
      const parent = header.locator('..'); // go up a level to get some context
      await parent.screenshot({ path: `${deployPath}/screenshot-headers.jpg` });
      console.log("Captured Header");
    }
  } catch(e) { console.log('Header error'); }

  try {
    const inc = page.locator(':text("Invisible Logistics")').first();
    if (await inc.count() > 0) {
      const parent = inc.locator('..').locator('..');
      await parent.screenshot({ path: `${deployPath}/screenshot-inclusions.jpg` });
      console.log("Captured Inclusions");
    }
  } catch(e) { console.log('Inclusions error'); }

  try {
    const price = page.locator(':text("Starting from $$949")').first();
    if (await price.count() > 0) {
      const parent = price.locator('..');
      await parent.screenshot({ path: `${deployPath}/screenshot-price.jpg` });
      console.log("Captured Price");
    }
  } catch(e) { console.log('Price error'); }

  // Just in case, full page
  await page.screenshot({ path: `${deployPath}/screenshot-full.jpg`, fullPage: true });
  console.log('Took full page screenshot');

  await browser.close();
})();
