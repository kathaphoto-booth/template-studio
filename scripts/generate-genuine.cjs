const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const KATHA_COLORS = [
  '#111112', '#EAE2D5', '#8C382A', '#C4B59D', '#241E1A', 
  '#9C958A', '#1A1816', '#A35C44', '#5A5D5A', '#B5B8A3'
];

const DASH_PATTERNS = ["", "2 4", "4 8", "1 4"];
const STROKE_WIDTHS = [0.5, 1.0, 1.5];
const OPACITIES = [0.6, 0.8, 1.0];

// We need 40 unique designs
const designs = [];
let count = 0;

outer: for (const color of KATHA_COLORS) {
  for (const dash of DASH_PATTERNS) {
    for (const width of STROKE_WIDTHS) {
      for (const opacity of OPACITIES) {
        if (count >= 40) break outer;
        
        // Procedurally generate the SVG string
        // We use viewBox="-150 -150 300 300" so it centers nicely.
        
        // Create variations of quiet lux geometry:
        const isCorners = count % 4 === 0;
        const isDiamond = count % 4 === 1;
        const isLines = count % 4 === 2;
        const isConcentric = count % 4 === 3;
        
        let innerSvg = "";
        const dashStr = dash ? `stroke-dasharray="${dash}"` : "";
        
        if (isCorners) {
            const cl = 20 + (count % 3) * 10; // corner length
            innerSvg = `
              <path d="M -100 ${-100+cl} L -100 -100 L ${-100+cl} -100" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <path d="M 100 ${-100+cl} L 100 -100 L ${100-cl} -100" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <path d="M -100 ${100-cl} L -100 100 L ${-100+cl} 100" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <path d="M 100 ${100-cl} L 100 100 L ${100-cl} 100" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
            `;
        } else if (isDiamond) {
            innerSvg = `
              <rect x="-70" y="-70" width="140" height="140" transform="rotate(45)" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <circle cx="0" cy="0" r="10" fill="${color}" opacity="${opacity * 0.5}" />
            `;
        } else if (isLines) {
            innerSvg = `
              <line x1="-120" y1="-40" x2="120" y2="-40" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <line x1="-120" y1="40" x2="120" y2="40" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <line x1="0" y1="-80" x2="0" y2="80" stroke="${color}" stroke-width="${width * 0.5}" opacity="${opacity}" />
            `;
        } else if (isConcentric) {
            innerSvg = `
              <rect x="-80" y="-80" width="160" height="160" fill="none" stroke="${color}" stroke-width="${width}" ${dashStr} opacity="${opacity}" />
              <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="${color}" stroke-width="${width * 0.5}" opacity="${opacity * 0.8}" />
              <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="${color}" stroke-width="${width * 0.25}" opacity="${opacity * 0.6}" />
            `;
        }

        const rawSvg = `<svg viewBox="-150 -150 300 300" xmlns="http://www.w3.org/2000/svg">${innerSvg}</svg>`;
        
        designs.push({
          id: `QuietLuxDesign${count}`,
          svg: rawSvg,
          color,
          width,
          dash,
          opacity
        });
        
        count++;
      }
    }
  }
}

// 2. Run SVGO on them
fs.mkdirSync('./temp_svgo', { recursive: true });
designs.forEach(d => fs.writeFileSync(`./temp_svgo/${d.id}.svg`, d.svg));

try {
  console.log("Running svgo...");
  execSync('npx svgo -f ./temp_svgo -o ./temp_svgo_opt', { stdio: 'inherit' });
} catch(e) {
  console.log("SVGO failed, using unoptimized SVGs");
  fs.mkdirSync('./temp_svgo_opt', { recursive: true });
  designs.forEach(d => fs.copyFileSync(`./temp_svgo/${d.id}.svg`, `./temp_svgo_opt/${d.id}.svg`));
}

// Read back optimized SVGs
designs.forEach(d => {
  d.optSvg = fs.readFileSync(`./temp_svgo_opt/${d.id}.svg`, 'utf-8').trim();
});

// 3. Map into figma-assets.json
const figmaAssetsPath = path.join(__dirname, '../lib/figma-assets.json');
const assets = JSON.parse(fs.readFileSync(figmaAssetsPath, 'utf-8'));

designs.forEach(d => {
  assets[d.id] = {
    type: "FigmaAsset",
    name: d.id,
    svg: d.optSvg
  };
});

fs.writeFileSync(figmaAssetsPath, JSON.stringify(assets, null, 2));
console.log("Updated figma-assets.json");

// 4. Generate the 40 preset objects
const LAYOUTS = ["strip-2", "strip-3", "strip-4", "pv-2", "pc-3-v"];
const typeMap = {
  "strip-2": "strip", "strip-3": "strip", "strip-4": "strip",
  "pv-2": "postcard-vertical", "pc-3-v": "postcard"
};

const newPresets = designs.map((d, i) => {
  const layout = LAYOUTS[i % LAYOUTS.length];
  // Alternating background to be contrasting with the stroke color if possible, but keeping it simple:
  // Using 10-token palette.
  const isDarkLine = ['#111112', '#241E1A', '#1A1816', '#5A5D5A'].includes(d.color);
  const bgColor = isDarkLine ? '#EAE2D5' : '#111112'; 
  const textColor = isDarkLine ? '#111112' : '#EAE2D5';

  return `  {
    id: "katha-ql-genuine-${i}",
    name: "Quiet Lux — Genuine Variation ${i}",
    type: "${typeMap[layout]}",
    layoutId: "${layout}",
    backgroundColor: "${bgColor}",
    textColor: "${textColor}",
    borderColor: "${d.color}",
    secondaryColor: "${d.color}",
    fontFamily: "'Fraunces', serif",
    titleText: "Quiet Lux",
    subTitleText: "MMXXVI",
    dateText: "KATHA",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "${bgColor}",
    innerSpacing: "28px",
    decorativeSvg: "",
    decorations: [ { type: "${d.id}", anchor: "textCenter" } ],
    designerExplanation: "Genuine procedurally generated quiet lux geometry referencing the Etsy screenshots DNA, rendered in ${d.color}."
  }`;
});

fs.writeFileSync('./new_presets.txt', newPresets.join(",\n"));
console.log("Wrote presets to new_presets.txt");

// Cleanup
fs.rmSync('./temp_svgo', { recursive: true, force: true });
fs.rmSync('./temp_svgo_opt', { recursive: true, force: true });

