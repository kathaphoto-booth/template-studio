#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// KATHA TEMPLATE GUARD  —  the Katha-native "impeccable detect" for presets.
//
// Brand-context layer between the template catalog and generic design
// heuristics. Replaces the legacy oax-impeccable-bridge (which enforced the
// FORBIDDEN obsidian/gold/vellum + Cormorant + Jacobean brand). This guard
// enforces the LOCKED KATHA canon instead.
//
// TWO-TIER MODEL (this is the whole trick):
//   • Katha Signature presets  (id ^katha- / name "Katha Signature —")
//       → held to the 11-token Katha palette + FH Ronaldson display.
//   • Classic presets          (everything else)
//       → intentionally polished/symmetric wedding aesthetics. EXEMPT from
//         Katha brand chrome (see .impeccable/ignore.md → classic-template-tier).
//         Cinzel / Playfair / Rochester / lighter grounds are CORRECT here.
//
// Text-scans lib/templates.ts (no TS loader needed — same spirit as a grep
// brand-guard). Exits 1 on any P0; P1s are reported but do not block.
//
//   node scripts/katha-template-guard.mjs
// ════════════════════════════════════════════════════════════════════
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "../lib/templates.ts");
const text = readFileSync(SRC, "utf8");

// ── CANON (DESIGN_SYSTEM.v2.md — 11 tokens) + documented in-use tints ──
const CANON = new Set([
  "#111112", "#eae2d5", "#9c958a", "#c4b59d", "#241e1a",   // UI tokens
  "#1a1816", "#3d2b1f", "#a35c44", "#5a5d5a", "#b5b8a3",   // narrative tokens
  "#5a564e", "#6e6a62",                                     // ecru-safe muted (§VIII)
  "#e0d7c7",                                                // documented Signature tint
  // #8f4d39 REMOVED 2026-07-11 — retired red family, zero uses (Gilded Archive no-red law)
  "#dccbb5", "#8a7350", "#c2b19d",                          // Gilded Archive gilt (ratified 2026-07-06/07)
  "#e9dfcc", "#4e5b48",                                     // Sepia Bone stock + moss state (Gilded Archive)
  "#f9d2ae", "#e5b893",                                     // Guhit 1957 heritage newsprint — sampled from Deo Asis Grepo's Romansa Komiks pages (easter egg, ratified 2026-07-14)
]);
const LEGACY_OAX = new Set(["#0a0806", "#bf9d2c", "#c4c1b8", "#161618"]);
const PURE = new Set(["#000000", "#000", "#ffffff", "#fff"]);

// Tonal tolerance: a hex within this per-channel distance of any canon token
// is an accepted Wabi-Sabi tint (darker iron-bark, lighter ecru, etc.), not drift.
const TINT_TOLERANCE = 20;
const hexToRgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
};
const CANON_RGB = [...CANON].filter(h => /^#[0-9a-f]{6}$/.test(h)).map(hexToRgb);
const nearCanon = (hex) => {
  if (!/^#[0-9a-f]{6}$/.test(hex)) return false;
  const [r, g, b] = hexToRgb(hex);
  return CANON_RGB.some(([cr, cg, cb]) =>
    Math.max(Math.abs(r - cr), Math.abs(g - cg), Math.abs(b - cb)) <= TINT_TOLERANCE);
};

// Display font mandate for Signature tier (DESIGN_SYSTEM §3 / drift D1).
const SIGNATURE_DISPLAY_OK = /fh ronaldson/i;
const SIGNATURE_DISPLAY_DRIFT = /fraunces|cormorant|italiana|playfair|cinzel|rochester|parisienne/i;

// Forbidden user-facing vocabulary (DESIGN_SYSTEM §6 + §VIII agentic leak).
const FORBIDDEN_VOCAB = [
  "luxury", "premium", "stunning", "amazing", "unforgettable", "journey",
  "vibe", "curated", "instagrammable", "once-in-a-lifetime", "keepsake",
  "antigravity", "agentic", "alpha-transparent", "automation pipeline",
  "verification algorithm", "handloomed", "heirloom artistry", "raw silk", 
  "fabric of the keepsake"
];

// ── split the PRESETS array into individual object blocks ──
// String-aware brace counting: braces inside string/template values (e.g. a
// future decorativeSvg holding inline <style>.cls{…}</style>) must NOT move the
// depth counter, or block boundaries desync and presets merge/drop silently.
function presetBlocks(src) {
  const start = src.indexOf("export const PRESETS");
  const body = src.slice(start);
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

// Anchor the key on a boundary ({ , whitespace, or start) so `id` does not
// match the tail of `layoutId`, regardless of field ordering.
const field = (block, name) => {
  const m = block.match(new RegExp('(?:^|[\\s{,])' + name + '\\s*:\\s*"([^"]*)"'));
  return m ? m[1] : null;
};
const isSignature = (block) => {
  const id = field(block, "id") || "";
  const name = field(block, "name") || "";
  return /^katha-/.test(id) || /Katha Signature/i.test(name);
};

const P0 = [], P1 = [];
const blocks = presetBlocks(text);
let sig = 0, classic = 0;

for (const b of blocks) {
  const id = field(b, "id") || "(unknown)";
  if (!isSignature(b)) { classic++; continue; }
  sig++;

  // hex audit — only the design-token color fields, not slot geometry
  for (const f of ["backgroundColor", "textColor", "borderColor", "secondaryColor", "slotBgColor"]) {
    const v = (field(b, f) || "").toLowerCase();
    if (!v) continue;
    if (LEGACY_OAX.has(v)) P0.push(`${id} · ${f} ${v} — FORBIDDEN legacy oax token`);
    else if (PURE.has(v)) P0.push(`${id} · ${f} ${v} — pure black/white (always tonal)`);
    else if (/^#[0-9a-f]{3,8}$/.test(v) && !CANON.has(v) && !nearCanon(v))
      P1.push(`${id} · ${f} ${v} — off-canon hex (not a tint of any token; review)`);
  }

  // display font mandate
  const ff = field(b, "fontFamily") || "";
  if (SIGNATURE_DISPLAY_DRIFT.test(ff) && !SIGNATURE_DISPLAY_OK.test(ff))
    P1.push(`${id} · fontFamily ${ff.trim()} — drift D1: Signature display must be FH Ronaldson`);
}

// vocab scan over USER-FACING field values only (not code comments)
const FACING = ["name", "titleText", "subTitleText", "dateText", "designerExplanation"];
const facingCorpus = blocks
  .flatMap(b => FACING.map(f => (field(b, f) || "")))
  .join(" • ").toLowerCase();
for (const w of FORBIDDEN_VOCAB) {
  const re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
  const n = (facingCorpus.match(re) || []).length;
  if (n) P0.push(`vocab "${w}" — ${n}× in user-facing copy (forbidden, DESIGN_SYSTEM §6/§VIII)`);
}
// legacy hex anywhere in the file is always a hard block
const lower = text.toLowerCase();
for (const hx of LEGACY_OAX) {
  const n = (lower.split(hx).length - 1);
  if (n) P0.push(`legacy hex ${hx} — ${n}× anywhere in catalog`);
}
// advisory: forbidden vocab in code comments (copy hygiene, non-blocking)
for (const w of FORBIDDEN_VOCAB) {
  const inComments = text.split("\n")
    .filter(l => l.trim().startsWith("//"))
    .join(" ").toLowerCase();
  const re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
  const n = (inComments.match(re) || []).length;
  if (n) P1.push(`vocab "${w}" — ${n}× in code comments (copy hygiene, not shipped to users)`);
}

// ── report (Katha-voiced, mirrors the bridge's audit template) ──
const date = process.env.GUARD_DATE || "(stamp on commit)";
console.log("KATHA TEMPLATE GUARD — lib/templates.ts — " + date);
console.log("=".repeat(64));
console.log(`Catalog: ${blocks.length} presets · ${sig} Katha Signature (held) · ${classic} Classic (exempt)`);
console.log("");
console.log("P0 — HARD BLOCK");
console.log(P0.length ? P0.map(x => "  ✗ " + x).join("\n") : "  None");
console.log("");
console.log("P1 — DRIFT (executive review, non-blocking)");
console.log(P1.length ? P1.map(x => "  • " + x).join("\n") : "  None");
console.log("");
console.log("=".repeat(64));
const verdict = P0.length ? "BLOCKED" : P1.length ? "CONDITIONAL" : "APPROVED";
console.log("VERDICT  " + verdict + (P0.length ? ` — ${P0.length} hard block(s)` : P1.length ? ` — ${P1.length} drift(s) to review` : ""));
process.exit(P0.length ? 1 : 0);
