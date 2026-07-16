#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// KATHA GUARD — unified brand-quality pipeline.
//
// Wires three layers into one verdict:
//   1. Katha Template Guard   (katha-template-guard.mjs) — palette/font/vocab
//      on Signature presets. HARD BLOCK on legacy hex, pure b/w, forbidden copy.
//   2. Layout Spec            (validate-spec.mjs)        — the LOCKED 300-DPI
//      measurement law. HARD BLOCK on slot-geometry violations.
//   3. impeccable detect      (pbakaus/impeccable)       — brand-agnostic UI
//      anti-pattern scanner, contextualised by ./DESIGN.md. ADVISORY (P1).
//
// P0 (layers 1–2) blocks CI. P1 (layer 3 + template drift) is executive review.
// This is the Katha replacement for the legacy oax-impeccable-bridge — same
// two-tier CI/executive split, enforcing Katha instead of OAX.
//
//   node scripts/katha-guard.mjs            # full pipeline
//   node scripts/katha-guard.mjs --p0-only  # skip the advisory detect layer
// ════════════════════════════════════════════════════════════════════
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const p0Only = process.argv.includes("--p0-only");
const bar = "═".repeat(64);
const run = (cmd, args) =>
  spawnSync(cmd, args, { cwd: root, encoding: "utf8", env: { ...process.env, GUARD_DATE: process.env.GUARD_DATE || "" } });

let hardBlock = false;

console.log("\n" + bar);
console.log("  KATHA GUARD — unified brand-quality pipeline");
console.log(bar);

// ── Layer 1: template brand guard (P0 + P1) ──
console.log("\n▸ LAYER 1  Template brand guard (katha-template-guard.mjs)");
const g1 = run("node", ["scripts/katha-template-guard.mjs"]);
process.stdout.write(g1.stdout || "");
if (g1.status !== 0) { hardBlock = true; console.log("  → P0 hard block in template palette/vocab."); }

// ── Layer 2: layout measurement law (P0) ──
console.log("\n▸ LAYER 2  Layout measurement law (validate-spec.mjs)");
const g2 = run("node", ["scripts/validate-spec.mjs"]);
const g2tail = (g2.stdout || "").trim().split("\n").slice(-3).join("\n");
console.log("  " + g2tail.replace(/\n/g, "\n  "));
if (g2.status !== 0) { hardBlock = true; console.log("  → P0 hard block in slot geometry."); }

// ── Layer 3: impeccable detect (advisory P1) ──
if (!p0Only) {
  console.log("\n▸ LAYER 3  impeccable detect — UI anti-patterns (advisory, DESIGN.md-aware)");
  const g3 = run("npx", ["impeccable", "detect", "app", "lib", "--json"]);
  let findings = [];
  try {
    const s = g3.stdout || "";
    findings = JSON.parse(s.slice(s.indexOf("["), s.lastIndexOf("]") + 1));
      } catch { console.log("  (detect produced no parseable JSON — skipping)"); }
  if (findings.length) {
    const bySev = {};
    for (const f of findings) bySev[f.severity] = (bySev[f.severity] || 0) + 1;
    console.log("  findings: " + findings.length + " · " +
      Object.entries(bySev).map(([k, v]) => `${v} ${k}`).join(" · "));
    for (const f of findings.slice(0, 12)) {
      const file = (f.file || "").split("/").slice(-2).join("/");
      console.log(`    • [${f.severity}] ${f.antipattern} — ${file}:${f.line || "?"}`);
    }
    if (findings.length > 12) console.log(`    … +${findings.length - 12} more (see guard:detect)`);
  } else {
    console.log("  None.");
  }
} else {
  console.log("\n▸ LAYER 3  skipped (--p0-only)");
}

// ── verdict ──
console.log("\n" + bar);
console.log("  VERDICT  " + (hardBlock ? "BLOCKED — P0 hard failure (see layers 1–2)"
                                       : "APPROVED — no P0 blocks (P1 advisories above are executive review)"));
console.log(bar + "\n");
process.exit(hardBlock ? 1 : 0);
