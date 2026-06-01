# Katha Template Guide — Teaching the Studio to Make Templates

> The Katha-native replacement for the legacy `oax-impeccable-bridge`. That skill
> enforced the **forbidden** OAX brand (obsidian `#0a0806` / gold `#bf9d2c` / vellum
> `#c4c1b8`, Cormorant, Jacobean arc) and must not be run against this repo — see
> CLAUDE.md FORBIDDEN. This guide teaches the same *discipline* against the **locked
> Katha canon** instead.
>
> Canon sources: root `DESIGN_SYSTEM.md` (live) / `DESIGN_SYSTEM.v2.md` (proposed).
> Geometry source: `lib/layouts.js` (LOCKED MEASUREMENT SPEC). Enforcement:
> `scripts/katha-template-guard.mjs`. Deviations: `.impeccable/ignore.md`.

---

## 0. What a "template" is here

One template = one **`PhotoboothPreset`** object in `lib/templates.ts` (the SINGLE
SOURCE OF TRUTH; consumed by the studio preview, the canvas export, AND the gallery
thumbnails). The interface:

```ts
interface PhotoboothPreset {
  id: string;                  // kebab; Signature ids start "katha-"
  name: string;                // gallery label; Signature names start "Katha Signature — "
  type: "strip" | "postcard" | "postcard-vertical";
  layoutId?: string;           // -> lib/layouts.js slot geometry (omit = default for type)
  backgroundColor: string;     // ground
  textColor: string;           // names / caption
  borderColor: string;         // frame line
  secondaryColor: string;      // accent / divider
  fontFamily: string;          // DISPLAY face (see §3)
  titleText, subTitleText, dateText: string;   // sample copy
  slotBorderRadius, slotBorderWidth, slotGap, slotBgColor, innerSpacing: string;
  decorativeSvg: string;       // optional ornament drawn into the canvas
  designerExplanation: string; // shown in editor; brand-voiced, no tech terms
}
```

A **family** = the same aesthetic in its format triad: `strip` (2×6) + `postcard-vertical`
(4×6) + `postcard` (6×4 landscape), sometimes plus L/Γ and N-square landscape variants.
Always ship the triad, not a lone format.

---

## 1. The Two-Tier Model (the one rule that prevents false flags)

| Tier | Identify by | Held to Katha brand? | Fonts / grounds |
|---|---|---|---|
| **Katha Signature** | `id` ^`katha-` or `name` has "Katha Signature —" | **Yes** — 11-token palette + Fraunces display | Knalum/Ecru/Champagne/Sage/Loko |
| **Classic** | everything else | **No** — intentionally polished wedding aesthetics | Cinzel, Playfair, Rochester; light grounds |

Classic presets are *exempt* per memory `feedback_no_fukinsei_in_templates` and
`.impeccable/ignore.md → classic-template-tier`. **Never** flag a Classic preset for
palette, font, symmetry, or radius. The guard enforces this split automatically.

---

## 2. Palette for a Signature preset (11 tokens + accepted tints)

Use only these for `backgroundColor / textColor / borderColor / secondaryColor / slotBgColor`:

```
Knalum Ink    #1A1816    Loko Rust     #8C382A   (sacred — Brass Ring family only)
Piña Ecru     #EAE2D5    Terracotta    #A35C44
Champagne     #C4B59D    Abel Slate    #5A5D5A
Iron Bark     #241E1A    Capiz Sage    #B5B8A3
Hammered Sequin #9C958A (dark grounds only)   Obsidian #111112
ecru-muted #5A564E · ecru-muted-soft #6E6A62  (§VIII safe muted text on ecru)
```

Tonal **tints** of these (within ~20/255 per channel) are accepted Wabi-Sabi variants
— e.g. `#2A2622`, `#211D1A`, `#D8CFBF`, `#E0D7C7`, `#9FA38F`. The guard auto-passes them.
**Never:** legacy oax hex, pure `#000`/`#fff`, raw `#9C958A` as *text on ecru* (WCAG fail).

---

## 3. Typography mandate (drift D1)

Signature **display** font = **Fraunces** (`SOFT 100, WONK 1`) — the carved-wood
temperament. The current catalog ships `'Cormorant Garamond'` / `'Italiana'` on every
Signature family — that is **drift D1** (live-audit 2026-05-31), flagged P1 by the
guard. New Signature presets MUST use Fraunces:

```ts
fontFamily: "'Fraunces', serif",   // ✅ Signature
```

Classic presets keep their period faces (Cinzel/Playfair/Rochester) — correct, exempt.
*(Fixing the 35 existing Signature entries is a separate reviewed pass — documented here,
not done in this task.)*

---

## 4. Voice for `name` + `designerExplanation`

Brand-voiced, material-rooted, no tech terms. Forbidden in user-facing fields:
*luxury, premium, stunning, amazing, unforgettable, journey, vibe, curated,
Instagrammable, once-in-a-lifetime, keepsake* — and the §VIII agentic leak
(*Antigravity, SDK, agentic, automation pipeline, verification algorithm*).

Good (from the live catalog):
> "Unbleached piña-fiber ground with a fine calado openwork divider drawn in champagne
> thread. Iron-bark serif set with quiet restraint."

Root each family in one of the three ancestral parents (Barong Nipis / Inabel-Binakul /
T'nalak) or a canon material (capiz, abacá, loko root, knalum leaf).

---

## 5. Recipe — author a new Signature family

1. **Name + root.** Pick a material/motif (e.g. "Sombrado Shadow", from Barong appliqué).
   `id: "katha-sombrado"`, `name: "Katha Signature — Sombrado"`.
2. **Triad.** Create `strip`, `postcard-vertical` (`layoutId: "pv-2"`), `postcard`
   (`layoutId: "pc-3-v"`). Add L/Γ + N-square landscapes if the motif warrants.
3. **Palette.** Choose ground + frame from §2. One accent token max. Loko only if the
   family *is* the sacred-ring concept.
4. **Type.** `fontFamily: "'Fraunces', serif"`.
5. **Geometry.** Never hand-compute slots — reference a `layoutId` from `lib/layouts.js`.
   Respect the LOCKED SPEC (equal margins, never 1-slot strips).
6. **Decoration.** `decorativeSvg` is drawn into the canvas; keep it tonal, calado/binakul
   rooted, no sharp geometric kitsch.
7. **Explanation.** One brand-voiced sentence (§4).
8. **Guard.** `node scripts/katha-template-guard.mjs` → must be **P0: None**. Resolve any
   new P1 or accept it via `.impeccable/ignore.md` with a reason.

---

## 6. Command map (wired — real `npm run` scripts)

The legacy `oax-impeccable-bridge` is **deleted**. Real `pbakaus/impeccable@2.3.2` is
installed as a devDep and taught the Katha system via [`DESIGN.md`](DESIGN.md) (frontmatter
tokens + 6 canonical sections; verified to parse with impeccable's own `design-parser`).

| Intent | Command | Layer / blocking |
|---|---|---|
| **Full pipeline** | `npm run guard` | all 3 · blocks on P0 only |
| CI fast (skip detect) | `npm run guard:ci` | layers 1–2 · `--p0-only` |
| Template brand drift | `npm run guard:templates` | layer 1 |
| Slot geometry (measurement law) | `npm run guard:layout` | layer 2 |
| UI anti-patterns (impeccable) | `npm run guard:detect` | layer 3 · advisory |
| impeccable agent skills | `/impeccable`, `/audit`, `/critique`, `/document` … | in-harness (24 skills) |

**Three layers, one verdict** (`scripts/katha-guard.mjs`):
1. **Template guard** — palette/font/vocab on Signature presets. **P0** = legacy hex,
   pure b/w, forbidden user-facing copy. P1 = font drift, off-canon tint.
2. **Layout law** — `validate-spec.mjs`, the locked 300-DPI slot spec. **P0** on violation.
3. **impeccable detect** — brand-agnostic UI anti-pattern scanner, contextualised by
   `DESIGN.md`. Always **advisory (P1)**.

`npm run guard` exits **1 only on P0** (layers 1–2); P1 advisories print but never block —
the same CI-vs-executive split the legacy bridge used, now enforcing Katha. CI runs it via
`.github/workflows/katha-brand-guard.yml`. Current baseline: **VERDICT APPROVED** (P0 None;
35 D1 font drifts + 2 impeccable warnings for review).

---

## 7. Report shape (guard output)

```
KATHA TEMPLATE GUARD — lib/templates.ts — <date>
Catalog: N presets · S Signature (held) · C Classic (exempt)
P0 — HARD BLOCK   [list or None]
P1 — DRIFT        [font drift, off-canon hex, copy hygiene]
VERDICT  APPROVED | CONDITIONAL | BLOCKED
```

Current baseline (2026-05-31): **P0 None · 35 D1 font-drift P1 · `Tracy & Prince`
off-canon (review whether it should reclassify to Classic) · VERDICT CONDITIONAL.**
