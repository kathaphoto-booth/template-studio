import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we have the token
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_ID = '6aYjDZptjiLUr9gn7glRS0';

if (!FIGMA_TOKEN) {
  console.error("❌ FIGMA_ACCESS_TOKEN not found in environment.");
  process.exit(1);
}

const headers = { 'X-Figma-Token': FIGMA_TOKEN };

async function syncFigma() {
  console.log(`🍌 Nano-Banana: Connecting to Figma File [${FILE_ID}]...`);
  
  try {
    const res = await fetch(`https://api.figma.com/v1/files/${FILE_ID}`, { headers });
    const data = await res.json();
    
    if (data.status === 403 || data.err) {
      console.error("❌ Figma API Error:", data.err || "Forbidden. Check your token.");
      return;
    }

    const canvas = data.document.children[0];
    const nodes = canvas.children;

    if (!nodes || nodes.length === 0) {
      console.log("⚠️ Figma canvas is currently empty. Draw your assets (e.g. LinenRose, CapizLattice) inside 'Page 1' to extract them.");
      return;
    }

    console.log(`✅ Found ${nodes.length} nodes on canvas. Identifying components...`);
    
    const assetRegistry = {};

    for (const node of nodes) {
      console.log(`  - Found Node: ${node.name} (${node.id})`);
      
      // Request SVG from Figma API for this node
      const svgRes = await fetch(`https://api.figma.com/v1/images/${FILE_ID}?ids=${node.id}&format=svg`, { headers });
      const svgData = await svgRes.json();
      
      if (svgData.images && svgData.images[node.id]) {
        const svgUrl = svgData.images[node.id];
        // Fetch actual SVG content
        const contentRes = await fetch(svgUrl);
        const svgContent = await contentRes.text();
        
        assetRegistry[node.name] = {
          type: "FigmaAsset",
          name: node.name,
          svg: svgContent
        };
        console.log(`    ↳ Successfully extracted SVG for ${node.name}`);
      }
    }

    // Write the output to a library file
    const outputPath = path.join(__dirname, '../lib/figma-assets.json');
    fs.writeFileSync(outputPath, JSON.stringify(assetRegistry, null, 2));
    console.log(`\n🎉 Nano-Banana Sync Complete! Wrote ${Object.keys(assetRegistry).length} assets to lib/figma-assets.json`);

  } catch (err) {
    console.error("❌ Script Error:", err);
  }
}

syncFigma();
