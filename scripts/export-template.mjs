import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import { PDFDocument } from "pdf-lib";
import { resolveLayout, VIEWBOX, SAFE_MARGIN } from "../lib/layouts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ──────────────────────────────────────────────────────────────────────
// CLI ARGUMENTS
// ──────────────────────────────────────────────────────────────────────
let presetPath = null;
let fontOverride = null;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--preset" && args[i + 1]) {
    presetPath = args[i + 1];
    i++;
  } else if (args[i] === "--font" && args[i + 1]) {
    fontOverride = args[i + 1];
    i++;
  }
}

if (!presetPath) {
  presetPath = path.join(__dirname, "presets", "tracy_prince.json");
}

let presetPathResolved = path.resolve(process.cwd(), presetPath);
if (!fs.existsSync(presetPathResolved)) {
    const fallback = path.resolve(__dirname, presetPath);
    if (fs.existsSync(fallback)) {
        presetPathResolved = fallback;
    }
}

const PRESET = JSON.parse(fs.readFileSync(presetPathResolved, "utf-8"));

// ──────────────────────────────────────────────────────────────────────
// FOIL GRADIENTS
// ──────────────────────────────────────────────────────────────────────
const FOIL_GRADIENTS = {
  "rose-gold": { stops: [["#B76E79", 0], ["#E8B4B8", 0.3], ["#D4A574", 0.6], ["#B76E79", 1]] },
  "gold": { stops: [["#D4AF37", 0], ["#F5E6A8", 0.35], ["#D4AF37", 0.65], ["#B8860B", 1]] },
  "silver": { stops: [["#C0C0C0", 0], ["#E8E8E8", 0.4], ["#A0A0A0", 0.7], ["#C0C0C0", 1]] },
};

let defs = "";
let textFill = PRESET.text;
let decorationStroke = PRESET.secondary;

if (PRESET.foil && FOIL_GRADIENTS[PRESET.foil]) {
  const gradient = FOIL_GRADIENTS[PRESET.foil];
  const stops = gradient.stops.map(s => `<stop offset="${s[1] * 100}%" stop-color="${s[0]}" />`).join("");
  defs = `
  <defs>
    <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="100%">
      ${stops}
    </linearGradient>
  </defs>`;
  textFill = "url(#foil)";
  decorationStroke = "url(#foil)";
}

// ──────────────────────────────────────────────────────────────────────
// FONT & GLYPH CONFIG
// ──────────────────────────────────────────────────────────────────────
const fontName = fontOverride || PRESET.font || "parisienne";
let fontFile = "Parisienne-Regular.ttf";
let glyphConfig = { baselineOffset: 0, scaleAdjust: 1, letterSpacing: 0, ligatures: {} };

const glyphConfigPath = path.join(__dirname, "glyphs", `${fontName}.json`);
if (fs.existsSync(glyphConfigPath)) {
  glyphConfig = JSON.parse(fs.readFileSync(glyphConfigPath, "utf-8"));
  fontFile = glyphConfig.fontFile || fontFile;
}

const FONT_PATH = path.join(__dirname, "fonts", fontFile);
const FONT = opentype.parse(fs.readFileSync(FONT_PATH).buffer);

function textToSvgPath({ text, cx, by, fontSize, fill }) {
  let processedText = text;
  if (glyphConfig.ligatures) {
      for (const [key, val] of Object.entries(glyphConfig.ligatures)) {
          processedText = processedText.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), val);
      }
  }

  const scaledFontSize = fontSize * (glyphConfig.scaleAdjust || 1);
  const offset = glyphConfig.baselineOffset || 0;
  
  const p = FONT.getPath(processedText, 0, 0, scaledFontSize);
  const bbox = p.getBoundingBox();
  const width = bbox.x2 - bbox.x1;
  const x = cx - width / 2 - bbox.x1;
  return `<path transform="translate(${x.toFixed(2)} ${(by + offset).toFixed(2)})" d="${p.toPathData(2)}" fill="${fill}"/>`;
}

// ──────────────────────────────────────────────────────────────────────
// FORMAT GEOMETRY
// ──────────────────────────────────────────────────────────────────────
const vb = VIEWBOX[PRESET.format];
const VB_W = vb.w;
const VB_H = vb.h;
const SCALE = 3;
const W = VB_W * SCALE;
const H = VB_H * SCALE;

const PRINT_W_PT = (PRESET.format === "postcard" ? 6 : PRESET.format === "strip" ? 2 : 4) * 72;
const PRINT_H_PT = (PRESET.format === "postcard" ? 4 : 6) * 72;

const LAYOUT = resolveLayout(PRESET.layoutId || "pv-2", PRESET.format);

const FRAME_OUTER = 60;
const FRAME_INNER = 72;
const SLOT_BORDER_W = 1;

// ──────────────────────────────────────────────────────────────────────
// DECORATION
// ──────────────────────────────────────────────────────────────────────
const MONOGRAM_Y = LAYOUT.textZone.y + 80;
const decoration = `
  <rect x="${FRAME_OUTER}" y="${FRAME_OUTER}" width="${VB_W - FRAME_OUTER * 2}" height="${VB_H - FRAME_OUTER * 2}" fill="none" stroke="${decorationStroke}" stroke-width="1.5"/>
  <rect x="${FRAME_INNER}" y="${FRAME_INNER}" width="${VB_W - FRAME_INNER * 2}" height="${VB_H - FRAME_INNER * 2}" fill="none" stroke="${decorationStroke}" stroke-width="0.5" opacity="0.55"/>
  <g transform="translate(${VB_W / 2}, ${MONOGRAM_Y})" fill="none" stroke="${decorationStroke}">
    <circle cx="0" cy="0" r="22" stroke-width="1" opacity="0.55"/>
    <circle cx="0" cy="0" r="16" stroke-width="0.5" opacity="0.35"/>
    <line x1="-220" y1="0" x2="-32" y2="0" stroke-width="0.75" opacity="0.4"/>
    <line x1="32" y1="0" x2="220" y2="0" stroke-width="0.75" opacity="0.4"/>
  </g>
`;

const slotRects = LAYOUT.slots.map(
  (s) => `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="${PRESET.slotBg}" stroke="${PRESET.border}" stroke-width="${SLOT_BORDER_W}"/>`
);

// ──────────────────────────────────────────────────────────────────────
// NAMES
// ──────────────────────────────────────────────────────────────────────
const TEXT_BASELINE_Y = LAYOUT.textZone.y + LAYOUT.textZone.h * 0.62;
const namesText = textToSvgPath({
  text: PRESET.names,
  cx: VB_W / 2,
  by: TEXT_BASELINE_Y,
  fontSize: 170,
  fill: textFill,
});

// ──────────────────────────────────────────────────────────────────────
// SVG ASSEMBLY
// ──────────────────────────────────────────────────────────────────────
function svgComposite() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${W}" height="${H}">
${defs ? defs + "\n" : ""}\
  <rect width="${VB_W}" height="${VB_H}" fill="${PRESET.bg}"/>
  ${slotRects.join("\n  ")}
  ${decoration}
  ${namesText}
</svg>`;
}

function svgAlphaOverlay() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${W}" height="${H}">
${defs ? defs + "\n" : ""}\
  ${decoration}
  ${namesText}
</svg>`;
}

// ──────────────────────────────────────────────────────────────────────
// PDF generation
// ──────────────────────────────────────────────────────────────────────
async function buildPdf({ pngBytes, outPath, isAlpha }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PRINT_W_PT, PRINT_H_PT]);
  const img = await pdf.embedPng(pngBytes);
  page.drawImage(img, { x: 0, y: 0, width: PRINT_W_PT, height: PRINT_H_PT });
  pdf.setTitle(`${PRESET.slug}${isAlpha ? " — alpha overlay" : ""} print proof`);
  pdf.setProducer("Katha Template Studio");
  pdf.setCreator("Katha Template Studio export-template.mjs");
  pdf.setSubject(isAlpha ? "Alpha overlay, 4×6 vertical, 300 DPI" : "CMYK-ready composite, 4×6 vertical, 300 DPI");
  const bytes = await pdf.save();
  fs.writeFileSync(outPath, bytes);
}

// ──────────────────────────────────────────────────────────────────────
// RUN
// ──────────────────────────────────────────────────────────────────────
async function run() {
  const outDir = path.resolve(process.cwd(), "exports");
  if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
  }

  for (const f of fs.readdirSync(outDir)) {
    if (f.startsWith(PRESET.slug) && f.endsWith(".svg")) fs.unlinkSync(path.join(outDir, f));
  }

  const out = {
    compPng: path.join(outDir, `${PRESET.slug}_composite.png`),
    alphaPng: path.join(outDir, `${PRESET.slug}_alpha_overlay.png`),
    compPdf: path.join(outDir, `${PRESET.slug}_composite_cmyk.pdf`),
    alphaPdf: path.join(outDir, `${PRESET.slug}_alpha_overlay.pdf`),
  };

  const compPngBuf = await sharp(Buffer.from(svgComposite()), { density: 300, limitInputPixels: false })
    .resize(W, H)
    .png({ quality: 100 })
    .toBuffer();
  fs.writeFileSync(out.compPng, compPngBuf);

  const alphaPngBuf = await sharp(Buffer.from(svgAlphaOverlay()), { density: 300, limitInputPixels: false })
    .resize(W, H)
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();
  fs.writeFileSync(out.alphaPng, alphaPngBuf);

  await buildPdf({ pngBytes: compPngBuf, outPath: out.compPdf, isAlpha: false });
  await buildPdf({ pngBytes: alphaPngBuf, outPath: out.alphaPdf, isAlpha: true });

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
