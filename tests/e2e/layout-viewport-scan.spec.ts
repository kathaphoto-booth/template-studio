import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface ConsoleErrorEntry {
  viewport: string;
  type: string;
  text: string;
  stack?: string;
}

interface OverflowingElement {
  tagName: string;
  className: string;
  id: string;
  right: number;
  width: number;
}

interface ZeroMarginElement {
  tagName: string;
  className: string;
  id: string;
}

interface ViewportReport {
  viewport: { width: number; height: number; name: string };
  layoutDiagnostics: {
    bodyScrollWidth: number;
    bodyClientWidth: number;
    documentElementScrollWidth: number;
    hasHorizontalScrollbar: boolean;
    zeroMarginElements: ZeroMarginElement[];
    overflowingElements: OverflowingElement[];
  };
  modalOpened: boolean;
  canvasInfo: unknown;
  closeButtonTest: { success: boolean; message: string } | null;
}

interface Report {
  timestamp: string;
  viewports: Record<string, ViewportReport>;
  consoleErrors: ConsoleErrorEntry[];
}

test.describe('Automated Layout and Responsiveness Scans', () => {
  const outputDir = '/Users/jedg./Desktop/kat_ha_pb/.agents/challenger_m2_3';
  const report: Report = {
    timestamp: new Date().toISOString(),
    viewports: {},
    consoleErrors: []
  };

  test.beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test.afterAll(() => {
    const reportPath = path.join(outputDir, 'validation_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Validation report written to: ${reportPath}`);
  });

  const viewports = [
    { width: 1200, height: 900, name: '1200px' },
    { width: 800, height: 800, name: '800px' },
    { width: 320, height: 640, name: '320px' }
  ];

  for (const vp of viewports) {
    test(`scan viewport ${vp.name}`, async ({ page }) => {
      console.log(`Scanning viewport: ${vp.name}`);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Monitor console errors
      page.on('console', msg => {
        const text = msg.text();
        if (msg.type() === 'error' || text.toLowerCase().includes('failed') || text.toLowerCase().includes('error')) {
          report.consoleErrors.push({
            viewport: vp.name,
            type: msg.type(),
            text: text
          });
        }
      });

      page.on('pageerror', err => {
        report.consoleErrors.push({
          viewport: vp.name,
          type: 'pageerror',
          text: err.message,
          stack: err.stack
        });
      });

      // Navigate to the gallery page
      await page.goto('/portal/guest/template-design', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Allow render to settle

      // Gallery screenshot
      const galleryScreenshotPath = path.join(outputDir, `gallery_${vp.name}.png`);
      await page.screenshot({ path: galleryScreenshotPath });

      // Run diagnostics on gallery layout
      const diagnostics = await page.evaluate((vpWidth) => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const clientWidth = document.body.clientWidth;

        const results = {
          bodyScrollWidth: bodyWidth,
          bodyClientWidth: clientWidth,
          documentElementScrollWidth: docWidth,
          hasHorizontalScrollbar: docWidth > vpWidth || bodyWidth > vpWidth,
          zeroMarginElements: [] as Array<{ tagName: string; className: string; id: string }>,
          overflowingElements: [] as Array<{ tagName: string; className: string; id: string; right: number; width: number }>
        };

        // Inspect key layout containers for zero margin / padding issues
        const selectors = ['.max-w-6xl', '.max-w-5xl', '.mx-auto', 'grid', 'section', 'main'];
        const elements = document.querySelectorAll(selectors.join(', '));
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          // Check for overflow elements
          if (rect.right > vpWidth) {
            results.overflowingElements.push({
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              right: rect.right,
              width: rect.width
            });
          }

          // Check if the container is full width and has zero margins/padding
          if (rect.left === 0 && rect.right === vpWidth && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
            const htmlEl = el as HTMLElement;
            const style = window.getComputedStyle(htmlEl);
            const pL = parseFloat(style.paddingLeft);
            const pR = parseFloat(style.paddingRight);
            const mL = parseFloat(style.marginLeft);
            const mR = parseFloat(style.marginRight);

            if (pL === 0 && pR === 0 && mL === 0 && mR === 0) {
              results.zeroMarginElements.push({
                tagName: el.tagName,
                className: el.className,
                id: el.id
              });
            }
          }
        });

        return results;
      }, vp.width);

      // Open Modal
      const cardSelector = 'button.group.flex-none, button.group.flex-col';
      const firstCard = page.locator(cardSelector).first();
      let modalOpened = false;
      let canvasInfo: unknown = null;
      let closeTest: { success: boolean; message: string } | null = null;

      if (await firstCard.count() > 0) {
        await firstCard.click();
        await page.waitForTimeout(1000); // Wait for modal animation to complete
        
        const modal = page.locator('#katha-modal');
        const modalVisible = await modal.isVisible();
        
        if (modalVisible) {
          modalOpened = true;
          
          // Modal screenshot
          const modalScreenshotPath = path.join(outputDir, `modal_${vp.name}.png`);
          await page.screenshot({ path: modalScreenshotPath });

          // Inspect canvas inside modal
          canvasInfo = await page.evaluate(() => {
            // Locate the template canvas
            const canvasEl = document.querySelector('[class*="TemplateCanvas"], div > div > style + div, div[style*="width"][style*="height"]');
            if (canvasEl) {
              const rect = canvasEl.getBoundingClientRect();
              const htmlEl = canvasEl as HTMLElement;
              const computedStyle = window.getComputedStyle(htmlEl);
              return {
                found: true,
                tagName: canvasEl.tagName,
                styleWidth: htmlEl.style.width || computedStyle.width,
                styleHeight: htmlEl.style.height || computedStyle.height,
                rectWidth: rect.width,
                rectHeight: rect.height,
                aspectRatio: rect.width / rect.height
              };
            }
            return { found: false };
          });

          // Verify Close Button interactive check
          const closeBtn = page.locator('button[aria-label="Close template preview"]');
          if (await closeBtn.count() > 0) {
            try {
              // Ensure close button is visible and click it
              await expect(closeBtn).toBeVisible();
              await closeBtn.click({ timeout: 2000 });
              await page.waitForTimeout(500);
              const isClosed = !(await modal.isVisible());
              closeTest = {
                success: isClosed,
                message: isClosed ? "Closed successfully" : "Failed to close, modal still visible"
              };
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              closeTest = {
                success: false,
                message: `Click intercepted/failed: ${message}`
              };
              // Close via Escape key if blocked
              await page.keyboard.press('Escape');
            }
          } else {
            closeTest = {
              success: false,
              message: "Close button not found in page DOM"
            };
          }
        }
      }

      report.viewports[vp.name] = {
        viewport: vp,
        layoutDiagnostics: diagnostics,
        modalOpened,
        canvasInfo,
        closeButtonTest: closeTest
      };

      // Assert basic properties
      expect(modalOpened).toBe(true);
    });
  }
});
