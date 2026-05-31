// ════════════════════════════════════════════════════════════════════
// LAYOUT REGISTRY — the single source of truth for photo-slot geometry.
//
// Every render path (studio preview, canvas export, client gallery, the
// headless export script) reads slot + text-zone rectangles from HERE.
// No other file computes slot math. To add a new arrangement, add a data
// entry below — never touch render code. This is what makes the template
// engine durable: layouts are DATA, not logic.
//
// Plain .js (not .ts) on purpose so the Node export script (.mjs) and the
// Next.js app (.ts/.tsx) can both import it with zero build step.
//
// COORDINATE SYSTEM
//   All rectangles are in viewBox units. Every format renders at 300 units
//   per inch, so a value of 60 == 0.2 inch on ANY format. That keeps the
//   safe margin physically identical everywhere.
//     strip            600 × 1800   (2"×6")
//     postcard-vertical 1200 × 1800 (4"×6")
//     postcard         1800 × 1200  (6"×4")
//
// THE MENTOR'S SPACING PRINCIPLE (applied to every format)
//   • Outer safe margin: 60u (0.2") — nothing critical closer to the edge.
//   • Inter-slot gap: 20u.
//   • A generous text zone (≈25–31% of the long axis) is a first-class
//     region, never an afterthought. Names/date/venue live inside it.
// ════════════════════════════════════════════════════════════════════

export const SAFE_MARGIN = 60;
export const SLOT_GAP = 20;

export const VIEWBOX = {
  strip: { w: 600, h: 1800 },
  "postcard-vertical": { w: 1200, h: 1800 },
  postcard: { w: 1800, h: 1200 },
};

// Helper to keep entries readable
const R = (x, y, w, h) => ({ x, y, w, h });

// ── LAYOUT DEFINITIONS ────────────────────────────────────────────────
// id        unique key, referenced by preset.layoutId
// label     shown in the studio layout picker
// format    which canvas it belongs to
// slots[]   photo rectangles, in draw order (slot 1, 2, 3…)
// textZone  rectangle where names/date/venue are centered
// note      short description for the picker tooltip
export const LAYOUTS = {
  // ─────────── 2×6 STRIP (600×1800) ───────────
  "strip-3": {
    id: "strip-3", label: "3 Stacked", format: "strip", note: "Classic 3-photo strip (mentor spacing)",
    slots: [R(60, 60, 480, 380), R(60, 460, 480, 380), R(60, 860, 480, 380)],
    textZone: R(60, 1240, 480, 500),
  },
  "strip-4": {
    id: "strip-4", label: "4 Stacked", format: "strip", note: "Four photos, compact text band",
    slots: [R(60, 60, 480, 340), R(60, 420, 480, 340), R(60, 780, 480, 340), R(60, 1140, 480, 340)],
    textZone: R(60, 1500, 480, 240),
  },
  "strip-2": {
    id: "strip-2", label: "2 Tall", format: "strip", note: "Two large photos, editorial text band",
    slots: [R(60, 60, 480, 560), R(60, 640, 480, 560)],
    textZone: R(60, 1240, 480, 500),
  },

  // ─────────── 4×6 VERTICAL POSTCARD (1200×1800) ───────────
  "pv-2": {
    id: "pv-2", label: "2 Stacked", format: "postcard-vertical", note: "Two stacked photos, generous text band",
    slots: [R(60, 60, 1080, 610), R(60, 690, 1080, 610)],
    textZone: R(60, 1320, 1080, 420),
  },
  "pv-3": {
    id: "pv-3", label: "3 Stacked", format: "postcard-vertical", note: "Three stacked photos",
    slots: [R(60, 60, 1080, 413), R(60, 493, 1080, 413), R(60, 926, 1080, 413)],
    textZone: R(60, 1360, 1080, 380),
  },
  "pv-L": {
    id: "pv-L", label: "L-Shape", format: "postcard-vertical", note: "Photos trace an L — open top-right",
    slots: [R(60, 60, 530, 610), R(60, 690, 530, 610), R(610, 690, 530, 610)],
    textZone: R(60, 1320, 1080, 420),
  },
  "pv-invL": {
    id: "pv-invL", label: "Inverted L", format: "postcard-vertical", note: "Photos trace a Γ — open bottom-left",
    slots: [R(60, 60, 530, 610), R(610, 60, 530, 610), R(610, 690, 530, 610)],
    textZone: R(60, 1320, 1080, 420),
  },

  // ─────────── 6×4 LANDSCAPE POSTCARD (1800×1200) ───────────
  "pc-3": {
    id: "pc-3", label: "3 in a Row", format: "postcard", note: "Three photos side by side",
    slots: [R(60, 60, 546, 780), R(626, 60, 546, 780), R(1192, 60, 546, 780)],
    textZone: R(60, 860, 1680, 280),
  },
  "pc-2": {
    id: "pc-2", label: "2 Side by Side", format: "postcard", note: "Two wide photos",
    slots: [R(60, 60, 830, 780), R(910, 60, 830, 780)],
    textZone: R(60, 860, 1680, 280),
  },
  "pc-L": {
    id: "pc-L", label: "L-Shape", format: "postcard", note: "Photos trace an L — open top-right",
    slots: [R(60, 60, 830, 380), R(60, 460, 830, 380), R(910, 460, 830, 380)],
    textZone: R(60, 860, 1680, 280),
  },
  "pc-invL": {
    id: "pc-invL", label: "Inverted L", format: "postcard", note: "Photos trace a Γ — open bottom-left",
    slots: [R(60, 60, 830, 380), R(910, 60, 830, 380), R(910, 460, 830, 380)],
    textZone: R(60, 860, 1680, 280),
  },
};

// ── DEFAULTS + LOOKUPS ────────────────────────────────────────────────
export const DEFAULT_LAYOUT = {
  strip: "strip-3",
  "postcard-vertical": "pv-2",
  postcard: "pc-3",
};

export function getLayout(id) {
  return LAYOUTS[id] || null;
}

export function layoutsForFormat(format) {
  return Object.values(LAYOUTS).filter((l) => l.format === format);
}

export function defaultLayoutFor(format) {
  return LAYOUTS[DEFAULT_LAYOUT[format]] || LAYOUTS["strip-3"];
}

// Resolve a (preset.layoutId, format) pair to a concrete layout, with
// graceful fallback if the layoutId doesn't match the active format.
export function resolveLayout(layoutId, format) {
  const l = layoutId && LAYOUTS[layoutId];
  if (l && l.format === format) return l;
  return defaultLayoutFor(format);
}
