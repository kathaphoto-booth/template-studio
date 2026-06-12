import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3002/portal/guest/template-design...');
  try {
    const response = await page.goto('http://localhost:3002/portal/guest/template-design', {
      timeout: 25000,
      waitUntil: 'load'
    });
    console.log('Status code:', response.status());
    
    // Wait for the buttons to load just in case React is rendering client-side
    await page.waitForSelector('button', { timeout: 15000 }).catch(() => null);
    
    // Dump page title
    console.log('Page Title:', await page.title());
    
    // Check for "explore details" buttons
    const buttons = page.locator('button');
    const count = await buttons.count();
    console.log(`Found ${count} buttons on the page.`);
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const text = await btn.innerText();
      const role = await btn.getAttribute('role');
      console.log(`Button ${i}: text="${text.replace(/\n/g, ' ')}" role="${role}"`);
    }

    // Capture screenshot
    await page.screenshot({ path: 'debug-portal-page.png' });
    console.log('Screenshot saved to debug-portal-page.png');
    
  } catch (error) {
    console.error('Failed:', error);
  } finally {
    await browser.close();
  }
}

main();
