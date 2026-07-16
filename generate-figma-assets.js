import fs from 'fs';

const assets = {
  DeckledWaxSeal: {
    type: "FigmaAsset",
    name: "DeckledWaxSeal",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 5 C 20 10 5 30 10 60 C 15 90 40 95 70 85 C 95 75 100 40 85 15 C 70 -5 60 0 50 5 Z" fill="#8C382A" opacity="0.8" /><circle cx="48" cy="52" r="30" fill="none" stroke="#C4B59D" stroke-width="1.5" opacity="0.8"/><path d="M 40 45 L 50 65 L 60 45" fill="none" stroke="#C4B59D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/></svg>`
  },
  LinenRose: {
    type: "FigmaAsset",
    name: "LinenRose",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 20 C 30 20 20 40 35 60 C 45 75 75 75 80 50 C 85 25 65 20 50 20 Z" fill="#EAE2D5" stroke="#C4B59D" stroke-width="1.5"/><path d="M 40 40 C 45 35 55 35 60 40 C 65 45 60 55 50 60 C 40 55 35 45 40 40 Z" fill="none" stroke="#C4B59D" stroke-width="1.5"/><path d="M 50 45 C 52 48 48 52 50 55" fill="none" stroke="#C4B59D" stroke-width="1"/></svg>`
  },
  CapizLattice: {
    type: "FigmaAsset",
    name: "CapizLattice",
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="180" height="180" fill="none" stroke="#B5B8A3" stroke-width="2" opacity="0.8"/><line x1="70" y1="10" x2="70" y2="190" stroke="#B5B8A3" stroke-width="1.5" opacity="0.6"/><line x1="130" y1="10" x2="130" y2="190" stroke="#B5B8A3" stroke-width="1.5" opacity="0.6"/><line x1="10" y1="70" x2="190" y2="70" stroke="#B5B8A3" stroke-width="1.5" opacity="0.6"/><line x1="10" y1="130" x2="190" y2="130" stroke="#B5B8A3" stroke-width="1.5" opacity="0.6"/><rect x="15" y="15" width="50" height="50" fill="#EAE2D5" opacity="0.1"/><rect x="75" y="75" width="50" height="50" fill="#EAE2D5" opacity="0.2"/><rect x="135" y="135" width="50" height="50" fill="#EAE2D5" opacity="0.1"/></svg>`
  },
  BotanicalArch: {
    type: "FigmaAsset",
    name: "BotanicalArch",
    svg: `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg"><path d="M 20 300 L 20 100 A 80 80 0 0 1 180 100 L 180 300" fill="none" stroke="#241E1A" stroke-width="2.5" opacity="0.8"/><path d="M 30 300 L 30 110 A 70 70 0 0 1 170 110 L 170 300" fill="none" stroke="#241E1A" stroke-width="1" opacity="0.5"/><path d="M 100 20 C 110 40 90 60 100 80 C 110 60 130 40 100 20 Z" fill="#B5B8A3" opacity="0.8"/></svg>`
  },
  EditorialVoidDivider: {
    type: "FigmaAsset",
    name: "EditorialVoidDivider",
    svg: `<svg viewBox="0 0 300 20" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="130" y2="10" stroke="#111112" stroke-width="1.5"/><circle cx="150" cy="10" r="3" fill="#111112"/><line x1="170" y1="10" x2="300" y2="10" stroke="#111112" stroke-width="1.5"/></svg>`
  },
  HeirloomPinaPattern: {
    type: "FigmaAsset",
    name: "HeirloomPinaPattern",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="0" x2="20" y2="100" stroke="#C4B59D" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.6"/><line x1="50" y1="0" x2="50" y2="100" stroke="#C4B59D" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.6"/><line x1="80" y1="0" x2="80" y2="100" stroke="#C4B59D" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.6"/><line x1="0" y1="30" x2="100" y2="30" stroke="#C4B59D" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.6"/><line x1="0" y1="70" x2="100" y2="70" stroke="#C4B59D" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.6"/><circle cx="50" cy="50" r="1.5" fill="#C4B59D" opacity="0.8"/></svg>`
  },
  WovenSilkMotif: {
    type: "FigmaAsset",
    name: "WovenSilkMotif",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 50 L 50 10 L 90 50 L 50 90 Z" fill="none" stroke="#C4B59D" stroke-width="1.5" opacity="0.8"/><path d="M 25 50 L 50 25 L 75 50 L 50 75 Z" fill="none" stroke="#C4B59D" stroke-width="1" opacity="0.5"/><circle cx="50" cy="50" r="4" fill="#C4B59D" opacity="0.9"/></svg>`
  }
};

fs.writeFileSync('lib/figma-assets.json', JSON.stringify(assets, null, 2));
console.log('Created lib/figma-assets.json');
