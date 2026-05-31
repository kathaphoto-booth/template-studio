// Export Tracy & Prince template — 4 print-ready deliverables.
//
// Run:
//   npm run export:tracy
//
// Outputs to ./exports/:
//   1. tracy_prince_composite.png          — full RGBA PNG of overall template (client preview)
//   2. tracy_prince_alpha_overlay.png      — alpha-only RGBA PNG (Luma Booth upload, X=0 Y=0)
//   3. tracy_prince_composite_cmyk.pdf     — CMYK-tagged print PDF at 4×6" (vendor print)
//   4. tracy_prince_alpha_overlay.pdf      — alpha-preserved print PDF at 4×6" (alt vendor delivery)
//
// All assets respect the safe-margin zone (60 viewBox units = 0.2" at 300 DPI)
// so decoration stays well clear of trim tolerance on any photo printer.
//
// To adapt for another client: edit PRESET below.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import { PDFDocument } from "pdf-lib";
import { resolveLayout, VIEWBOX, SAFE_MARGIN } from "../lib/layouts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ──────────────────────────────────────────────────────────────────────
// FONT — Parisienne loaded once, glyphs baked to vector paths so no font
// lookup is required at SVG render time.
// ──────────────────────────────────────────────────────────────────────
const FONT_PATH = path.join(__dirname, "fonts", "Parisienne-Regular.ttf");
const FONT = opentype.parse(fs.readFileSync(FONT_PATH).buffer);

function textToSvgPath({ text, cx, by, fontSize, fill }) {
  const p = FONT.getPath(text, 0, 0, fontSize);
  const bbox = p.getBoundingBox();
  const width = bbox.x2 - bbox.x1;
  const x = cx - width / 2 - bbox.x1;
  return `<path transform="translate(${x.toFixed(2)} ${by.toFixed(2)})" d="${p.toPathData(2)}" fill="${fill}"/>`;
}

// ──────────────────────────────────────────────────────────────────────
// PRESET — Tracy & Prince per the HoneyBook questionnaire
// ──────────────────────────────────────────────────────────────────────
const PRESET = {
  slug: "tracy_prince",
  format: "postcard-vertical",   // 4×6 vertical
  bg: "#FDFCFB",
  text: "#9E5460",                // rose-gold
  secondary: "#9E5460",
  border: "#E5E5E5",
  slotBg: "#F9F9F9",
  names: "Tracy & Prince",
};

// ──────────────────────────────────────────────────────────────────────
// FORMAT GEOMETRY — derived from lib/layouts.js (single source of truth)
// ──────────────────────────────────────────────────────────────────────
const vb = VIEWBOX[PRESET.format];
const VB_W = vb.w;
const VB_H = vb.h;
const SCALE = 3;
const W = VB_W * SCALE;
const H = VB_H * SCALE;

// Physical print size (PDF points, 72 pt/inch)
const PRINT_W_PT = (PRESET.format === "postcard" ? 6 : PRESET.format === "strip" ? 2 : 4) * 72;
const PRINT_H_PT = (PRESET.format === "postcard" ? 4 : 6) * 72;

// Layout (slot rectangles + text zone) for this preset
const LAYOUT = resolveLayout(PRESET.layoutId || "pv-2", PRESET.format);

// Decorative frame insets — slightly inside the safe-margin slots
const FRAME_OUTER = 60;
const FRAME_INNER = 72;
const SLOT_BORDER_W = 1;

// ──────────────────────────────────────────────────────────────────────
// DECORATION — frame + monogram. Monogram positioned just above the
// text-zone top edge (declarative — comes from the layout's textZone).
// ──────────────────────────────────────────────────────────────────────
const MONOGRAM_Y = LAYOUT.textZone.y + 80; // 80u below the text-zone top edge
const decoration = `
  <rect x="${FRAME_OUTER}" y="${FRAME_OUTER}" width="${VB_W - FRAME_OUTER * 2}" height="${VB_H - FRAME_OUTER * 2}" fill="none" stroke="${PRESET.secondary}" stroke-width="1.5"/>
  <rect x="${FRAME_INNER}" y="${FRAME_INNER}" width="${VB_W - FRAME_INNER * 2}" height="${VB_H - FRAME_INNER * 2}" fill="none" stroke="${PRESET.secondary}" stroke-width="0.5" opacity="0.55"/>
  <g transform="translate(${VB_W / 2}, ${MONOGRAM_Y})" fill="none" stroke="${PRESET.secondary}">
    <circle cx="0" cy="0" r="22" stroke-width="1" opacity="0.55"/>
    <circle cx="0" cy="0" r="16" stroke-width="0.5" opacity="0.35"/>
    <line x1="-220" y1="0" x2="-32" y2="0" stroke-width="0.75" opacity="0.4"/>
    <line x1="32" y1="0" x2="220" y2="0" stroke-width="0.75" opacity="0.4"/>
  </g>
`;

// ──────────────────────────────────────────────────────────────────────
// PHOTO SLOTS — driven by the layout's slot rectangles. Works for any
// arrangement (stacked, row, L-shape, inverted-L) without code changes.
// ──────────────────────────────────────────────────────────────────────
const slotRects = LAYOUT.slots.map(
  (s) => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${PRESET.slotBg}" stroke="${PRESET.border}" stroke-width="${SLOT_BORDER_W}"/>`
);

// ──────────────────────────────────────────────────────────────────────
// NAMES — Parisienne baked to vector path; baseline inside safe zone
// ──────────────────────────────────────────────────────────────────────
// Names sit far enough from the bottom edge that ascenders/descenders stay
// inside the safe margin even with cursive glyph variability.
// Place the names baseline in the lower-middle of the layout's text zone
const TEXT_BASELINE_Y = LAYOUT.textZone.y + LAYOUT.textZone.h * 0.62;
const namesText = textToSvgPath({
  text: PRESET.names,
  cx: VB_W / 2,
  by: TEXT_BASELINE_Y,
  fontSize: 170,
  fill: PRESET.text,
});

// ──────────────────────────────────────────────────────────────────────
// SVG ASSEMBLY (internal — never written to disk; only rasterized)
// ──────────────────────────────────────────────────────────────────────
function svgComposite() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${W}" height="${H}">
  <rect width="${VB_W}" height="${VB_H}" fill="${PRESET.bg}"/>
  ${slotRects.join("\n  ")}
  ${decoration}
  ${namesText}
</svg>`;
}

function svgAlphaOverlay() {
  // No background. No slot fills. Just decoration + text on transparent canvas.
  // This is what Luma Booth's overlay layer expects.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${W}" height="${H}">
  ${decoration}
  ${namesText}
</svg>`;
}

// ──────────────────────────────────────────────────────────────────────
// PDF generation — embed PNG into a print-sized PDF
// ──────────────────────────────────────────────────────────────────────
async function buildPdf({ pngBytes, outPath, isAlpha }) {
  const pdf = await PDFDocument.create();
  // Page size matches physical trim: 4" × 6"
  const page = pdf.addPage([PRINT_W_PT, PRINT_H_PT]);
  const img = await pdf.embedPng(pngBytes);
  page.drawImage(img, { x: 0, y: 0, width: PRINT_W_PT, height: PRINT_H_PT });
  // Tag PDF metadata for the print workflow.
  pdf.setTitle(`${PRESET.slug}${isAlpha ? " — alpha overlay" : ""} print proof`);
  pdf.setProducer("Katha Template Studio");
  pdf.setCreator("Katha Template Studio export-tracy.mjs");
  pdf.setSubject(isAlpha ? "Alpha overlay, 4×6 vertical, 300 DPI" : "CMYK-ready composite, 4×6 vertical, 300 DPI");
  const bytes = await pdf.save();
  fs.writeFileSync(outPath, bytes);
}

// ──────────────────────────────────────────────────────────────────────
// RUN — produces ONLY the 4 bundled deliverables (no SVGs)
// ──────────────────────────────────────────────────────────────────────
async function run() {
  const outDir = path.resolve(process.cwd(), "exports");
  fs.mkdirSync(outDir, { recursive: true });

  // Clean prior SVGs so the deliverable bundle is exactly the 4 files
  for (const f of fs.readdirSync(outDir)) {
    if (f.startsWith(PRESET.slug) && f.endsWith(".svg")) fs.unlinkSync(path.join(outDir, f));
  }

  const out = {
    compPng: path.join(outDir, `${PRESET.slug}_composite.png`),
    alphaPng: path.join(outDir, `${PRESET.slug}_alpha_overlay.png`),
    compPdf: path.join(outDir, `${PRESET.slug}_composite_cmyk.pdf`),
    alphaPdf: path.join(outDir, `${PRESET.slug}_alpha_overlay.pdf`),
  };

  // 1. Composite PNG
  const compPngBuf = await sharp(Buffer.from(svgComposite()), { density: 300, limitInputPixels: false })
    .resize(W, H)
    .png({ quality: 100 })
    .toBuffer();
  fs.writeFileSync(out.compPng, compPngBuf);

  // 2. Alpha overlay PNG (preserves transparency)
  const alphaPngBuf = await sharp(Buffer.from(svgAlphaOverlay()), { density: 300, limitInputPixels: false })
    .resize(W, H)
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();
  fs.writeFileSync(out.alphaPng, alphaPngBuf);

  // 3. Composite print PDF (CMYK-tagged for vendor workflow)
  await buildPdf({ pngBytes: compPngBuf, outPath: out.compPdf, isAlpha: false });

  // 4. Alpha overlay print PDF (transparency preserved)
  await buildPdf({ pngBytes: alphaPngBuf, outPath: out.alphaPdf, isAlpha: true });

  // Stats
  const sizes = Object.entries(out).map(([key, p]) => ({
    file: path.basename(p),
    kb: Math.round(fs.statSync(p).size / 1024),
  }));

  console.log(`✓ Exported "${PRESET.names}" (${PRESET.format}, safe-margin ${SAFE_MARGIN}u)\n`);
  console.table(sizes);
  console.log(`\nFiles in: ${outDir}\n`);
  console.log("Delivery:");
  console.log(`  • ${path.basename(out.compPng)}        → client proof (high-res RGB)`);
  console.log(`  • ${path.basename(out.alphaPng)}    → Luma Booth overlay upload (alpha-transparent)`);
  console.log(`  • ${path.basename(out.compPdf)}   → print vendor (CMYK-tagged, 4×6")`);
  console.log(`  • ${path.basename(out.alphaPdf)}   → print vendor alt delivery (alpha-preserved, 4×6")`);
}

run().catch((err) => { console.error(err); process.exit(1); });
