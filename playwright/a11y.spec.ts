import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Surfaces reachable without auth; add the admin queue here once Plan 3 lands.
const SURFACES = ['/gallery', '/portal/demo/template-design'];

// The cinematic entrance is session-guarded (plays once per session). Seed the
// session flag so scans measure the page at rest — WCAG contrast applies to
// content at rest, and mid-fade blends read as false contrast failures.
const SKIP_ENTRANCE = { 'katha-archive-entered': '1' };

for (const path of SURFACES) {
  test(`axe: ${path} has no serious violations`, async ({ page }) => {
    await page.addInitScript((kv) => {
      for (const [k, v] of Object.entries(kv)) sessionStorage.setItem(k, v as string);
    }, SKIP_ENTRANCE);
    // A 404 page passes axe trivially — assert the surface actually exists
    // so a lost route can never masquerade as an accessible one (found the
    // hard way when a merge dropped /gallery and this suite stayed green).
    const res = await page.goto(path);
    expect(res?.status(), `${path} must serve 200`).toBe(200);
    // Let the weave/fin reveals land, then reveal the parallax footer by
    // scrolling to the end — contrast is judged in each surface's readable
    // state. At page top the footer sits occluded behind the opaque page at
    // 0.2 opacity (the Osmo reveal), which axe misreads as failing text.
    await page.waitForTimeout(1800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Velvet Rope law (DESIGN.md §4): locked content stays visible but
      // dimmed to 0.22 and carries `inert` — it is inactive UI, exempt from
      // the contrast requirement until the gate opens.
      .exclude('.act-gate:not(.act-gate--open)')
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious, JSON.stringify(serious.map((v) => v.id), null, 2)).toEqual([]);
  });

  test(`tap targets >=44px: ${path}`, async ({ page }) => {
    await page.addInitScript((kv) => {
      for (const [k, v] of Object.entries(kv)) sessionStorage.setItem(k, v as string);
    }, SKIP_ENTRANCE);
    const res = await page.goto(path);
    expect(res?.status(), `${path} must serve 200`).toBe(200);
    await page.waitForTimeout(1800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    const small = await page.$$eval('a[href], button, [role="button"], [role="radio"], [role="option"], input', (els) =>
      els.filter((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        const visible = r.width > 0 && r.height > 0;
        return visible && (r.height < 44 || r.width < 44);
      }).map((el) => (el.textContent || (el as HTMLElement).getAttribute('aria-label') || el.nodeName).trim().slice(0, 40)),
    );
    expect(small, `Under-44px targets on ${path}`).toEqual([]);
  });
}

test('reduced-motion renders all content (no opacity:0 traps)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/gallery');
  await expect(page.locator('body')).toBeVisible();
  const hidden = await page.$$eval('h1,h2,h3,[data-reveal]', (els) =>
    els.filter((el) => getComputedStyle(el).opacity === '0').length);
  expect(hidden).toBe(0);
  await ctx.close();
});

test('keyboard: the funnel primary CTA is reachable and focus is visible', async ({ page, browserName }) => {
  // WebKit (the iphone-se project) does not move focus with a plain Tab —
  // that's iOS Safari's real keyboard model, not a product regression. The
  // keyboard-focus law is asserted by the desktop (chromium) project.
  test.skip(browserName === 'webkit', 'plain Tab does not traverse focus in WebKit');
  await page.goto('/gallery');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? getComputedStyle(el).outlineStyle : 'none';
  });
  expect(outline).not.toBe('none');
});
