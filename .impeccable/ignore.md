# Katha — Designer-Intended Deviations

Patterns the template guard (and any impeccable-style detector) must **not** re-raise.
These are deliberate Katha decisions, not drift. Do not remove an entry without
Jed's approval. Replaces the legacy OAX `ignore.md` entirely — none of the OAX
entries (obsidian dark-surface, italic-serif-hero, etc.) apply to Katha.

---

## classic-template-tier
The catalog is **two-tier**. ~50 *Classic* presets (Cinzel, Playfair, Rochester,
Parisienne; lighter grounds like `#FAF6F0`, `#FCFCFC`) are intentionally polished,
symmetric wedding aesthetics. **They are NOT bound to Katha brand chrome.** The
Wabi-Sabi / Fukinsei / deckled-edge rules apply ONLY to Katha brand surfaces and to
the *Katha Signature* preset tier — never to Classic wedding templates.
*Source: memory `feedback_no_fukinsei_in_templates`.* Do not flag Classic presets
for palette, font, symmetry, or border-radius.

## polished-template-photo-frames
Photo-slot frames inside ANY template (Signature or Classic) stay crisp and even.
The deckled, hand-torn edge is a property of Katha **brand chrome** (gallery frames,
section dividers, marks) — not of the printed keepsake's photo wells. Do not suggest
deckle masks on `slotBorderRadius` / slot geometry.

## signature-tonal-tints
Katha Signature presets use tonal variants of canon tokens — a darker iron-bark
(`#2A2622`), a deeper knalum slot (`#211D1A`), a champagne tint (`#D8CFBF`), sage
tints (`#9FA38F`, `#6E7268`, `#E4DCCE`). These are accepted Wabi-Sabi tints within
tolerance of a canon token. Do not flag as off-palette. (The guard auto-accepts any
hex within 20/255 per-channel of a DESIGN_SYSTEM.v2.md token.)

## symmetric-print-layout
Photo-strip and postcard layouts obey the LOCKED MEASUREMENT SPEC in `lib/layouts.js`
(physically equal margins, even slot grids at 300 DPI). Print symmetry is a
manufacturing requirement, not a brand violation. Fukinsei asymmetry lives in the
*digital brand chrome*, never in the printed grid.

## brass-ring-loko-in-signature
The Brass Ring Signature family uses Loko Rust (`#8C382A`) as its `borderColor` /
`secondaryColor` — the single sacred ring motif. This is the one sanctioned use of
Loko outside a `<KCta variant="sacred">`, because the ring *is* the sacred mark.
Do not flag Loko in the Brass Ring family as CTA-dilution.

## fraunces-display-font
Fraunces is the locked display font for Katha Signature presets and brand chrome. Do not flag Fraunces as an 'overused-font' anti-pattern.

---

## NOT exempt — still hard blocks (for reference)
- Legacy oax hex `#0a0806` / `#bf9d2c` / `#c4c1b8` anywhere.
- Pure `#000` / `#fff` (always tonal).
- Forbidden vocab in user-facing fields (name, titleText, subTitleText, dateText,
  designerExplanation).
- Cormorant/Italiana as a *Signature* display font → drift D1 (P1 review, see guide).
