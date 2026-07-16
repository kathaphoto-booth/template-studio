// GildedArchive_Templates — audited Gilded Archive catalog (SINGLE SOURCE OF TRUTH).
// Isolated 2026-07-08: purged all legacy "studio aesthetic" presets. Retains ONLY
// the Brutalist-Dark Gilded Archive family — Knalum Night (soil-black obsidian
// ground, raw-fiber ecru ink, gilt rule). No red anywhere: the retired rust
// accent is superseded by gilt (#D4AF37).
//
// PRESETS + renderDecorativeSvg drive both preview and canvas/gallery export.
// Edit decoration HERE only. Shared slot geometry still lives in lib/layouts.js.

import { LAYOUTS, SAFE_MARGIN, SLOT_GAP, VIEWBOX, getLayout, layoutsForFormat, defaultLayoutFor, resolveLayout, getModifiedLayout, FORMAT_MARGIN } from "@/lib/layouts";
export { LAYOUTS, SAFE_MARGIN, SLOT_GAP, VIEWBOX, getLayout, layoutsForFormat, defaultLayoutFor, resolveLayout, getModifiedLayout };

// Types
export interface PhotoboothPreset {
  id: string;
  name: string;
  type: "strip" | "postcard" | "postcard-vertical";
  // OPTIONAL — references a layout in lib/layouts.js. If omitted, the default
  // layout for `type` is used. This makes every preset render with declarative
  // slot geometry rather than hand-computed math.
  layoutId?: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  secondaryColor: string;
  fontFamily: string;
  titleText: string;
  subTitleText: string;
  dateText: string;
  slotBorderRadius: string;
  slotBorderWidth: string;
  slotGap: string;
  slotBgColor: string;
  innerSpacing: string;
  decorativeSvg: string;
  designerExplanation: string;
}

// ─── GILDED ARCHIVE — KNALUM NIGHT (the only retained aesthetic family) ────────
export const PRESETS: PhotoboothPreset[] = [
  {
    id: "katha-knalum-night",
    name: "Katha Signature — Knalum Night",
    type: "strip",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#241E1A",
    secondaryColor: "#C4B59D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#241E1A",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black ground from the seven-day knalum boil. Raw-fiber ecru lettering with a single gilt rule — the dreamweaver's tri-color."
  },
  {
    id: "katha-knalum-night-postcard",
    name: "Katha Signature — Knalum Night Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#241E1A",
    secondaryColor: "#C4B59D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#241E1A",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black ground with raw-fiber ecru lettering and a single gilt accent. 4×6 postcard variant."
  },
  {
    id: "katha-knalum-night-landscape",
    name: "Katha Signature — Knalum Night Landscape",
    type: "postcard",
    layoutId: "pc-3-v",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#241E1A",
    secondaryColor: "#C4B59D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "18px",
    slotBgColor: "#241E1A",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black ground with raw-fiber ecru lettering and a single gilt accent. Landscape postcard variant."
  },
  {
    id: "katha-knalum-night-landscape-2sq",
    name: "Katha Signature — Knalum Night Landscape 2 Squares",
    type: "postcard",
    layoutId: "pc-2-sq",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#241E1A",
    secondaryColor: "#C4B59D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "18px",
    slotBgColor: "#241E1A",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black — two square photos, ecru lettering with gilt accent."
  },
  {
    id: "katha-knalum-night-landscape-3sq",
    name: "Katha Signature — Knalum Night Landscape 3 Squares",
    type: "postcard",
    layoutId: "pc-3-sq",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#241E1A",
    secondaryColor: "#C4B59D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "18px",
    slotBgColor: "#241E1A",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black — three square photos in a row, raw-fiber ecru lettering."
  },
];

// ─── DECORATION ALIASES ───────────────────────────────────────────────
// Maps format variants back to the root family ID so we write drawing rules ONCE.
const DECORATION_ALIASES: Record<string, string> = {
  "katha-knalum-night-postcard":        "katha-knalum-night",
  "katha-knalum-night-landscape":       "katha-knalum-night",
  "katha-knalum-night-landscape-1sq":   "katha-knalum-night",
  "katha-knalum-night-landscape-2sq":   "katha-knalum-night",
  "katha-knalum-night-landscape-3sq":   "katha-knalum-night",
};

export const LUXURY_FONTS = [
  { id: "cinzel", name: "Cinzel (Royal Roman)", css: "'Cinzel', serif" },
  { id: "playfair", name: "Playfair Display (Elegant Serif)", css: "'Playfair Display', serif" },
  { id: "bodoni", name: "Bodoni Moda (High Fashion Serif)", css: "'Bodoni Moda', serif" },
  { id: "hanken-grotesk", name: "Hanken Grotesk (Clean Neo-Grotesque)", css: "'Hanken Grotesk', sans-serif" },
  { id: "italiana", name: "Italiana (Geometric Roman)", css: "'Italiana', serif" },
  { id: "aboreto", name: "Aboreto (Wire-Thin Modern Capital)", css: "'Aboreto', sans-serif" },
  { id: "greatvibes", name: "Great Vibes (Soft Cursive Harmony)", css: "'Great Vibes', cursive" },
  { id: "alexbrush", name: "Alex Brush (Stately Royal Calligraphy)", css: "'Alex Brush', cursive" },
  { id: "pinyon", name: "Pinyon Script (Traditional Sloped Signature)", css: "'Pinyon Script', cursive" },
  { id: "sacramento", name: "Sacramento (Graceful Midcentury Pen)", css: "'Sacramento', cursive" },
  { id: "rochester", name: "Rochester (Antique Signage Script)", css: "'Rochester', cursive" },
  { id: "parisienne", name: "Parisienne (Flowing Parisian Romance)", css: "'Parisienne', cursive" },
  { id: "labelle", name: "La Belle Aurore (Casual Handwriting ink)", css: "'La Belle Aurore', cursive" },
  { id: "montserrat", name: "Montserrat (Clean Modernist Sans)", css: "'Montserrat', sans-serif" }
];

export const HARMONY_PALETTES = [
  {
    id: "royal-emerald",
    name: "Royal Emerald",
    bg: "#1E2B22",
    text: "#FAF6F0",
    secondary: "#DFCE83",
    border: "#6E7F71",
    slotBg: "#161F19",
  },
  {
    id: "midnight-onyx",
    name: "Midnight Onyx",
    bg: "#111111",
    text: "#FFFFFF",
    secondary: "#766023",
    border: "#333333",
    slotBg: "#1A1A1A",
  },
];

// ─── SLOT-COUNT-AGNOSTIC SVG DECORATION ENGINE ─────────────────────────────────
export function renderDecorativeSvg(
  presetId: string,
  type: "strip" | "postcard" | "postcard-vertical",
  color: string,
  secondaryColor: string,
  borderColor: string,
  textPosition: "bottom" | "top" = "bottom"
) {
  // Resolve format variants back to their root design family ID
  let baseId = presetId;
  if (DECORATION_ALIASES[presetId]) {
    baseId = DECORATION_ALIASES[presetId];
  } else {
    baseId = presetId.replace("-postcard", "").replace("-landscape", "").replace("-L", "").replace("-invL", "");
  }

  // Find preset and dynamic layout boundaries
  const preset = PRESETS.find(p => p.id === presetId) || PRESETS.find(p => p.id === baseId) || PRESETS[0];
  const rawLayout = resolveLayout(preset.layoutId, type);
  const layout = getModifiedLayout(rawLayout, textPosition);
  const vb = VIEWBOX[type];
  const margin = FORMAT_MARGIN[type];

  // Dynamically calculate the textZone ("branding pedestal") bounds
  const tz = {
    x: layout.textZone.x,
    y: layout.textZone.y,
    w: layout.textZone.w,
    h: layout.textZone.h,
    centerX: layout.textZone.x + layout.textZone.w / 2,
    centerY: layout.textZone.y + layout.textZone.h / 2
  };

  // Render SVG elements anchored ONLY to the canvas edges (relative to margin) or to the dynamic tz pedestal boundaries.
  switch (baseId) {
    case "katha-knalum-night":
      return `
        <!-- Soil-black T'nalak raw linen rules -->
        <rect x="${margin / 2}" y="${margin / 2}" width="${vb.w - margin}" height="${vb.h - margin}" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.8" />
        <!-- A single gilt horizontal thread above/below the text pedestal -->
        <line x1="${vb.w / 2 - 90}" y1="${textPosition === 'bottom' ? tz.y - 18 : tz.y + tz.h + 18}" x2="${vb.w / 2 + 90}" y2="${textPosition === 'bottom' ? tz.y - 18 : tz.y + tz.h + 18}" stroke="#D4AF37" stroke-width="2.5" />
      `;

    default:
      return `
        <rect x="${margin / 2}" y="${margin / 2}" width="${vb.w - margin}" height="${vb.h - margin}" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.4" />
      `;
  }
}
