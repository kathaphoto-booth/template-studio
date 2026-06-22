import { test, expect } from '@playwright/test';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

let server: http.Server;
let port: number;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Start static file server before all tests
test.beforeAll(async () => {
  const baseDir = '/Users/jedg./Desktop/kat_ha_pb/squarespace/proposal-clone/';
  port = 49150 + Math.floor(Math.random() * 1000);
  
  server = http.createServer((req, res) => {
    let filePath = path.join(baseDir, decodeURIComponent(req.url || '/'));
    if (req.url === '/' || req.url?.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(`[TEST SERVER] Running at http://localhost:${port}`);
      resolve();
    });
  });
});

// Close static file server after all tests
test.afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      console.log('[TEST SERVER] Stopped.');
      resolve();
    });
  });
});

const PAGES = ['index.html', 'installations.html'];

test.describe('Barong Calado Z-Index Layout Verification', () => {
  for (const pageName of PAGES) {
    test(`verify layout stacking and opacity on ${pageName} (desktop 1280px)`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`http://localhost:${port}/${pageName}`);
      
      const section = page.locator('.section--barong');
      await expect(section).toBeVisible();
      
      const props = await verifySectionStyles(page, '.section--barong');
      console.log(`Computed properties for ${pageName} (desktop):`, JSON.stringify(props, null, 2));
      
      // Assertions
      expect(props.section.position).toBe('relative');
      expect(props.section.overflow).toBe('hidden');
      
      expect(props.before.position).toBe('absolute');
      expect(props.before.zIndex).toBe('0');
      expect(Math.abs(parseFloat(props.before.opacity) - 0.08)).toBeLessThan(0.01);
      expect(props.before.mixBlendMode).toBe('multiply');
      
      expect(props.after.position).toBe('absolute');
      expect(props.after.zIndex).toBe('1');
      
      expect(props.child).not.toBeNull();
      expect(props.child!.position).toBe('relative');
      expect(props.child!.zIndex).toBe('2');
      
      // Take screenshot and save to agent working directory
      const screenshotPath = path.join(
        '/Users/jedg./Desktop/kat_ha_pb/.agents/challenger_zindex_2',
        `${pageName.replace('.html', '')}_desktop.png`
      );
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300); // Wait for styles / images to stabilize
      await section.screenshot({ path: screenshotPath });
      console.log(`[VERIFICATION] Saved desktop screenshot to ${screenshotPath}`);
    });

    test(`verify layout stacking and opacity on ${pageName} (mobile 375px)`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(`http://localhost:${port}/${pageName}`);
      
      const section = page.locator('.section--barong');
      await expect(section).toBeVisible();
      
      const props = await verifySectionStyles(page, '.section--barong');
      console.log(`Computed properties for ${pageName} (mobile):`, JSON.stringify(props, null, 2));
      
      // Assertions
      expect(props.section.position).toBe('relative');
      expect(props.before.zIndex).toBe('0');
      expect(Math.abs(parseFloat(props.before.opacity) - 0.08)).toBeLessThan(0.01);
      expect(props.after.zIndex).toBe('1');
      expect(props.child!.zIndex).toBe('2');
      
      // Take screenshot and save to agent working directory
      const screenshotPath = path.join(
        '/Users/jedg./Desktop/kat_ha_pb/.agents/challenger_zindex_2',
        `${pageName.replace('.html', '')}_mobile.png`
      );
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300); // Wait for styles / images to stabilize
      await section.screenshot({ path: screenshotPath });
      console.log(`[VERIFICATION] Saved mobile screenshot to ${screenshotPath}`);
    });
  }
});

async function verifySectionStyles(page: any, selector: string) {
  return page.evaluate((sel: string) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`Element ${sel} not found`);
    
    const style = window.getComputedStyle(el);
    const beforeStyle = window.getComputedStyle(el, '::before');
    const afterStyle = window.getComputedStyle(el, '::after');
    
    const child = el.firstElementChild || el.querySelector('*');
    const childStyle = child ? window.getComputedStyle(child) : null;
    
    return {
      section: {
        position: style.getPropertyValue('position'),
        overflow: style.getPropertyValue('overflow'),
      },
      before: {
        position: beforeStyle.getPropertyValue('position'),
        zIndex: beforeStyle.getPropertyValue('z-index'),
        opacity: beforeStyle.getPropertyValue('opacity'),
        mixBlendMode: beforeStyle.getPropertyValue('mix-blend-mode')
      },
      after: {
        position: afterStyle.getPropertyValue('position'),
        zIndex: afterStyle.getPropertyValue('z-index'),
      },
      child: child ? {
        position: childStyle ? childStyle.getPropertyValue('position') : 'none',
        zIndex: childStyle ? childStyle.getPropertyValue('z-index') : 'none'
      } : null
    };
  }, selector);
}
