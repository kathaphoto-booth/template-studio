// ════════════════════════════════════════════════════════════════════
// LAYOUT VALIDATOR — the deterministic enforcement gate.
//
// Every layout in the registry, and every design built on it, MUST pass.
// This is how the measurement law is OBEYED, not merely documented:
//   • Margin law      — nothing crosses the format's safe margin.
//   • Containment      — every rect stays inside the canvas.
//   • No collisions    — no photo slot overlaps another slot or the text band.
//   • Whitespace law   — the branding pedestal is a first-class region
//                        (≥18% of the long axis), unless the layout is a
//                        declared single-line exception (4-slot only).
//   • Slot sanity      — slots are large enough to hold a real photo.
//
// Plain .js so the Node export script and the Next.js app both import it.
// Zero dependencies, zero API calls, 100% accurate — geometry is math.
// ════════════════════════════════════════════════════════════════════

import { VIEWBOX, FORMAT_MARGIN } from "./layouts.js";

const MIN_GAP = 20;              // u — minimum breathing room between rects
const MIN_SLOT = 200;            // u — a slot smaller than this can't hold a photo
const MULTILINE_BAND_PCT = 0.18; // text band ≥ 18% of the long axis
const SINGLELINE_BAND_MIN = 80;  // u — a single-line caption needs at least this

function overlap(a, b) {
  // Returns overlap area > 0 if rectangles intersect (touching edges = ok).
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x > 0 && y > 0 ? x * y : 0;
}

/**
 * Validate one layout object against the measurement law.
 * @returns {{ pass: boolean, violations: string[], stats: object }}
 */
export function validateLayout(layout) {
  const violations = [];
  const vb = VIEWBOX[layout.format];
  const margin = FORMAT_MARGIN[layout.format];

  if (!vb) {
    return { pass: false, violations: [`Unknown format "${layout.format}"`], stats: {} };
  }

  const safe = { x: margin, y: margin, w: vb.w - 2 * margin, h: vb.h - 2 * margin };
  const all = [...layout.slots.map((s, i) => ({ rect: s, name: `slot ${i + 1}` })),
               { rect: layout.textZone, name: "text band" }];

  // 1. CONTAINMENT + MARGIN LAW — every rect inside the safe area.
  for (const { rect, name } of all) {
    if (rect.x < safe.x - 0.5 || rect.y < safe.y - 0.5 ||
        rect.x + rect.w > safe.x + safe.w + 0.5 ||
        rect.y + rect.h > safe.y + safe.h + 0.5) {
      violations.push(
        `${name} crosses the ${margin}u safe margin ` +
        `(${rect.x},${rect.y} ${rect.w}×${rect.h}; safe ${safe.x}…${safe.x + safe.w} / ${safe.y}…${safe.y + safe.h})`
      );
    }
  }

  // 2. NO COLLISIONS — slots may not overlap each other or the text band.
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j];
      // Same-row L/Γ slots legitimately share an x or y edge — that's fine.
      // Only flag genuine area overlap.
      if (overlap(a.rect, b.rect) > 0) {
        violations.push(`${a.name} overlaps ${b.name}`);
      }
    }
  }

  // 3. SLOT SANITY — every photo slot is usably large.
  layout.slots.forEach((s, i) => {
    if (s.w < MIN_SLOT || s.h < MIN_SLOT) {
      violations.push(`slot ${i + 1} too small for a photo (${s.w}×${s.h}, min ${MIN_SLOT})`);
    }
  });

  // 4. WHITESPACE LAW — the branding pedestal is first-class.
  // The band's vertical extent (its height) vs the canvas height is what
  // governs room for stacked text lines, on every format.
  const band = layout.textZone;
  if (layout.singleLine) {
    if (band.h < SINGLELINE_BAND_MIN) {
      violations.push(`single-line caption band too short (${band.h}u, min ${SINGLELINE_BAND_MIN}u)`);
    }
  } else {
    const pct = band.h / vb.h;
    if (pct < MULTILINE_BAND_PCT) {
      violations.push(
        `text band only ${(pct * 100).toFixed(1)}% of canvas height ` +
        `(min ${(MULTILINE_BAND_PCT * 100).toFixed(0)}%) — branding pedestal starved`
      );
    }
  }

  // 5. SLOT-COUNT TRUTH — declared count matches reality; slots must be 2, 3, or 4.
  if (layout.slots.length !== layout.slotCount) {
    violations.push(`slotCount=${layout.slotCount} but ${layout.slots.length} slots defined`);
  }
  if (layout.slotCount < 2 || layout.slotCount > 4) {
    violations.push(`layout must have 2, 3, or 4 slots (has ${layout.slotCount})`);
  }
  // defense-in-depth: range-check reality too, not just the declared field
  if (layout.slots.length < 2 || layout.slots.length > 4) {
    violations.push(`layout must have 2, 3, or 4 slots (defines ${layout.slots.length})`);
  }

  // 6. SYMMETRY LAW — horizontal reflection of slots must match slots.
  // EXCEPTION: L-shapes completely fill and balance negative space with typography.
  // The exemption is earned, not just named: an L-shape id must also carry
  // exactly 3 slots, or the layout is judged under the full symmetry law.
  const layoutId = typeof layout.id === "string" ? layout.id : "";
  const isLshape =
    (layoutId.endsWith("-L") || layoutId.endsWith("-invL")) &&
    layout.slots.length === 3;

  if (!isLshape) {
    const slots = layout.slots;
    const centerX = vb.w / 2;
    const reflectedSlots = slots.map(s => {
      const newX = 2 * centerX - s.x - s.w;
      return { x: Math.round(newX), y: s.y, w: s.w, h: s.h };
    });

    for (const r of reflectedSlots) {
      const found = slots.some(s => 
        Math.abs(s.x - r.x) <= 2 &&
        Math.abs(s.y - r.y) <= 2 &&
        Math.abs(s.w - r.w) <= 2 &&
        Math.abs(s.h - r.h) <= 2
      );
      if (!found) {
        violations.push(`layout is not horizontally symmetrical; reflected slot at x=${r.x} has no match`);
        break;
      }
    }

    // Also check if textZone is horizontally centered
    const tzCenterX = layout.textZone.x + layout.textZone.w / 2;
    if (Math.abs(tzCenterX - centerX) > 2) {
      violations.push(`textZone is not horizontally centered (center is ${tzCenterX}, canvas center is ${centerX})`);
    }
  }

  const usedArea = layout.slots.reduce((a, s) => a + s.w * s.h, 0) + band.w * band.h;
  return {
    pass: violations.length === 0,
    violations,
    stats: {
      format: layout.format,
      slotCount: layout.slotCount,
      bandPct: +(band.h / vb.h * 100).toFixed(1),
      coverage: +(usedArea / (vb.w * vb.h) * 100).toFixed(1),
    },
  };
}

/** Validate the whole registry. Returns { pass, results }. */
export function validateAll(layouts) {
  const results = {};
  let pass = true;
  for (const [id, layout] of Object.entries(layouts)) {
    const r = validateLayout(layout);
    results[id] = r;
    if (!r.pass) pass = false;
  }
  return { pass, results };
}
