const fs = require('fs');

let tpl = fs.readFileSync('lib/templates.ts', 'utf-8');
const newPresetsStr = fs.readFileSync('./new_presets.txt', 'utf-8');

// 1. Remove old fake presets from PRESETS array
// They start with { id: "katha-ql-calado-1" and end at the close of PRESETS array
// The array ends with \n];
// Let's replace the block using regex or string splits
const startIdx = tpl.indexOf('  {\n    id: "katha-ql-calado-1"');
const endIdx = tpl.indexOf('\n];', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
  tpl = tpl.substring(0, startIdx) + newPresetsStr + '\n' + tpl.substring(endIdx);
  console.log("Replaced presets");
} else {
  console.log("Could not find start/end of presets");
}

// 2. Remove DECORATION_ALIASES for katha-ql-...
const lines = tpl.split('\n');
const newLines = lines.filter(line => !line.includes('"katha-ql-calado-') && !line.includes('"katha-ql-matte-') && !line.includes('"katha-ql-edge-') && !line.includes('"katha-ql-editorial-') && !line.includes('"katha-ql-corners-'));
tpl = newLines.join('\n');
console.log("Removed aliases");

// 3. Remove switch cases in renderDecorativeSvg
// They are case "katha-ql-calado": down to case "katha-ql-corners": ... default:
const switchStart = tpl.indexOf('    case "katha-ql-calado":');
const switchEnd = tpl.indexOf('    default:', switchStart);
if (switchStart !== -1 && switchEnd !== -1) {
  tpl = tpl.substring(0, switchStart) + tpl.substring(switchEnd);
  console.log("Removed switch cases");
} else {
  console.log("Could not find switch cases");
}

fs.writeFileSync('lib/templates.ts', tpl);
console.log("Cleaned up templates.ts");
