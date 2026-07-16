#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════
// shot.js — rendered-pixel harness for the self-critique loop.
//
//   node scripts/shot.js <url> <outfile.png> [--w 1440] [--h 900]
//                        [--reduced] [--full] [--wait 1800]
//
// Prints every page console error/warning and failed request to stdout;
// the critique loop treats any error line as a failed gate.
// Playwright resolves from the monorepo root node_modules.
// ════════════════════════════════════════════════════════════════════
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The studio gate (middleware.ts) basic-auths "/" when STUDIO_PASSWORD is set.
// Pull it from the environment or pb-v3/.env so shots of protected routes work.
const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env");
let studioPassword = process.env.STUDIO_PASSWORD || "";
if (!studioPassword && fs.existsSync(envFile)) {
  const m = fs.readFileSync(envFile, "utf8").match(/^STUDIO_PASSWORD=["']?([^"'\n]+)/m);
  if (m) studioPassword = m[1];
}

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
if (!url || !out) {
  console.error("usage: node scripts/shot.js <url> <outfile.png> [--w N] [--h N] [--reduced] [--full] [--wait ms]");
  process.exit(2);
}
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const width = parseInt(flag("w", "1440"), 10);
const height = parseInt(flag("h", "900"), 10);
const settle = parseInt(flag("wait", "1800"), 10); // let ≥1.2s entrances resolve

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height },
  reducedMotion: has("reduced") ? "reduce" : "no-preference",
  colorScheme: "dark",
  deviceScaleFactor: 2,
  ...(studioPassword ? { httpCredentials: { username: "katha", password: studioPassword } } : {}),
});
const page = await ctx.newPage();

let errors = 0;
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    errors += msg.type() === "error" ? 1 : 0;
    console.log(`[console.${msg.type()}] ${msg.text()}`);
  }
});
page.on("pageerror", (err) => {
  errors += 1;
  console.log(`[pageerror] ${err.message}`);
});
page.on("requestfailed", (req) => {
  // Ignore aborted prefetches; report real failures.
  const failure = req.failure()?.errorText ?? "";
  if (!failure.includes("ERR_ABORTED")) {
    console.log(`[requestfailed] ${req.url()} — ${failure}`);
  }
});

try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
} catch {
  // Dev-server HMR sockets keep networkidle from settling sometimes — fall through on load.
  await page.waitForLoadState("load");
}
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(settle);
await page.screenshot({ path: out, fullPage: has("full") });
await browser.close();

console.log(`[shot] ${out} @ ${width}x${height}${has("reduced") ? " (reduced-motion)" : ""}${has("full") ? " (full page)" : ""}`);
console.log(`[shot] console errors: ${errors}`);
process.exit(0);
