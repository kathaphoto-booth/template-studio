# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/layout-viewport-scan.spec.ts >> Automated Layout and Responsiveness Scans >> scan viewport 320px
- Location: tests/e2e/layout-viewport-scan.spec.ts:74:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  145 |             const pL = parseFloat(style.paddingLeft);
  146 |             const pR = parseFloat(style.paddingRight);
  147 |             const mL = parseFloat(style.marginLeft);
  148 |             const mR = parseFloat(style.marginRight);
  149 | 
  150 |             if (pL === 0 && pR === 0 && mL === 0 && mR === 0) {
  151 |               results.zeroMarginElements.push({
  152 |                 tagName: el.tagName,
  153 |                 className: el.className,
  154 |                 id: el.id
  155 |               });
  156 |             }
  157 |           }
  158 |         });
  159 | 
  160 |         return results;
  161 |       }, vp.width);
  162 | 
  163 |       // Open Modal
  164 |       const cardSelector = 'button.group.flex-none, button.group.flex-col';
  165 |       const firstCard = page.locator(cardSelector).first();
  166 |       let modalOpened = false;
  167 |       let canvasInfo: unknown = null;
  168 |       let closeTest: { success: boolean; message: string } | null = null;
  169 | 
  170 |       if (await firstCard.count() > 0) {
  171 |         await firstCard.click();
  172 |         await page.waitForTimeout(1000); // Wait for modal animation to complete
  173 |         
  174 |         const modal = page.locator('#katha-modal');
  175 |         const modalVisible = await modal.isVisible();
  176 |         
  177 |         if (modalVisible) {
  178 |           modalOpened = true;
  179 |           
  180 |           // Modal screenshot
  181 |           const modalScreenshotPath = path.join(outputDir, `modal_${vp.name}.png`);
  182 |           await page.screenshot({ path: modalScreenshotPath });
  183 | 
  184 |           // Inspect canvas inside modal
  185 |           canvasInfo = await page.evaluate(() => {
  186 |             // Locate the template canvas
  187 |             const canvasEl = document.querySelector('[class*="TemplateCanvas"], div > div > style + div, div[style*="width"][style*="height"]');
  188 |             if (canvasEl) {
  189 |               const rect = canvasEl.getBoundingClientRect();
  190 |               const htmlEl = canvasEl as HTMLElement;
  191 |               const computedStyle = window.getComputedStyle(htmlEl);
  192 |               return {
  193 |                 found: true,
  194 |                 tagName: canvasEl.tagName,
  195 |                 styleWidth: htmlEl.style.width || computedStyle.width,
  196 |                 styleHeight: htmlEl.style.height || computedStyle.height,
  197 |                 rectWidth: rect.width,
  198 |                 rectHeight: rect.height,
  199 |                 aspectRatio: rect.width / rect.height
  200 |               };
  201 |             }
  202 |             return { found: false };
  203 |           });
  204 | 
  205 |           // Verify Close Button interactive check
  206 |           const closeBtn = page.locator('button[aria-label="Close template preview"]');
  207 |           if (await closeBtn.count() > 0) {
  208 |             try {
  209 |               // Ensure close button is visible and click it
  210 |               await expect(closeBtn).toBeVisible();
  211 |               await closeBtn.click({ timeout: 2000 });
  212 |               await page.waitForTimeout(500);
  213 |               const isClosed = !(await modal.isVisible());
  214 |               closeTest = {
  215 |                 success: isClosed,
  216 |                 message: isClosed ? "Closed successfully" : "Failed to close, modal still visible"
  217 |               };
  218 |             } catch (err: unknown) {
  219 |               const message = err instanceof Error ? err.message : String(err);
  220 |               closeTest = {
  221 |                 success: false,
  222 |                 message: `Click intercepted/failed: ${message}`
  223 |               };
  224 |               // Close via Escape key if blocked
  225 |               await page.keyboard.press('Escape');
  226 |             }
  227 |           } else {
  228 |             closeTest = {
  229 |               success: false,
  230 |               message: "Close button not found in page DOM"
  231 |             };
  232 |           }
  233 |         }
  234 |       }
  235 | 
  236 |       report.viewports[vp.name] = {
  237 |         viewport: vp,
  238 |         layoutDiagnostics: diagnostics,
  239 |         modalOpened,
  240 |         canvasInfo,
  241 |         closeButtonTest: closeTest
  242 |       };
  243 | 
  244 |       // Assert basic properties
> 245 |       expect(modalOpened).toBe(true);
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  246 |     });
  247 |   }
  248 | });
  249 | 
```