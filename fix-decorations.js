import fs from 'fs';

let content = fs.readFileSync('lib/templates.ts', 'utf-8');

// A map to determine decorations based on id
const getDecorationsStr = (id) => {
  if (id.includes('editorial-void') || id === 'editorial-landscape-L') return `decorations: [ { type: "EditorialVoidDivider" } ],`;
  if (id.includes('woven-silk')) return `decorations: [ { type: "WovenSilkMotif" } ],`;
  if (id.includes('heirloom-pina')) return `decorations: [ { type: "HeirloomPinaPattern" }, { type: "CaladoDivider" } ],`;
  if (id.includes('botanical-arch')) return `decorations: [ { type: "BotanicalArch" } ],`;
  if (id.includes('capiz-sage')) return `decorations: [ { type: "CapizLattice" } ],`;
  if (id.includes('brass-ring')) return `decorations: [ { type: "BrassRing" } ],`;
  if (id.includes('loom-frame')) return `decorations: [ { type: "LoomMortiseCorners" } ],`;
  if (id.includes('knalum-night')) return `decorations: [ { type: "KathaDoubleFrame" } ],`;
  if (id.includes('luxe-gold')) return `decorations: [ { type: "KathaDoubleFrame" } ],`;
  return null;
};

// We will look for object definitions in PRESETS
// They look like:
//   {
//     id: "katha-editorial-void",
//     ...
//     decorations: [], // maybe
//     ...
//   }

// Use a regex to find each preset block
const presetRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?(?=\n\s*\},|\n\s*\}\n\])/g;

content = content.replace(presetRegex, (match, id) => {
  const decStr = getDecorationsStr(id);
  if (!decStr) return match; // skip if we don't have a mapping

  // If it already has decorations: [], replace it
  if (match.includes('decorations: []')) {
    return match.replace(/decorations:\s*\[\s*\]\s*,?/, decStr);
  }

  // If it doesn't have decorations at all, insert it before designerExplanation
  if (!match.includes('decorations:') && match.includes('designerExplanation:')) {
    return match.replace(/(\s*)(designerExplanation:)/, `$1${decStr}$1$2`);
  }

  // If it has designerExplanation but decorations is already something else, 
  // maybe we leave it alone unless it's a known one we want to replace?
  // Wait, the prompt says "missing decorative SVG components for all 15 of the currently un-styled templates".
  // Let's not overwrite if it already has populated decorations.
  return match;
});

fs.writeFileSync('lib/templates.ts', content);
console.log('Updated lib/templates.ts');
