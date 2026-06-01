---
name: katha-impeccable
description: >-
  Activate pbakaus/impeccable for the Katha Photo Booth brand. This is the
  Katha-correct replacement for the deleted oax-impeccable-bridge — it loads
  Katha brand context first and routes impeccable through the unified guard so
  the forbidden legacy OAX tokens, Cormorant, and Jacobean arc can never creep
  back. Use this whenever the user wants to run impeccable, audit or guard the
  Katha design system, check templates for brand drift, validate the photobooth
  template catalog, run "brand guard" / "detect" / "npm run guard", review
  Signature vs Classic presets, or before any commit or PR that touches
  templates.ts, the gemini_draft shell components, DESIGN.md, or the Squarespace
  injection layer. Trigger even when the user just says "impeccable", "audit the
  templates", "is this on brand", or "check brand compliance" without naming the
  guard explicitly. Do NOT use the legacy oax-impeccable-bridge on this repo.
---

# Katha × Impeccable

`pbakaus/impeccable` is a brand-agnostic design anti-pattern detector. This skill
wraps it in the locked Katha brand so its generic heuristics never fight Katha's
intentional decisions — and never re-introduce the legacy OAX brand that CLAUDE.md
forbids. Run from the `photobooth-template-studio` directory.

## 1. Load Katha context first (always)

Before running any check or proposing any design change, read the brand truth so
your judgement is Katha's, not impeccable's defaults:

1. `DESIGN.md` — the machine-readable teach artifact impeccable consumes (11 tokens,
   Fraunces display, 6 canonical sections). This is what makes `detect` Katha-aware.
2. `DESIGN_SYSTEM.v2.md` (repo root) — the full token + primitive system.
3. `.impeccable/ignore.md` — designer-intended deviations impeccable must NOT re-raise.
4. `KATHA_TEMPLATE_GUIDE.md` — the PhotoboothPreset schema + how to author a family.

If `DESIGN.md` is missing, the brand context is gone — recreate it from
`DESIGN_SYSTEM.v2.md` before scanning, or every `detect` result will be generic.

## 2. The two-tier model (the rule that prevents false flags)

The template catalog in `lib/templates.ts` is two tiers. Apply Katha brand rules to
**Signature** only; **Classic** is intentionally exempt. Misapplying brand rules to
Classic presets is the single most common mistake — it floods the report with noise.

| Tier | Identify by | Held to Katha? |
|---|---|---|
| Katha Signature | `id` starts `katha-` / name has "Katha Signature —" | Yes — 11-token palette + Fraunces |
| Classic | everything else | No — polished wedding aesthetics (Cinzel/Playfair/Rochester), exempt |

Why: per the brand owner, Wabi-Sabi/Fukinsei is Katha *brand chrome*, not a
constraint on the polished printed keepsakes customers actually buy.

## 3. Run the unified guard, don't hand-roll checks

One command runs everything — prefer it over ad-hoc greps:

```bash
npm run guard          # template guard + layout law + impeccable detect → one verdict
npm run guard:ci       # P0-only fast path (what CI blocks on)
npm run guard:templates  # palette/font/vocab on Signature presets only
npm run guard:layout     # locked 300-DPI slot geometry
npm run guard:detect     # impeccable detect (DESIGN.md-aware) as raw JSON
```

`scripts/katha-guard.mjs` is the orchestrator. It is the Katha replacement for the
OAX bridge's `/oax-audit` + `/oax-validate`. **P0** (legacy hex, pure `#000`/`#fff`,
forbidden user-facing vocab, slot-geometry violations) blocks. **P1** (font drift,
off-canon tint, impeccable UI warnings) is executive review, never a CI block.

For design *improvement* requests (polish, critique, typeset, colorize…), impeccable's
24 agent skills are installed under `.claude/skills/impeccable` — invoke `/impeccable`,
`/critique`, `/audit`, `/document`, etc., but always filter their output through §2 and §4.

## 4. Hard guardrails — never reintroduce the OAX brand

These are hard blocks. If impeccable (or any heuristic) suggests one, refuse and cite
this section:

- **Legacy OAX hex** — `#0a0806` (obsidian), `#bf9d2c` (gold), `#c4c1b8` (vellum). Forbidden.
- **Cormorant Garamond / Italiana as a Signature display face** — drift D1. Signature
  display is **Fraunces** (`SOFT 100, WONK 1`). (Classic presets keep period faces.)
- **Jacobean arc** or any legacy OAX theme/template.
- **Pure `#000` / `#fff`** — always tonal.
- **Hammered Sequin (`#9C958A`) as text on Piña Ecru** — fails WCAG AA; use `#5A564E`/`#6E6A62`.
- **Loko Rust (`#8C382A`) outside the sacred CTA** — except the Brass Ring Signature family,
  where the ring *is* the sacred mark (see `.impeccable/ignore.md`).
- **Forbidden user-facing vocab** — luxury, premium, stunning, curated, keepsake, and the
  agentic leak (Antigravity, SDK, agentic, automation pipeline). Comments are exempt.

## 5. Report format

After a guard run, report in this shape so the brand owner can sign off fast:

```
KATHA IMPECCABLE — <target> — <date>
CONTEXT     DESIGN.md ✓ · ignore.md ✓ · tier split: <S> Signature / <C> Classic
P0 BLOCK    <list, or None>
P1 DRIFT    <font drift count · off-canon · impeccable warnings>
VERDICT     APPROVED | CONDITIONAL | BLOCKED
NEXT        <one sentence>
```

Always state the Signature/Classic split so it's clear which presets were held and which
were correctly exempt — that transparency is what keeps the guard trusted.
