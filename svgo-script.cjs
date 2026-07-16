const fs = require('fs');

const figmaAssetsPath = '/Users/jedg./Desktop/kat_ha_pb/photobooth-template-studio/lib/figma-assets.json';
const figmaAssets = JSON.parse(fs.readFileSync(figmaAssetsPath, 'utf8'));

const names = ['QuietLuxCalado', 'QuietLuxMatte', 'QuietLuxEdge', 'QuietLuxEditorial', 'QuietLuxCorners'];

names.forEach(name => {
  let optimized = "";
  try {
    optimized = fs.readFileSync(`/tmp/${name}.svg`, 'utf8');
  } catch (e) {
    optimized = "error";
  }
  if (optimized !== "error") {
    figmaAssets[name] = {
      type: "FigmaAsset",
      name: name,
      svg: optimized.trim()
    };
  }
});

fs.writeFileSync(figmaAssetsPath, JSON.stringify(figmaAssets, null, 2));
console.log("Added SVG assets to figma-assets.json");
