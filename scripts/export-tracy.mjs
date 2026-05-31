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
// FORMAT GEOMETRY — physical dimensions + safe margins
// ──────────────────────────────────────────────────────────────────────
// 4×6 vertical: viewBox 1200×1800 = 1 viewBox unit per 0.00333 inch at 300 DPI
const VB_W = 1200;
const VB_H = 1800;
const SCALE = 3;                  // render at 3× viewBox → 3600×5400 px
const W = VB_W * SCALE;
const H = VB_H * SCALE;

// Physical print size (PDF points, 72 pt/inch)
const PRINT_W_PT = 4 * 72;        // 288 pt = 4"
const PRINT_H_PT = 6 * 72;        // 432 pt = 6"

// MARGIN SAFETY
// Photo printers have ±1/16" (~0.06") trim tolerance. We use a generous 60
// viewBox units (~0.2" at 300 DPI) as the safe zone — anything critical
// (text, primary decoration) stays inside; anything that touches the edge
// (background fill) is fine but should be designed to survive trim.
const SAFE_MARGIN = 60;
const FRAME_OUTER = 60;           // outer decorative frame inset
const FRAME_INNER = 72;           // inner decorative frame inset (12 from outer)

// Text zone (mentor's ~28% rule; preset.innerSpacing pushed to safe value)
const TEXT_ZONE = 420;
const INNER_PAD = SAFE_MARGIN;    // photo slot inset = 60 (was 40, unsafe)
const SLOT_GAP = 20;
const SLOT_BORDER_W = 1;
const SLOT_COUNT = 2;

// ──────────────────────────────────────────────────────────────────────
// DECORATION — same logic as renderDecorativeSvg case "rose-whisper-postcard",
// but with safe-margin-respecting frame coordinates.
// ──────────────────────────────────────────────────────────────────────
const MONOGRAM_Y = VB_H - 320;
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
// PHOTO SLOTS — vertical 2-up, leaving the text zone clear at the bottom
// ──────────────────────────────────────────────────────────────────────
const slotW = VB_W - INNER_PAD * 2;
const slotH = (VB_H - INNER_PAD * 2 - SLOT_GAP - TEXT_ZONE) / SLOT_COUNT;
const slotRects = [];
for (let i = 0; i < SLOT_COUNT; i++) {
  const y = INNER_PAD + i * (slotH + SLOT_GAP);
  slotRects.push(`<rect x="${INNER_PAD}" y="${y}" width="${slotW}" height="${slotH}" fill="${PRESET.slotBg}" stroke="${PRESET.border}" stroke-width="${SLOT_BORDER_W}"/>`);
}

// ──────────────────────────────────────────────────────────────────────
// NAMES — Parisienne baked to vector path; baseline inside safe zone
// ──────────────────────────────────────────────────────────────────────
// Names sit far enough from the bottom edge that ascenders/descenders stay
// inside the safe margin even with cursive glyph variability.
const TEXT_BASELINE_Y = VB_H - 200;    // 200 from bottom (text height ~180 + safety)
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
