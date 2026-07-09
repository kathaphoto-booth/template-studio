# pb-v3 "Gilded Archive" FABLE 25 Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:dispatching-parallel-agents. This plan is executed by three autonomous builder studios dispatched in parallel plus a Director (orchestrator) session. Per the user's FABLE 25 directive, tasks are studio-grained briefs with full subsystem autonomy — not 2-minute TDD micro-steps; the user's orchestration instructions override the default plan granularity. Steps use checkbox syntax for tracking.

**Goal:** Elevate the pb-v3 booking codebase from the `fable5-reference/post-generated` baseline to a premium, non-templated Gilded Archive standard via three parallel builder studios (Backend, Gallery, Customizer), each enforcing a mandatory 3-pass rendered-pixel self-critique loop.

**Architecture:** Next.js 15 App Router monorepo workspace (`katha-monorepo` → `pb-v3`), git worktree branch `feat/pb-v3-gallery-first`. One shared dev server on port 3010 owned by the Director; studios have disjoint file domains so parallel editing cannot conflict. Shared design law lives in `pb-v3/BRIEFS.md`; shared files (globals.css, layout.tsx, content.json, templates.ts, layouts.js, vendor/**) are Director-owned and read-only to studios.

**Tech Stack:** Next.js 15 · React 19 · Tailwind 4 · GSAP 3.15 + lenis · Supabase (`hvvomiyskizxzhyytcfd`) · Resend · Playwright (screenshot harness `scripts/shot.js`) · cwebp/ffmpeg for production media.

## Global Constraints (copied verbatim from governing sources)

- Palette = the exact `app/globals.css` `--color-katha-*` / `--color-stock-*` tokens. **Forbidden hex anywhere:** `#8C382A`, `#9A3D2A`, `#a9432f`, any crimson/brick variant; legacy oax `#0a0806`, `#bf9d2c`, `#c4c1b8`; pure `#000` / `#fff` (always tonal). No new hex values without Director approval.
- Display face = self-hosted FH Ronaldson (`--font-display`, globals.css); `next/font` Newsreader → `--font-serif`, Cormorant → `--font-body`, Courier Prime → `--font-mono` (layout.tsx). Template faces (Cinzel, Playfair, Rochester…) appear only inside preset renders. No new fonts.
- Quiet-Luxury Motion Law (PRD §4.3, LOCKED): settle/return/reveal ≥1.2s, `power3.out`/`power4.out` (CSS: `cubic-bezier(0.16,1,0.3,1)` or `cubic-bezier(0.32,0.72,0,1)`); symmetric transitions may keep existing `inOut`; **no back/elastic/bounce/spring**; card tilt ≤6°; every GSAP timeline inside `gsap.matchMedia()` **with a reduce-branch that force-reveals content**.
- Real copy only — from `lib/content.json` / PRD §6. Forbidden in user copy: "luxury", "premium", "stunning", "amazing" (enforced in `api/selection`), plus any technical/agentic vocabulary.
- Zero console errors (hard gate). WCAG AA: focus ring = `--color-katha-ink` 2px outline (never an accent-only ring); `--color-katha-fnt` never small text on l2+; tap targets ≥44px; keyboard path; reduced-motion correct.
- Zero `border-radius` on cards/surfaces; hairlines via `--color-katha-ln`; no drop-shadow soup; no 6/6 symmetric grids in brand chrome.
- `npm run build` and `npm run guard:ci` must pass before any "done" claim.

---

### Task 0 (Director): Constitution, harness, media, checkpoint

**Files:** Create `BRIEFS.md`, `scripts/shot.js`, `public/portfolio/*.webp` (8), `public/brand/gilded-logomark.webp`; modify `.gitignore` (+`.shots/`).

- [x] Write `BRIEFS.md` (constitution + 3 studio briefs)
- [x] Write `scripts/shot.js` (Playwright; prints page console errors; `--reduced` flag)
- [x] Generate WebP production media from `KATHA_BOOKING_PRD/katha-booking-html/assets/portfolio/*.jpg` and `Zenith/GildedArchive/GildedArchive_Logomark.png`
- [x] Start shared dev server :3010; smoke-test shot.js
- [x] Checkpoint commit

### Task 1 (Studio ANVIL — Backend): see BRIEFS.md §ANVIL

**Files:** `app/api/availability/route.ts` (create), `app/api/selection/route.ts` (modify: wire Supabase dispatch target #3), `app/api/lead/route.ts` (verify/harden wrapper only), `lib/booking.ts`, `lib/supabase.ts`, `scripts/api-smoke.mjs` (create).
**Interfaces produced:** `GET /api/availability → {dates:[{date:'YYYY-MM-DD',status:'open'|'booked'}]} | 503 {error}`; `POST /api/selection` keeps the existing `Selection` type verbatim.

- [ ] Availability endpoint (allow-list model, §7.5; failure visible, never silent-empty)
- [ ] Selection → `selections` table insert (whitelist per PRD §7.4; FK `lead → leads.lead_hash`)
- [ ] Lead route audit against verified `leads` schema (vendor/katha-core is read-only)
- [ ] `api-smoke.mjs` green against :3010; `npm run build` clean; single `feat(anvil):` commit

### Task 2 (Studio LOOM — Gallery): see BRIEFS.md §LOOM

**Files:** `app/page.tsx`, `app/gallery/**`, `components/gallery/**`, `components/SidebarClient.tsx`.
**Interfaces consumed:** `lib/templates.ts` presets, `lib/layouts.js` slot math, `public/portfolio/*.webp`.

- [ ] Replace placeholder thumbnails with faithful miniature vector preset renders (percent-positioned slot geometry; empty palette-aware slots — never stock photos inside slots)
- [ ] Real photography sections from `public/portfolio/*.webp` (lazy, alt text, subordinate to type)
- [ ] 3-pass shot.js critique loop on `/` and `/gallery` + one complexity upgrade per pass, logged in `CRITIQUE-LOOM.md`
- [ ] Zero console errors; AA contrast; `feat(loom):` commit

### Task 3 (Studio THREAD — Customizer): see BRIEFS.md §THREAD

**Files:** `components/customizer/**`, `components/booking/**`, `app/portal/**`.
**Interfaces consumed:** `POST /api/selection` existing `Selection` type; `lib/layouts.js`; `lib/templates.ts`.

- [ ] Vibe-first flow: preset pick → personalize (names/date/venue, font, text top/bottom) → live faithful preview (viewBox percent math)
- [ ] Tilt ≤6°, return ≥1.2s `power3.out`, reduced-motion disables tilt; no ghost default names (init `""`)
- [ ] 3-pass shot.js critique loop + one complexity upgrade per pass, logged in `CRITIQUE-THREAD.md`
- [ ] Zero console errors; `feat(thread):` commit

### Task 4 (Director): Cold review, integration, verification

- [ ] Cold review of all studio output (fresh-eyes pixel + code audit; codex CLI as second critic — gemini CLI absent, council degraded)
- [ ] QA notes issued; fix round if findings
- [ ] `npm run build` + `npm run guard:ci` + api-smoke + shot sweep green
- [ ] Final integration commit + Director's Summary
