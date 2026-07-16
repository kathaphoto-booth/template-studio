#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// SYNC CONTENT PLATES — derive client-facing plate entries in
// lib/content.json from the full preset catalog in lib/templates.ts.
//
// Why: lib/templates.ts is the single source of truth for the Katha
// Signature catalog, but the live customizer + gallery read
// content.json's `templates` array. Signature BASE presets that were
// never hand-curated into content.json were invisible to clients.
// Owner ruling: "there are no subsets" — every Signature base preset
// must surface as a plate.
//
// Behaviour:
//   • Signature = preset id starts with `katha-`.
//   • BASE presets only — format variants (-postcard / -landscape /
//     -landscape-Nsq) are grouped under their base.
//   • Hand-curated entries are NEVER touched. Matching is by exact id,
//     id minus the `katha-` prefix, or normalized display name.
//   • Generated entries carry `"generated": true` so a human can later
//     curate names/copy. Re-runs replace the generated block in place —
//     idempotent, no duplicates.
//   • Colors are MOVED, never invented: paper=backgroundColor,
//     slot=slotBgColor||backgroundColor, edge=borderColor,
//     ink=textColor, accent=secondaryColor.
//   • desc derives from designerExplanation, sanitized against the
//     BRIEFS.md §4 banned vocabulary and clamped to ~140 chars.
//
//   node scripts/sync-content-plates.mjs
// ════════════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DEFAULT_LAYOUT, getLayout } from "../lib/layouts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_SRC = resolve(__dirname, "../lib/templates.ts");
const CONTENT_SRC = resolve(__dirname, "../lib/content.json");

// ── parse lib/templates.ts preset blocks (string-aware brace counting,
//    same technique as katha-template-guard.mjs — no TS loader needed) ──
function presetBlocks(src) {
  const start = src.indexOf("export const PRESETS");
  const end = src.indexOf("DECORATION_ALIASES");
  const body = src.slice(start, end === -1 ? undefined : end);
  const blocks = [];
  let depth = 0, cur = "", capturing = false, inStr = null, esc = false;
  for (const ch of body) {
    if (ch === "{" && !inStr) { depth++; capturing = true; }
    if (capturing) cur += ch;
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === inStr) inStr = null;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      inStr = ch;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && capturing) {
        if (/id:\s*["']/.test(cur)) blocks.push(cur);
        cur = ""; capturing = false;
      }
    }
  }
  return blocks;
}

const field = (block, name) => {
  const m = block.match(new RegExp('(?:^|[\\s{,])' + name + '\\s*:\\s*"([^"]*)"'));
  return m ? m[1] : null;
};

// ── derivation helpers ──
const VARIANT_SUFFIX = /-(postcard|landscape)(-[0-9]sq)?$/;

const stripDiacritics = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const normName = (s) =>
  stripDiacritics(String(s)).toLowerCase().replace(/^the\s+/, "").replace(/\s+/g, " ").trim();

const displayName = (presetName) =>
  presetName.replace(/^Katha\s+Signature\s*[—–-]\s*/i, "").trim();

const firstFontFamily = (fontFamily) => {
  const m = String(fontFamily || "").match(/'([^']+)'|"([^"]+)"/);
  if (m) return m[1] || m[2];
  return String(fontFamily || "").split(",")[0].trim();
};

// BRIEFS.md §4 — forbidden in user copy. We only strip; we never rewrite.
const BANNED_WORDS = ["luxury", "luxurious", "premium", "stunning", "amazing"];
function sanitize(text) {
  let out = String(text || "");
  for (const w of BANNED_WORDS) {
    out = out.replace(new RegExp(`\\b${w}\\b`, "gi"), "");
  }
  return out
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

// Clamp to ~140 chars: accumulate whole sentences; if that yields something
// too thin, fall back to a word-boundary cut.
function clampDesc(text, max = 140) {
  const clean = sanitize(text);
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [clean];
  let acc = "";
  for (const s of sentences) {
    if ((acc + s).trim().length > max) break;
    acc += s;
  }
  acc = acc.trim();
  if (acc.length >= 50) return acc;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "") + "…";
}

function formatMeta(layoutId, type) {
  const layout = getLayout(layoutId) || getLayout(DEFAULT_LAYOUT[type]);
  const fmt = layout?.format || type;
  if (fmt === "strip") return { layout: layout.id, formatLabel: "2×6 Strip", ratio: { w: 1, h: 3 } };
  if (fmt === "postcard-vertical") return { layout: layout.id, formatLabel: "4×6 Postcard", ratio: { w: 2, h: 3 } };
  // landscape postcard
  const label = /sq$/.test(layout.id) ? "6×4 Square" : "6×4 Postcard";
  return { layout: layout.id, formatLabel: label, ratio: { w: 3, h: 2 } };
}

// ── load sources ──
const templatesTs = readFileSync(TEMPLATES_SRC, "utf8");
const contentRaw = readFileSync(CONTENT_SRC, "utf8");
const content = JSON.parse(contentRaw);

const presets = presetBlocks(templatesTs).map((b) => ({
  id: field(b, "id"),
  name: field(b, "name"),
  type: field(b, "type"),
  layoutId: field(b, "layoutId"),
  backgroundColor: field(b, "backgroundColor"),
  textColor: field(b, "textColor"),
  borderColor: field(b, "borderColor"),
  secondaryColor: field(b, "secondaryColor"),
  slotBgColor: field(b, "slotBgColor"),
  fontFamily: field(b, "fontFamily"),
  designerExplanation: field(b, "designerExplanation"),
}));

const signatureBases = presets.filter(
  (p) => p.id && p.id.startsWith("katha-") && !VARIANT_SUFFIX.test(p.id)
);

// Hand-curated entries (everything not previously generated by this script).
const curated = content.templates.filter((t) => !t.generated);
const curatedIds = new Set();
const curatedNames = new Set();
for (const t of curated) {
  if (t.isFootnote) continue;
  curatedIds.add(t.id);
  if (t.name) curatedNames.add(normName(t.name));
}

const isCurated = (p) => {
  const stripped = p.id.replace(/^katha-/, "");
  return (
    curatedIds.has(p.id) ||
    curatedIds.has(stripped) ||
    curatedNames.has(normName(displayName(p.name)))
  );
};

const missing = signatureBases.filter((p) => !isCurated(p));

// Plate numbering continues after the highest hand-curated plate number,
// so re-runs always produce the same sequence (idempotent).
const maxPlate = curated.reduce((mx, t) => {
  const n = parseInt(t.plate, 10);
  return Number.isFinite(n) ? Math.max(mx, n) : mx;
}, 0);
const pad = Math.max(3, String(maxPlate).length);

const generated = missing.map((p, i) => {
  const { layout, formatLabel, ratio } = formatMeta(p.layoutId, p.type);
  const name = displayName(p.name);
  return {
    id: p.id,
    plate: String(maxPlate + 1 + i).padStart(pad, "0"),
    name,
    style: "Signature",
    booth: "Oak",
    formatLabel,
    layout,
    font: firstFontFamily(p.fontFamily),
    ratio,
    desc: clampDesc(p.designerExplanation),
    paper: p.backgroundColor,
    slot: p.slotBgColor || p.backgroundColor,
    edge: p.borderColor,
    ink: p.textColor,
    accent: p.secondaryColor,
    sName: name.toUpperCase(),
    sSub: formatLabel.toUpperCase(),
    generated: true,
  };
});

// Rebuild templates: keep curated order untouched, drop the previous
// generated block, insert the fresh one after the last curated Signature
// plate (so the Signature section stays contiguous in the gallery).
const kept = content.templates.filter((t) => !t.generated);
let insertAt = 0;
kept.forEach((t, i) => { if (!t.isFootnote && t.style === "Signature") insertAt = i + 1; });
content.templates = [...kept.slice(0, insertAt), ...generated, ...kept.slice(insertAt)];

writeFileSync(CONTENT_SRC, JSON.stringify(content, null, 2) + "\n");

const sigCount = content.templates.filter((t) => !t.isFootnote && t.style === "Signature").length;
console.log(`sync-content-plates: ${signatureBases.length} Signature base presets in templates.ts`);
console.log(`  curated (untouched): ${signatureBases.length - missing.length} matched, ${curated.filter((t) => !t.isFootnote).length} total hand-curated plates`);
console.log(`  generated: ${generated.length} plate entries (plates ${generated[0]?.plate ?? "—"}–${generated[generated.length - 1]?.plate ?? "—"})`);
console.log(`  content.json now carries ${sigCount} Signature plates / ${content.templates.filter((t) => !t.isFootnote).length} total`);
