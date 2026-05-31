import { LAYOUTS } from "../lib/layouts.js";
import { validateAll } from "../lib/validate-layout.js";
const { pass, results } = validateAll(LAYOUTS);
console.log("LOCKED SPEC VALIDATION\n" + "=".repeat(64));
for (const [id, r] of Object.entries(results)) {
  const mark = r.pass ? "PASS" : "FAIL";
  const s = r.stats;
  console.log(`[${mark}] ${id.padEnd(10)} ${String(s.format).padEnd(18)} ${s.slotCount}sl  band ${String(s.bandPct).padStart(4)}%  cover ${s.coverage}%`);
  r.violations.forEach(v => console.log(`        x ${v}`));
}
console.log("=".repeat(64));
console.log(pass ? "ALL LAYOUTS OBEY THE MEASUREMENT LAW" : "SPEC HAS VIOLATIONS");
process.exit(pass ? 0 : 1);
