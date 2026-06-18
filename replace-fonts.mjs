import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = '/Users/jedg./Desktop/kat_ha_pb/photobooth-template-studio';

// 1. Update fonts.ts
const fontsPath = join(root, 'lib/fonts.ts');
let fontsTs = readFileSync(fontsPath, 'utf8');
fontsTs = fontsTs.replace(/  EB_Garamond,\n/g, '');
fontsTs = fontsTs.replace(/  Fraunces,\n/g, '');
fontsTs = fontsTs.replace(/export const ebGaramond = EB_Garamond\(\{ subsets: \['latin'\], variable: '--font-eb-garamond', display: 'swap' \}\);\n/g, '');
fontsTs = fontsTs.replace(/export const fraunces = Fraunces\(\{ subsets: \['latin'\], variable: '--font-fraunces', display: 'swap', axes: \['SOFT', 'WONK'\] \}\);\n/g, '');
fontsTs = fontsTs.replace(/  ebGaramond\.variable,\n/g, '');
fontsTs = fontsTs.replace(/  fraunces\.variable,\n/g, '');
writeFileSync(fontsPath, fontsTs);
console.log('Updated lib/fonts.ts');

// 2. Update templates.ts
const templatesPath = join(root, 'lib/templates.ts');
let templatesTs = readFileSync(templatesPath, 'utf8');
templatesTs = templatesTs.replace(/fontFamily: "'Fraunces', serif"/g, `fontFamily: "'Playfair Display', serif"`);
templatesTs = templatesTs.replace(/fontFamily: "'EB Garamond', serif"/g, `fontFamily: "'Hanken Grotesk', sans-serif"`);
writeFileSync(templatesPath, templatesTs);
console.log('Updated lib/templates.ts');

// 3. Update katha-template-guard.mjs
const guardPath = join(root, 'scripts/katha-template-guard.mjs');
let guardMjs = readFileSync(guardPath, 'utf8');
guardMjs = guardMjs.replace(/const SIGNATURE_DISPLAY_OK = \/fraunces\/i;/g, 'const SIGNATURE_DISPLAY_OK = /playfair display|hanken grotesk/i;');
guardMjs = guardMjs.replace(/const SIGNATURE_DISPLAY_DRIFT = \/cormorant\|italiana\|playfair\|cinzel\|rochester\|parisienne\/i;/g, 'const SIGNATURE_DISPLAY_DRIFT = /cormorant|italiana|fraunces|eb garamond|cinzel|rochester|parisienne/i;');
// also replace the warning message
guardMjs = guardMjs.replace(/Signature display must be Fraunces/g, 'Signature display must be Playfair Display or Hanken Grotesk');
writeFileSync(guardPath, guardMjs);
console.log('Updated scripts/katha-template-guard.mjs');

// 4. Update katha-guard.mjs (LIFT FRAUNCES WARNING)
const mainGuardPath = join(root, 'scripts/katha-guard.mjs');
let mainGuardMjs = readFileSync(mainGuardPath, 'utf8');
mainGuardMjs = mainGuardMjs.replace(/\/\/ LIFT FRAUNCES WARNING: Katha deliberately uses Fraunces\n    findings = findings\.filter\(f => !\(f\.antipattern === "overused-font" && f\.snippet && f\.snippet\.includes\("Fraunces"\)\)\);\n/g, '');
writeFileSync(mainGuardPath, mainGuardMjs);
console.log('Updated scripts/katha-guard.mjs');

