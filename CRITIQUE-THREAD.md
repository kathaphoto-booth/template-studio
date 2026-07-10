# CRITIQUE-THREAD.md — Customizer self-critique log
### 2026-07-09 · executed inline by the Director (parallel dispatch cut off by the account session limit; same brief, sequential)

## Pass 1 — make it build, make it honest
Shots: `.shots/thread/pass1-desktop.png`, `pass1-mobile.png`, `pass1-reduced.png` (0 console errors after the dev-server chunk cache was rebuilt).
- **Found (build breaker):** `params: { id: string }` on the Next 15 dynamic route — params are a Promise now. **Fixed:** async page, awaited params.
- **Found (build breaker):** `LAYOUTS[activeTemplate.layout]` indexes with a possibly-undefined key. **Fixed:** `getLayout(...) ?? getLayout("strip-3")`, variations via `layoutsForFormat`.
- **Found (banned copy):** the names input placeholder was literally "e.g., LORENZO & CORAZON" — the exact hardcoded couple the PRD banned. **Fixed:** placeholders are the plate catalog's real specimen lines ("AMARA & SEBASTIAN", "OCTOBER · LONG BEACH"); inputs initialize `""`; the proof falls back to the plate's own specimen copy, never a synthesized couple.
- **Found:** whole surface painted in the superseded PRD hex set (`#E8E1D3`, `#A39B8E`, `#1A1714`…). **Fixed:** migrated to `var(--color-katha-*)` tokens throughout; palette swatches squared (zero-radius law).
- **Upgrade #1:** 3D tilt on the live proof — ≤5° (law ceiling 6°), live-follow on pointermove, damped return 1.2s `cubic-bezier(0.16,1,0.3,1)`, fully inert under `prefers-reduced-motion`.

## Pass 2 — wire the funnel, finish the interaction contract
Verified live in the browser (preview pane), not just statically:
- **Found:** "Finalize Custom Design" was a dead button — the customizer never persisted anything. **Fixed:** POST `/api/selection` with the frozen `Selection` shape (`layout` = format enum; layoutId/palette/textPosition folded into the `notes` JSON string; `lead` only when the route id is a real lead hash). Loading state ("Recording…", disabled), readable inline failure (`--color-katha-ink` text, gilt border-left, `role="alert"`), success replaces the button — no fake "sent!".
- **End-to-end proof:** typed "PROOF TEST — DISREGARD" → proof updated per keystroke → submit → success state → row verified present in the live `selections` table with the exact whitelisted shape → test row deleted (`DELETE … RETURNING` confirmed 1 row).
- **Found:** labels not wired to inputs. **Fixed:** `htmlFor`/`id` on all three fields; `aria-pressed` on all picker buttons; ≥44px targets.
- **Found:** preview subtitle font referenced `Outfit`, which this app never loads (silent sans fallback); hardcoded "LOS ANGELES, CA" venue fallback. **Fixed:** Courier Prime (the canon mono) and venue renders only when provided.
- **Upgrade #2:** inscription-position control (Bottom/Top) driving `getModifiedLayout` — the §7.3 text-flip, previously absent.

## Pass 3 — editorial finish
Shots: `.shots/thread/pass3-desktop.png`, `pass3-mobile.png`, `pass3-reduced.png` (0 console errors, all three).
- **Found:** sidebar prose fell back to browser sans (no `font-body` on the aside). **Fixed.**
- **Upgrade #3:** plate-registry stamp on the proof — "PLATE 004 · KTHA" in mono, palette-aware, bottom-right corner: the maker's mark of the archive on every live proof.

## Gates
Zero console errors (desktop/mobile/reduced). `npm run build` ✓ (9/9). Frozen seams honored: `VaultDrawer` untouched this pass (exports stable); `Selection` type consumed verbatim.
