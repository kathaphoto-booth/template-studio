# CRITIQUE-LOOM.md — Gallery self-critique log
### 2026-07-09 · executed inline by the Director (parallel dispatch cut off by the account session limit; same brief, sequential)

## Pass 1 — kill the placeholder slop
Shots: `.shots/loom/pass1-desktop.png`, `.shots/loom/pass1-mobile.png` (0 console errors).
- **Found:** masonry cards rendered empty `l2` boxes with a watermark span and a literal "Placeholder for actual generated images" comment. **Fixed:** `PlateThumb` renders a faithful miniature per plate — layout-registry slot geometry (`getLayout` → percent of the format `VIEWBOX`), the plate's own paper/slot/edge paint, museum-matting hairline, and a text-free accent thread on the branding pedestal (thumbnails carry no inscription per PRD §7.3; slots stay empty — that is where the night's photos print).
- **Found:** card reveal ran 0.7s — under the ≥1.2s motion-law floor. **Fixed:** 1.25s with blur-resolve fade-up, `cubic-bezier(0.16,1,0.3,1)`.
- **Found:** landing copy claimed "Eighty-two print plates" over a 12-plate wall. **Fixed:** honest copy — 82 in the archive, twelve hanging tonight.
- **Upgrade #1:** hover plate-ordinal stamp ("Plate 004 — 2×6 Strip") in mono over the darkened base.

## Pass 2 — legibility, truth of geometry, mobile conversion
Shots: `.shots/loom/pass2-desktop.png`, `pass2-mobile.png`, `pass2-full.png` (0 console errors).
- **Found:** tone-on-tone plates (Warm Umber) lost slot definition. **Fixed:** slot inset ring raised to `edge` at 45% alpha.
- **Found:** card aspect trusted the hand-typed `ratio` to agree with the true canvas. **Fixed:** `plateAspect()` derives aspect from the layout registry's viewBox; `ratio` is only the fallback.
- **Found (conversion defect):** the booking sidebar is `hidden md:flex` — mobile had NO reserve CTA anywhere. **Fixed:** mobile-only bottom-docked "Reserve your date →" bar, ≥44px target, `env(safe-area-inset-bottom)` cleared (PRD §9.2).
- **Upgrade #2:** Binakul patina wash (`filter: url(#katha-patina)`) over every plate paper — textile, never flat pixel.
- Also landed with this pass: "The work." band — four real portfolio WebPs in an asymmetric 12-col rhythm (7/5/5-offset/4), lazy-loaded, descriptive alt, mono figcaptions, footer plate line.

## Pass 3 — reduced-motion proof
Shots: `.shots/loom/pass3-desktop.png`, `pass3-gallery.png`, `pass3-reduced.png` (0 console errors).
- **Found (real bug):** `initial={reduce ? false : {...}}` branches on `useReducedMotion()`, which is `false` during SSR → hydration mismatch (console error) on every reduce-enabled client. **Fixed:** `initial` is unconditional; the transition duration collapses to 0 under reduce — server HTML stable, content force-reveals.
- Motion's own console.warning under forced reduce ("Animations may not appear as expected") remains — a warning, not an error; behavior verified correct in `pass3-reduced.png` (all content visible).
- **Upgrade #3:** the plate's accent thread draws wider on card hover (38% → 56%, 1.2s, extreme deceleration) — the loom pulls the thread.

## Gates
Zero console errors on `/` and `/gallery` (normal + reduced). `npm run build` ✓ (9/9 pages). Note: the dev-tools "N" badge overlapping the mobile bar in shots is Next.js dev-only chrome, not shipped.
