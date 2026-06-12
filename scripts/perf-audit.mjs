import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function runAudit() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      resourceType: request.resourceType(),
      method: request.method(),
      startTime: Date.now(),
    });
  });

  page.on('requestfinished', request => {
    const req = networkRequests.find(r => r.url === request.url() && !r.endTime);
    if (req) {
      req.endTime = Date.now();
      req.duration = req.endTime - req.startTime;
    }
  });

  page.on('requestfailed', request => {
    const req = networkRequests.find(r => r.url === request.url() && !r.endTime);
    if (req) {
      req.endTime = Date.now();
      req.failed = true;
      req.error = request.failure()?.errorText || 'Unknown failure';
    }
  });

  // Navigate to target URL
  const targetUrl = 'http://localhost:3000/portal/test-portal/template-design';
  console.log(`Navigating to ${targetUrl}...`);
  const response = await page.goto(targetUrl, { waitUntil: 'load' });
  
  if (!response) {
    throw new Error('No response received from local server');
  }
  console.log(`Response status: ${response.status()}`);

  // Retrieve basic performance navigation timings
  const navTimings = await page.evaluate(() => {
    const [nav] = performance.getEntriesByType('navigation');
    if (!nav) return null;
    return {
      name: nav.name,
      duration: nav.duration,
      domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
      loadEventEnd: nav.loadEventEnd,
      responseStart: nav.responseStart, // TTFB relative to navigationStart (which is 0)
      requestStart: nav.requestStart,
      responseEnd: nav.responseEnd,
    };
  });

  // Retrieve FCP timing
  const fcpTiming = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  });

  // Run Identify LCP Element snippet
  console.log('Identifying LCP Element...');
  const lcpElement = await page.evaluate(async () => {
    return await new Promise(resolve => {
      // Use performance.getEntriesByType first to see if LCP has already been recorded
      const entries = performance.getEntriesByType('largest-contentful-paint');
      if (entries.length > 0) {
        const last = entries[entries.length - 1];
        resolve({
          element: last.element ? last.element.tagName : null,
          id: last.element ? last.element.id : null,
          className: last.element ? last.element.className : null,
          outerHTML: last.element ? last.element.outerHTML.substring(0, 300) : null,
          url: last.url,
          startTime: last.startTime,
          renderTime: last.renderTime,
          loadTime: last.loadTime,
          size: last.size,
        });
        return;
      }

      // If not yet recorded, set up observer
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        resolve({
          element: last.element ? last.element.tagName : null,
          id: last.element ? last.element.id : null,
          className: last.element ? last.element.className : null,
          outerHTML: last.element ? last.element.outerHTML.substring(0, 300) : null,
          url: last.url,
          startTime: last.startTime,
          renderTime: last.renderTime,
          loadTime: last.loadTime,
          size: last.size,
        });
        observer.disconnect();
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // Fallback timeout
      setTimeout(() => resolve({ error: 'LCP timed out or did not fire' }), 4000);
    });
  });

  // Run Audit Common Issues snippet
  console.log('Auditing common DOM-based LCP issues...');
  const commonIssues = await page.evaluate(() => {
    const issues = [];

    // Check for lazy-loaded images in viewport
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        issues.push({
          issue: 'lazy-loaded image in viewport',
          element: img.outerHTML.substring(0, 200),
          fix: 'Remove loading="lazy" from this image — it is in the initial viewport and may be the LCP element',
        });
      }
    });

    // Check for LCP-candidate images missing fetchpriority
    document.querySelectorAll('img:not([fetchpriority])').forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.width * rect.height > 50000) {
        issues.push({
          issue: 'large viewport image without fetchpriority',
          element: img.outerHTML.substring(0, 200),
          fix: 'Add fetchpriority="high" to this image — it is large and visible in the initial viewport',
        });
      }
    });

    // Check for render-blocking scripts in head
    document
      .querySelectorAll('head script:not([async]):not([defer]):not([type="module"])')
      .forEach(script => {
        if (script.src) {
          issues.push({
            issue: 'render-blocking script in head',
            element: script.outerHTML.substring(0, 200),
            fix: 'Add async or defer attribute, or move to end of body',
          });
        }
      });

    return { issueCount: issues.length, issues };
  });

  console.log('Collecting resource-level timings...');
  const resourceTimings = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      initiatorType: r.initiatorType,
      duration: r.duration,
      startTime: r.startTime,
      responseEnd: r.responseEnd,
      transferSize: r.transferSize,
      encodedBodySize: r.encodedBodySize,
    }));
  });

  // Output full audit results
  const result = {
    targetUrl,
    timestamp: new Date().toISOString(),
    navTimings,
    fcpTiming,
    lcpElement,
    commonIssues,
    resourceTimings: resourceTimings.slice(0, 100), // Cap resource count
    networkRequests: networkRequests.slice(0, 100)
  };

  console.log('\n--- AUDIT RESULT SUMMARY ---');
  console.log('LCP Element:', lcpElement);
  console.log('TTFB:', navTimings?.responseStart, 'ms');
  console.log('FCP:', fcpTiming, 'ms');
  console.log('LCP Start Time:', lcpElement?.startTime, 'ms');
  console.log('DOM Content Loaded:', navTimings?.domContentLoadedEventEnd, 'ms');
  console.log('Load Event End:', navTimings?.loadEventEnd, 'ms');
  console.log('Common Issues:', commonIssues);

  const reportPath = path.resolve('/Users/jedg./Desktop/kat_ha_pb/.agents/worker_m4/audit-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\nWritten JSON report to ${reportPath}`);

  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
