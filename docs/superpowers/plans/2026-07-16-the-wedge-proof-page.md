# The Wedge — /proof Positioning Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A positioning page at `/proof` for the LA/OC market whose story — and live, in-page demonstration — is that a client sees their own personalized print (names, date, palette) in the customizer before ever booking, which no surveyed LA/OC competitor offers.

**Architecture:** One new route (`app/proof/`) with a thin server component (metadata) over a client component that reuses the harvest customizer's primitives (`LivePreview`, `Field`, `Swatch`) and data (`lib/content.json` plates + palettes). The page *is* the proof: visitors type their names/date and watch the print render live, then step into the full customizer via the one gilt CTA.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 4 tokens from `app/globals.css @theme`, vitest + testing-library + jest-axe, Playwright a11y suite.

## Global Constraints

- Gilded Archive law (root `DESIGN.md`): dark surface ladder only; no red anywhere; FH Ronaldson display; Courier Prime mono eyebrows; editorial asymmetry.
- **One gilt CTA per viewport** (law D2) — verify by screenshot per viewport state.
- Senior floor: essential/interactive text ≥16px; targets ≥44px (primary 48px); decorative mono ≤13px only when duplicated accessibly.
- Motion law: tilt ≤6°, extreme-deceleration curves, `prefers-reduced-motion` force-reveal (no opacity:0 traps).
- Copy: confident and specific, never templated; competitor receipts live in `docs/superpowers/plans/2026-07-16-wedge-competitor-receipts.md`, never named on-page. No banned vocabulary (agentic terms), no exclamation points.
- `npm run guard` must stay APPROVED; full suite green before any commit.

---

### Task 1: ProofClient — the live in-page proof demo

**Files:**
- Create: `app/proof/ProofClient.tsx`
- Test: `tests/proof.test.tsx`

**Interfaces:**
- Consumes: `LivePreview` (`components/customizer/LivePreview.tsx`, props `{template, layoutId, palette, title, subtitle, venue, proofText?}`); `Field` (`components/ui/Field.tsx`, `{id, label, value, onChange, helper?}`); `Swatch` (`components/ui/Swatch.tsx`, `{selected, onSelect, name, bg, ink}`); `content.json` `templates` (plate entries with `{id, plate, name, layout, paper, slot, edge, ink, accent, sName, sSub, font, style}`) and `palettes` (`{key, name, bg, text, sub, slot, stroke}`).
- Produces: default export `ProofClient()` — self-contained client component rendering the full page body (hero, demo, market section, Katha section, CTA).

- [ ] **Step 1: Write the failing test** (`tests/proof.test.tsx`): renders hero headline, demo fields update the live proof aria-label/state, exactly one gilt CTA (`Design your print now`), axe clean.
- [ ] **Step 2:** `npx vitest run tests/proof.test.tsx` — expect FAIL (module not found).
- [ ] **Step 3:** Implement `ProofClient.tsx`: `useState` for `names`, `date`, `paletteKey`; derive `template` = default plate from content.json, `palette` from palettes; sections per the copy plan below; `LivePreview` fed live state.
- [ ] **Step 4:** `npx vitest run tests/proof.test.tsx` — expect PASS.
- [ ] **Step 5:** Commit `feat(proof): live in-page proof demo — the wedge demonstrates itself`.

**Copy plan (hardened against receipts):**
- Eyebrow: `// The Proof · Los Angeles & Orange County`
- H1: `See your print before anyone asks for your name twice.` (alt considered: `Your names. Your date. On the print. Before you book.`)
- Lede: the market fact — everywhere else the print is designed after booking; proof arrives by email days before the event.
- Demo section: `Type. Watch the plate take your names.` — Fields (Your names / Your date) + palette swatches + LivePreview.
- Market section (`How it works everywhere else`): three quiet ledger rows — gallery-then-book, proof-by-email 5–7 days out, portals after payment. No competitor names.
- Katha section (`How it works here`): Plate → Paper → Inscription → the night is reserved only after you've seen it.
- CTA: gilt `Design your print now →` → `/template-design`.

### Task 2: Route + metadata

**Files:**
- Create: `app/proof/page.tsx`

**Interfaces:**
- Consumes: `ProofClient` default export.
- Produces: route `/proof` with `export const metadata` (title `The Proof — see your print before you book`, description with LA/OC keywords; the root layout's title template appends `— Katha Booth`).

- [ ] **Step 1:** Implement `page.tsx` (server component, no client hooks).
- [ ] **Step 2:** `npm run build` — `/proof` appears in the route manifest.
- [ ] **Step 3:** Commit `feat(proof): /proof route + metadata`.

### Task 3: Wire into the a11y gate + full proof

**Files:**
- Modify: `playwright/a11y.spec.ts` (add `/proof` to `SURFACES`)

- [ ] **Step 1:** Add `/proof` to SURFACES.
- [ ] **Step 2:** `npm run build && npx playwright test` — all green (axe, tap targets on /proof included).
- [ ] **Step 3:** `npx vitest run && npx eslint . && npm run guard` — green/APPROVED.
- [ ] **Step 4:** Commit `test(proof): /proof joins the a11y gate`.

### Task 4: Three fine-toothed live passes

- [ ] **Pass 1 (structure & law):** dev server; screenshot every viewport state (desktop + mobile); count gilt CTAs per viewport; check senior floor, focus rings, reduced-motion; fix findings.
- [ ] **Pass 2 (depth & material):** hunt flatness — proof-plate shadow presence, hairline rules, asymmetry, negative space, type scale rhythm; deepen where thin.
- [ ] **Pass 3 (copy & conviction):** read every line aloud against "confident and specific, never templated"; kill any line that could appear on a competitor's site; verify claims against receipts doc.
- [ ] Final: full gates (vitest, playwright, eslint, guard, build), commit, push branch.

## Self-Review

- Spec coverage: positioning story ✓ (hero + market + demo), live personalization demo ✓ (Task 1), research-substantiated claims ✓ (receipts doc, copy plan), design law ✓ (constraints + Task 4 pass 1), three passes ✓ (Task 4), guard-approved branch ✓ (Tasks 3–4).
- No placeholders: copy plan carries actual lines; test content specified in Task 1 Step 1.
- Type consistency: `ProofClient` default export consumed by `page.tsx`; LivePreview/Field/Swatch props match their current sources (verified 2026-07-16).
