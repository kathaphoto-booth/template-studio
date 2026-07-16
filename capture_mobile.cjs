const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 13']);
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/portal/test-123/template-design');
  
  // Wait for the fonts and canvas to render
  await page.waitForTimeout(3000);
  
  // Save the screenshot to the artifacts directory
  const outputPath = '/Users/jedg./.gemini/antigravity/brain/1d3ffadd-cfdf-4204-9da7-3743838b00e3/mobile_view_current.png';
  
  await page.screenshot({ 
    path: outputPath, 
    fullPage: true 
  });
  
  await browser.close();
  console.log("Screenshot saved to: " + outputPath);
})();
