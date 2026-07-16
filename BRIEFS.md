# BRIEFS.md — The Gilded Archive Build Constitution
### pb-v3 · FABLE 25 orchestrator/builder split · 2026-07-09

**Authority chain:** this file → `pb-v3/DESIGN.md` (wabi-sabi law) → `KATHA_BOOKING_PRD/KATHA_BOOKING_PRD.md` (product spec).
**Dead documents:** the repo-root `/DESIGN.md` (light "ATELIER / Forest + Cream") is superseded — never source tokens from it. The PRD §4.1 accent `#9A3D2A` (Achuete Red) is **revoked**; the Gilded Archive accent is `--color-katha-gilt`.

---

## PART I — THE CONSTITUTION (binds every studio)

### 1. Palette (exact; no invention)
The only paint is `app/globals.css`:

| Token | Hex | Role |
|---|---|---|
| `--color-katha-l0` | `#110F0D` | Kamagong — page void |
| `--color-katha-l1` | `#181512` | Kamagong Lift — section surface |
| `--color-katha-l2` | `#201B16` | Oiled Oak — card |
| `--color-katha-l3` | `#28221B` | Kape — raised card / drawer |
| `--color-katha-ink` | `#F5EFE6` | Piña Ecru — primary ink |
| `--color-katha-hi` | `#E4DACA` | Bone — display headlines |
| `--color-katha-mut` | `#A89C8A` | Rattan — secondary ink |
| `--color-katha-fnt` | `#857D71` | Capiz Slate — meta, **base surfaces only** |
| `--color-katha-gilt` | `#DCCBB5` | Satin Champagne — CTAs, active, intent |
| `--color-katha-gilt-dark` | `#8A7350` | gilt on light stock |
| `--color-katha-gilt-low` | `rgba(220,203,181,.10)` | selected wash |
| `--color-katha-moss` / `-hi` | `#4E5B48` / `#8FA283` | state only / when moss must read |
| `--color-katha-ln` / `-ln2` | ecru @ .12 / .28 | hairlines |
| `--color-stock-*` | see globals.css | print-stock previews only |

**FORBIDDEN, hard-block:** `#8C382A`, `#9A3D2A`, `#a9432f`, any crimson/brick/red variant; legacy oax `#0a0806`, `#bf9d2c`, `#c4c1b8`; pure `#000`/`#fff`. **No new hex literals** — if a component needs paint, it uses a `var(--color-katha-*)` token. New tokens require a PROPOSALS entry (see §7).

### 2. Typography
- Display: **FH Ronaldson** — self-hosted, already wired as `--font-display` in `globals.css`. Light weights, tight tracking. Never synth-bold.
- `--font-serif` = Newsreader (italic editorial), `--font-body` = Cormorant, `--font-mono` = Courier Prime — all via `next/font` in `layout.tsx`. Mono meta: 8–10px, uppercase, `.15–.24em` tracking, `//` prefixes.
- Template faces (Cinzel, Playfair, Rochester, Great Vibes…) exist **only inside preset renders** — never in app chrome.
- **No new fonts. No font CDN additions.**

### 3. Motion — the Quiet-Luxury Law (LOCKED)
- Settle / return / reveal: **≥1.2s**, GSAP `power3.out` / `power4.out`; CSS equivalent `cubic-bezier(0.16,1,0.3,1)` or `cubic-bezier(0.32,0.72,0,1)`. Extreme deceleration — a wood plate turning in gallery light.
- Symmetric transitions (shutters, geometry morphs) may keep their existing `inOut` eases — do not "correct" them.
- **Banned:** `back`, `elastic`, `bounce`, spring physics, anything snappy.
- Card tilt ceiling **6°**.
- Every GSAP timeline wrapped in `gsap.matchMedia()` **and** carries a `prefers-reduced-motion: reduce` branch that force-reveals whatever the timeline would have revealed. A blank screen under reduced motion is a build failure.

### 4. Copy
Real copy only, sourced from `lib/content.json` and PRD §6. Voice: quiet, editorial, tactile. **Forbidden in user copy:** "luxury", "premium", "stunning", "amazing" (the `api/selection` guard enforces these), lorem of any kind, and technical/agentic vocabulary (SDK, pipeline, automation, agent). Footer law: `Plate No. 2026-CF · ©2026 Katha Booth`.

### 5. Quality gates (all must pass before a studio reports done)
1. **Zero console errors** on every touched route (`scripts/shot.js` prints them — an error in shot output = not done).
2. WCAG AA: focus-visible = 2px `--color-katha-ink` outline; `--color-katha-fnt` never small text on `l1+`; tap targets ≥44×44; full keyboard path; `aria-hidden` on decorative SVG/noise.
3. Responsive at 390 / 768 / 1440 (shot.js at 1440×900 and 390×844 minimum). No horizontal scroll.
4. Reduced-motion pass: `node scripts/shot.js <url> <out> --reduced` — all content visible.
5. `npm run build` clean. `npm run guard:ci` clean.

### 6. Structure & texture
Zero `border-radius` on cards/surfaces/images. Hairlines are `--color-katha-ln`; the sanctioned divider is the calado stitch, never bare `<hr>`. Depth = tonal plates + the `#katha-patina` feTurbulence filter (defined in `layout.tsx`), not blur-shadow soup. Asymmetry (Fukinsei) and held empty space (Ma) over symmetric 6/6 grids.

### 7. Shared-file law (collision prevention)
**Director-owned, read-only to studios:** `app/globals.css`, `app/layout.tsx`, `lib/content.json`, `lib/templates.ts`, `lib/layouts.js`, `vendor/**`, `package.json`, `next.config.ts`, `middleware.ts`.
Need a change there? Append a dated entry to `PROPOSALS-<studio>.md` (repo root of pb-v3) with the exact diff you want; the Director integrates. Never edit another studio's domain.

### 8. The Self-Critique Loop (frontend studios — mandatory, 3 passes)
The shared dev server is already running at **http://localhost:3010** (Director-owned; do NOT start your own — HMR picks up your edits).
Each pass:
1. **Render:** `node scripts/shot.js http://localhost:3010/<route> .shots/<studio>/pass<N>-desktop.png` and `--w 390 --h 844` for mobile.
2. **Critique your own pixels** — hunt AI slop: muddy contrast, generic type scale, dead zones, orphan spacing, misalignment, default-looking hover states, placeholder-shaped emptiness.
3. **Fix every finding.**
4. **Add exactly ONE deliberate complexity upgrade** — a texture, a micro-interaction, an editorial detail (e.g. a patina pass on a surface, a gilt hairline that draws itself in, a mono registry stamp, a magnetic-but-decelerated hover).
5. Log the pass in `CRITIQUE-<STUDIO>.md`: findings → fixes → the upgrade → shot paths.
Pass 3 must additionally include the `--reduced` shot and the mobile shot.

### 9. Commit law
Branch: `feat/pb-v3-gallery-first` (current). One commit per studio at completion, prefix `feat(anvil|loom|thread): …`, staging **only your domain files** + your CRITIQUE/PROPOSALS files. If `index.lock` is busy (parallel sibling), wait 2s and retry.

### 10. Pinned seams (cross-studio contracts — FROZEN)
- `components/booking/VaultDrawer.tsx` exports `VaultDrawer({ selection, openDates, onClose })` and `type DrawerSelection`. THREAD may evolve the drawer's internals freely; the exported names and prop shape are **frozen**. LOOM consumes them verbatim (`app/gallery/page.tsx` imports both) and never edits the drawer.
- THREAD's customizer mounts at `app/portal/[id]/template-design/page.tsx` (public route — not studio-gated).
- `POST /api/selection` request shape = the existing `Selection` type (quoted in §THREAD). ANVIL keeps it verbatim; THREAD builds against it.
- shot.js note: the cinematic entrance auto-resolves in ~6s — use `--wait 7000` for settled-page shots; the default 1800ms captures the entrance itself.

---

## PART II — STUDIO BRIEFS

### ⚒ STUDIO ANVIL — Backend
**Domain (yours alone):** `app/api/**`, `lib/booking.ts`, `lib/supabase.ts`, `lib/supabase/**`, `scripts/api-smoke.mjs` (new).
**Read-only:** `vendor/katha-core` (ownership-guarded — never edit; wrap in routes instead), `middleware.ts`, `lib/content.json`.

**Mission.** Make the funnel real end-to-end against the live Supabase project (`NEXT_PUBLIC_SUPABASE_URL` in `.env`), with zero silent failures.

1. **`GET /api/availability` (create).** Allow-list model (PRD §7.5): read `available_dates` (`select=date,status`) with the anon client from `lib/supabase.ts`. Selectable = `status='open'` AND `date ≥ today + 7` (min-notice constant, commented). Response `{ dates: [{date, status}] }`. On fetch failure return **503 `{ error: 'availability temporarily unavailable' }`** — a failure must be visible, never an empty-but-200 calendar. Dates are ISO strings; never round-trip through `new Date(iso)` UTC parsing.
2. **`POST /api/selection` (modify).** Wire the stubbed "dispatch target #3 supabase": insert into `selections` with **only** these columns — `lead` (= `leads.lead_hash`, nullable), `template_id`, `template_name`, `layout`, `names`, `date`, `venue`, `font_family`, `reference_photos`, `configuration` (JSON), `service_tier`. Keep the existing `Selection` type and Resend dispatch **verbatim** — Studio THREAD builds against that exact contract. Use `supabaseAdmin` (server-only); if it's unconfigured, report `{ ok:false, detail }` in the dispatch summary like the email target does.
3. **`/api/lead` audit.** The route delegates to `@katha/core handleInquiry`. Read the vendor source; verify the insert is whitelisted to the real `leads` columns (`client_name`, `client_email`, `client_phone`, `event_date` TEXT ISO, `lead_hash`, `venue_name`, `tier_selected`, `addons` TEXT-JSON, `notes` TEXT-JSON, `status:'Inquired'`). Any key outside that set makes PostgREST reject the whole insert — every lead lost. If the vendor drifts, correct it **in the route wrapper** (translate/whitelist before delegating), not in vendor.
4. **`scripts/api-smoke.mjs` (create).** Node script, no test framework: hits :3010 — `GET /api/availability` (assert shape or honest 503), `POST /api/selection` with a valid + an invalid payload (assert dispatch summary shape; forbidden-word rejection), `POST /api/lead` with a **dry-run guard** (env `SMOKE_LIVE=1` gates any real insert; default asserts validation errors only, e.g. missing email → 4xx). Exit non-zero on failure, print a table.

**Your 3-pass loop (no pixels):** pass 1 — silent-failure hunt (any path that swallows an error or returns fake success); pass 2 — schema-drift hunt (every column name checked against the PRD §7.4 verified table); pass 3 — error-shape consistency (all failures share `{ error }` / dispatch-summary shape, correct status codes). Log in `CRITIQUE-ANVIL.md`.
**Done =** api-smoke green against :3010 + `npm run build` clean + commit `feat(anvil): …`.

### 🧵 STUDIO LOOM — Gallery
**Domain (yours alone):** `app/page.tsx`, `app/gallery/**`, `components/gallery/**`, `components/SidebarClient.tsx`.
**Materials provided:** `public/portfolio/*.webp` (8 real Katha shots, optimized), `public/brand/gilded-logomark.webp`, motion reference `/Users/jedg./Desktop/Zenith/GildedArchive/GildedArchive_WordmarkEntrance.tsx` (read-only).

**Mission.** The landing masonry currently renders **empty placeholder boxes** (`{/* Placeholder for actual generated images */}`). That is the AI slop this rebuild kills.

1. **Faithful preset thumbnails.** Each card in the masonry and `/gallery` renders a true miniature of its preset from `lib/templates.ts` + `lib/layouts.js`: preset background/border colors, its decorative SVG, and its slot rectangles positioned as **percentages of the layout viewBox** (`left = slot.x/viewBox.w*100%`, etc.). Slots stay **empty, palette-aware rectangles** — they are where the client's photos will print; filling them with stock is a lie. Correct aspect per format (strip 2×6 vs postcard 4×6 vs pv).
2. **Real photography.** Use `public/portfolio/*.webp` for atmosphere — a hero treatment and/or a "The Work" band — photography subordinate to type, grain-compatible, `loading="lazy"` below the fold, descriptive `alt`.
3. **Filters.** Format/tier chips per the existing `globals.css` chip styles (gilt underline = active; never gilt as a filled chip — accent scarcity).
4. **Entrance choreography.** Fade-up with blur resolve per Constitution §3 easing; stagger, heavy deceleration. Respect the existing `CinematicEntrance` shell — do not duplicate its job.

**Done =** 3-pass critique loop logged in `CRITIQUE-LOOM.md` (+1 complexity upgrade per pass) + zero console errors on `/` and `/gallery` + gates §5 + commit `feat(loom): …`.

### 🪡 STUDIO THREAD — Customizer
**Domain (yours alone):** `components/customizer/**`, `components/booking/**`, `app/portal/**`.

**Mission.** Elevate `CustomizerClient` + `LivePreview` + `VaultDrawer` to the vibe-first model (PRD §7.3) that the old book.kathabooth.com got right:

1. **Pick a style:** preset gallery of text-free thumbnails (reuse the same percent-math rendering law as LOOM — but do not import from `components/gallery/**`; keep your own preview primitives in `components/customizer/`).
2. **Personalize only:** `names`, `date`, `venue`, optional font choice, text position top/bottom (`getModifiedLayout` flip). Defaults flow from real state — **never** synthesized couple names. Ghost placeholders (`"Steven"`, `"Cristalyn"`, `"LORENZO & CORAZON"`) are banned; initialize `""`.
3. **Live faithful preview:** slots + text zone absolutely positioned as viewBox percentages from `lib/layouts.js`; palette-aware empty slots; updates on every keystroke.
4. **Motion:** 3D tilt ≤6°, damped return ≥1.2s `power3.out`, disabled under reduced motion.
5. **Persist:** `POST /api/selection` with the **existing** `Selection` type — exactly:
   ```ts
   { templateId: string; templateName: string; layout: "strip"|"postcard"|"postcard-vertical";
     names?: string|null; date?: string|null; venue?: string|null; fontFamily?: string|null;
     referencePhotos?: string[]|null; notes?: string|null; lead?: string|null; selectedAt: string }
   ```
   Loading state on the submit control; failure surfaces a readable inline error (`--color-katha-ink` text with a gilt accent border — never accent-only text); success is honest (no fake "sent!" without a 2xx).

**Done =** 3-pass critique loop logged in `CRITIQUE-THREAD.md` (+1 complexity upgrade per pass) + zero console errors on the customizer route + gates §5 + commit `feat(thread): …`.

---

## PART III — DIRECTOR'S GATE (cold review)
After all studios return: fresh-eyes pixel audit of every shot, code audit of every commit, codex CLI as independent critic (gemini CLI absent — council runs degraded), `npm run build` + `npm run guard:ci` + `api-smoke` + full shot sweep. QA notes issued per studio; fix round; integration commit.
