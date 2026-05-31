// Katha Template Studio — shared template catalog (SINGLE SOURCE OF TRUTH).
// PRESETS + renderDecorativeSvg are consumed by BOTH the studio (app/page.tsx)
// and the client gallery (app/gallery/). Edit decoration HERE only — it updates
// preview, canvas export, AND the gallery thumbnails simultaneously.

// Re-export layout helpers so consumers get everything from one module.
export { LAYOUTS, SAFE_MARGIN, SLOT_GAP, VIEWBOX, getLayout, layoutsForFormat, defaultLayoutFor, resolveLayout } from "./layouts.js";

// Types
export interface PhotoboothPreset {
  id: string;
  name: string;
  type: "strip" | "postcard" | "postcard-vertical";
  // OPTIONAL — references a layout in lib/layouts.js. If omitted, the default
  // layout for `type` is used. This makes every preset render with declarative
  // slot geometry rather than hand-computed math.
  layoutId?: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  secondaryColor: string;
  fontFamily: string;
  titleText: string;
  subTitleText: string;
  dateText: string;
  slotBorderRadius: string;
  slotBorderWidth: string;
  slotGap: string;
  slotBgColor: string;
  innerSpacing: string;
  decorativeSvg: string;
  designerExplanation: string;
}

// Curated High-Fidelity 12 Wedding Templates
export const PRESETS: PhotoboothPreset[] = [
  {
    id: "wedding-luxe-gold",
    name: "Style 1 — Tradition Gold Luxe",
    type: "strip",
    backgroundColor: "#FAF6F0",
    textColor: "#1C1917",
    borderColor: "#C5A85C",
    secondaryColor: "#C5A85C",
    fontFamily: "'Cinzel', serif",
    titleText: "STEVEN & CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "NAPA VALLEY, CALIFORNIA",
    slotBorderRadius: "4px",
    slotBorderWidth: "3px",
    slotGap: "22px",
    slotBgColor: "#F4EDE3",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Double gold foil fine outline detailing. Clean Roman serif display, providing timeless heirloom appeal."
  },
  {
    id: "wedding-white-rose",
    name: "Style 2 — Minimal Linen Rose",
    type: "strip",
    backgroundColor: "#FAF9F6",
    textColor: "#292524",
    borderColor: "#EBE9E4",
    secondaryColor: "#A59E92",
    fontFamily: "'Playfair Display', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "ESTABLISHED IN NAPA VALLEY",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "24px",
    slotBgColor: "#EDEDE9",
    innerSpacing: "24px",
    decorativeSvg: "",
    designerExplanation: "Deckled ivory paper backdrop adorned with a hand-sketched classic cream and white rose nested gracefully above the text."
  },
  {
    id: "wedding-heritage-sage",
    name: "Style 3 — Heritage Sage Banner",
    type: "strip",
    backgroundColor: "#ECECE9",
    textColor: "#1C1917",
    borderColor: "#D1D1CB",
    secondaryColor: "#5E7063",
    fontFamily: "'Montserrat', sans-serif",
    titleText: "STEVEN & CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "PRESERVED ALIVE IN NAPA VALLEY",
    slotBorderRadius: "0px",
    slotBorderWidth: "2px",
    slotGap: "22px",
    slotBgColor: "#D7D7D1",
    innerSpacing: "22px",
    decorativeSvg: "",
    designerExplanation: "A beautiful fusion of traditional layout margins and a clean signature sage green bottom backdrop banner element."
  },
  {
    id: "wedding-warm-terracotta",
    name: "Style 4 — Earthen Clay Sunset",
    type: "strip",
    backgroundColor: "#8F4D39",
    textColor: "#FCFAF7",
    borderColor: "#DEC190",
    secondaryColor: "#E3CE9F",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "NAPA VALLEY ● CALIFORNIA",
    slotBorderRadius: "2px",
    slotBorderWidth: "4px",
    slotGap: "24px",
    slotBgColor: "#9A543E",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Bohemian dry terracotta sunset clay color. Accentuated by fine hairline gold rules and micro leafy contours."
  },
  {
    id: "wedding-art-deco",
    name: "Style 5 — Gatsby Midnight Gold",
    type: "strip",
    backgroundColor: "#161616",
    textColor: "#DEC190",
    borderColor: "#90774D",
    secondaryColor: "#DEC190",
    fontFamily: "'Cinzel', serif",
    titleText: "STEVEN & CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "THE GRAND PLAZA SUITE",
    slotBorderRadius: "0px",
    slotBorderWidth: "3px",
    slotGap: "20px",
    slotBgColor: "#222222",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Gatsby-era black velvet base framing interlocking linear art-deco brass-yellow chevrons and tall typography."
  },
  {
    id: "wedding-willow-vine",
    name: "Style 6 — Whispering Green Vine",
    type: "strip",
    backgroundColor: "#FAF9F5",
    textColor: "#2B3C2A",
    borderColor: "#DFE2DB",
    secondaryColor: "#6B7B61",
    fontFamily: "'Alex Brush', cursive",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "THE WILLOW CHAPEL RESORT",
    slotBorderRadius: "8px",
    slotBorderWidth: "1px",
    slotGap: "26px",
    slotBgColor: "#F3F4F1",
    innerSpacing: "25px",
    decorativeSvg: "",
    designerExplanation: "A lush garden classic featuring graceful cascading willow/eucalyptus leaves wrapping the vertical slot bounds."
  },
  {
    id: "wedding-celestial",
    name: "Style 7 — Celestial Starry Sky",
    type: "strip",
    backgroundColor: "#111422",
    textColor: "#F1EBD7",
    borderColor: "#CFC5AF",
    secondaryColor: "#DEC190",
    fontFamily: "'Aboreto', sans-serif",
    titleText: "STEVEN ♥ CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "UNDER CLOUDLESS HEAVENS",
    slotBorderRadius: "6px",
    slotBorderWidth: "1.5px",
    slotGap: "22px",
    slotBgColor: "#171B2D",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "A magical look built with fine constellation nodes, mini stars, and a hand-crafted delicate metallic gold lunar curve."
  },
  {
    id: "wedding-editorial",
    name: "Style 8 — Haute Gallery Editorial",
    type: "strip",
    backgroundColor: "#FCFCFC",
    textColor: "#121212",
    borderColor: "#E5E5E5",
    secondaryColor: "#737373",
    fontFamily: "'Italiana', serif",
    titleText: "STEVEN & CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "MUSEUM OF BRIDAL ARTS",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "30px",
    slotBgColor: "#F5F5F5",
    innerSpacing: "36px",
    decorativeSvg: "",
    designerExplanation: "Extremely spacious high-fashion gallery margins and thin borders paired with tracked wide, clean-lined display fonts."
  },
  {
    id: "wedding-tuscan-olive",
    name: "Style 9 — Tuscan Olive Branch",
    type: "strip",
    backgroundColor: "#FBF9F4",
    textColor: "#3D3933",
    borderColor: "#E6E2D8",
    secondaryColor: "#80826E",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "VILLA CORNUCOPIA, TUSCANY",
    slotBorderRadius: "2px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#F1EFEB",
    innerSpacing: "24px",
    decorativeSvg: "",
    designerExplanation: "Delicate sprigs of Italian olive branches cradled together under organic cream and vintage typewriter script."
  },
  {
    id: "wedding-vintage-lace",
    name: "Style 10 — Victorian Cream Lace",
    type: "strip",
    backgroundColor: "#F2EFE7",
    textColor: "#4E4138",
    borderColor: "#D9D1C5",
    secondaryColor: "#A39382",
    fontFamily: "'Rochester', cursive",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "HERITAGE MANOR GARDENS",
    slotBorderRadius: "4px",
    slotBorderWidth: "2px",
    slotGap: "24px",
    slotBgColor: "#EFECE3",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Fine Victorian scalloped curves and lace-like dotted alignments evoking elegant hand-crocheted silk ribbons."
  },
  {
    id: "wedding-dusty-rose",
    name: "Style 11 — Blush Watercolor Heart",
    type: "strip",
    backgroundColor: "#E2CFCA",
    textColor: "#5A4441",
    borderColor: "#C5AAA3",
    secondaryColor: "#A27A73",
    fontFamily: "'Parisienne', cursive",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "THE COZY CHALET GARDENS",
    slotBorderRadius: "8px",
    slotBorderWidth: "2px",
    slotGap: "22px",
    slotBgColor: "#EADAD5",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Delicate rosebud blush and tender calligraphic vectors coupled with beautiful love icons for a heartfelt romantic warmth."
  },
  {
    id: "wedding-royal-crest",
    name: "Style 12 — Imperial Crest Seal",
    type: "strip",
    backgroundColor: "#FCFBF8",
    textColor: "#6B5526",
    borderColor: "#D4C59B",
    secondaryColor: "#8A7342",
    fontFamily: "'Cinzel', serif",
    titleText: "S & C",
    subTitleText: "2026.07.25",
    dateText: "CASTLE HALL ESTATE",
    slotBorderRadius: "0px",
    slotBorderWidth: "2px",
    slotGap: "24px",
    slotBgColor: "#FAFAF8",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Nobility Stationery theme featuring royal gold borders and a stately circular dynamic seal design under the photo slots."
  },
  {
    id: "wedding-classic-monogram",
    name: "Style 13 — Monogram Floral Laurel",
    type: "strip",
    backgroundColor: "#FAF8F4",
    textColor: "#423E37",
    borderColor: "#DCD5C9",
    secondaryColor: "#B59E72",
    fontFamily: "'Cinzel', serif",
    titleText: "S & C",
    subTitleText: "JULY 25, 2026",
    dateText: "ESTABLISHED IN NAPA VALLEY",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#F4EFE6",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "A monogram-centered design featuring an elegant interlaced branch leaf garland and antique serif letters."
  },
  {
    id: "wedding-botanical-arch",
    name: "Style 14 — Delicate Fine-Line Arch",
    type: "strip",
    backgroundColor: "#FCFAF6",
    textColor: "#2B2D2B",
    borderColor: "#E3DFD5",
    secondaryColor: "#707A65",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "THE BOTANICAL SANCTUARY",
    slotBorderRadius: "25px 25px 0px 0px",
    slotBorderWidth: "2px",
    slotGap: "20px",
    slotBgColor: "#F5F3ED",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Canva style double fine-lined cathedral arch framing. Features high-curved slots and minimalist organic grass sprigs."
  },
  {
    id: "wedding-modern-crest",
    name: "Style 15 — Minimal Geometric Crest",
    type: "strip",
    backgroundColor: "#FAFAFA",
    textColor: "#171717",
    borderColor: "#E5E5E5",
    secondaryColor: "#D4AF37",
    fontFamily: "'Montserrat', sans-serif",
    titleText: "S & C",
    subTitleText: "JULY 25, 2026",
    dateText: "THE LUXE ATRIUM ● NAPA",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "25px",
    slotBgColor: "#F5F5F5",
    innerSpacing: "25px",
    decorativeSvg: "",
    designerExplanation: "A sharp modernist design utilizing clean hexagons and a geometric double-rule monogram crest for a sophisticated architectural layout."
  },
  {
    id: "wedding-noir-velvet",
    name: "Style 16 — Noir Velvet & Orchid",
    type: "strip",
    backgroundColor: "#111111",
    textColor: "#F7F5F0",
    borderColor: "#262626",
    secondaryColor: "#C9C4B6",
    fontFamily: "'Italiana', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "2026.07.25",
    dateText: "THE NOIR BALLROOM",
    slotBorderRadius: "4px",
    slotBorderWidth: "1.5px",
    slotGap: "22px",
    slotBgColor: "#1A1A1A",
    innerSpacing: "24px",
    decorativeSvg: "",
    designerExplanation: "Gothic couture theme wrapping photo slots in dark charcoal velvet overlays accented by organic ivory line-drawn orchids."
  },
  {
    id: "wedding-hand-painted-hydrangea",
    name: "Style 17 — Blue Hydrangea Stamp",
    type: "strip",
    backgroundColor: "#F5F7FA",
    textColor: "#1D2F45",
    borderColor: "#D2D9E2",
    secondaryColor: "#4E6E8D",
    fontFamily: "'Playfair Display', serif",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "COBALT BAY GARDENS",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "24px",
    slotBgColor: "#EAEFF5",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Charming hand-drawn blue hydrangea stems and vintage postage stamp frame grids. Perfect for classic waterside weddings."
  },
  {
    id: "wedding-interlocked-wreath",
    name: "Style 18 — Laurier Wreath Monogram",
    type: "strip",
    backgroundColor: "#FAF9F5",
    textColor: "#453D32",
    borderColor: "#EAE7DF",
    secondaryColor: "#8E7F65",
    fontFamily: "'Cinzel', serif",
    titleText: "S ● C",
    subTitleText: "07.25.26",
    dateText: "LAVENDER FIELDS ESTATE",
    slotBorderRadius: "4px",
    slotBorderWidth: "1.5px",
    slotGap: "22px",
    slotBgColor: "#F4F2EB",
    innerSpacing: "26px",
    decorativeSvg: "",
    designerExplanation: "Imperial Roman-style interlinked olive garland laurel framing the main letters. Provides a high-society stationery appeal."
  },
  {
    id: "wedding-decked-monogram",
    name: "Style 19 — Deckled Wax Seal",
    type: "strip",
    backgroundColor: "#FAF7F0",
    textColor: "#3D3A35",
    borderColor: "#DDD7CD",
    secondaryColor: "#A68D6A",
    fontFamily: "'Rochester', cursive",
    titleText: "Steven & Cristalyn",
    subTitleText: "JULY 25, 2026",
    dateText: "STONEWOOD CASTLE HEIRLOOM",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#F2ECE0",
    innerSpacing: "24px",
    decorativeSvg: "",
    designerExplanation: "Etsy bestseller deckled-edge paper base carrying an intimate calligraphic handwriting signature and simulated copper wax-seal monogram."
  },
  {
    id: "wedding-luxury-blind-deboss",
    name: "Style 20 — Blind Letterpress Deboss",
    type: "strip",
    backgroundColor: "#FAF9F6",
    textColor: "#2B2A27",
    borderColor: "#EBEAE4",
    secondaryColor: "#858175",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "STEVEN & CRISTALYN",
    subTitleText: "JULY 25, 2026",
    dateText: "THE WHITEHOUSE PALMS",
    slotBorderRadius: "2px",
    slotBorderWidth: "3px",
    slotGap: "26px",
    slotBgColor: "#FFFFFC",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "A pristine high-fidelity debossed mold layout using multi-level outer letterpress frame margins and gold-metallic hot stamp monograms."
  },
  {
    id: "rose-whisper-postcard",
    name: "Style 21 — Rose Whisper Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#FDFCFB",
    textColor: "#9E5460",
    borderColor: "#E5E5E5",
    secondaryColor: "#9E5460",
    fontFamily: "'Parisienne', cursive",
    titleText: "Maria & Jose",
    subTitleText: "",
    dateText: "",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "20px",
    slotBgColor: "#F9F9F9",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Minimalist 4x6 postcard with two stacked photos, a fine rose-gold double frame, and a delicate monogram seal above flowing Parisienne script."
  },
  // ─── KATHA SIGNATURE TIER ───────────────────────────────────────────
  // Brand-aligned templates: Katha palette (Iron Bark / Piña Ecru / Loko
  // Rust / Champagne / Capiz Sage), rooted in the three ancestral parents
  // (Barong calado, Inabel binakul, T'nalak). Symmetric by design.
  {
    id: "katha-heirloom-pina",
    name: "Katha Signature — Heirloom Piña",
    type: "strip",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#C4B59D",
    secondaryColor: "#C4B59D",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "MANILA",
    slotBorderRadius: "2px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Unbleached piña-fiber ground with a fine calado openwork divider drawn in champagne thread. Iron-bark serif set with quiet restraint."
  },
  {
    id: "katha-loom-frame",
    name: "Katha Signature — Loom Frame",
    type: "strip",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#241E1A",
    secondaryColor: "#241E1A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ILOCOS NORTE",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "A loom-frame border of nested rules and corner cross-ties, echoing the hardwood frame that holds the warp threads taut."
  },
  {
    id: "katha-knalum-night",
    name: "Katha Signature — Knalum Night",
    type: "strip",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#2A2622",
    secondaryColor: "#C4B59D",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#211D1A",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black ground from the seven-day knalum boil. Raw-fiber ecru lettering with a single loko-root rust rule — the dreamweaver's tri-color."
  },
  {
    id: "katha-brass-ring",
    name: "Katha Signature — Brass Ring",
    type: "strip",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#8C382A",
    secondaryColor: "#8C382A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "SOUTH COTABATO",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "The brass ring offered when a finished cloth leaves the loom, drawn as a single loko-rust circle beneath the names. Permission, and blessing."
  },
  {
    id: "katha-binakul-weave",
    name: "Katha Signature — Binakul Weave",
    type: "strip",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#D8CFBF",
    secondaryColor: "#5A5D5A",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ABRA",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Ilocos binakul optical weave at the corners — apotropaic geometry meant to confuse malevolent spirits, woven quietly at low contrast."
  },
  {
    id: "katha-capiz-sage",
    name: "Katha Signature — Capiz Sage",
    type: "strip",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#9FA38F",
    secondaryColor: "#6E7268",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "CAPIZ",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E4DCCE",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Capiz-shell windowpane lattice rendered in sage — the translucent pane that filters lowland light into a soft, even glow."
  },
  // ─── 4×6 VERTICAL POSTCARDS ────────────────────────────────────────────
  // 2-photo stacked. Decoration aliased to existing strip designs via
  // DECORATION_ALIASES so we don't re-author 100+ lines of SVG per design.
  {
    id: "tradition-gold-postcard",
    name: "Style 22 — Tradition Gold Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#FAF6F0",
    textColor: "#1C1917",
    borderColor: "#C5A85C",
    secondaryColor: "#C5A85C",
    fontFamily: "'Cinzel', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "NAPA VALLEY",
    slotBorderRadius: "4px",
    slotBorderWidth: "3px",
    slotGap: "24px",
    slotBgColor: "#F4EDE3",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Double gold-foil hairline frame with crisp corner accents. A 4×6 postcard distillation of the Tradition Gold strip."
  },
  {
    id: "editorial-postcard",
    name: "Style 23 — Editorial Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#FCFCFC",
    textColor: "#121212",
    borderColor: "#E5E5E5",
    secondaryColor: "#737373",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "GALLERY",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "30px",
    slotBgColor: "#F5F5F5",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Generous gallery margins with a single hairline rule and wide-tracked Italiana display. Quiet, modernist."
  },
  {
    id: "heirloom-pina-postcard",
    name: "Katha Signature — Heirloom Piña Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#C4B59D",
    secondaryColor: "#C4B59D",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "MANILA",
    slotBorderRadius: "2px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "The Heirloom Piña strip rendered as a 4×6 postcard. Piña-fiber ecru ground with a champagne double-frame and calado openwork divider."
  },
  {
    id: "loom-frame-postcard",
    name: "Katha Signature — Loom Frame Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#241E1A",
    secondaryColor: "#241E1A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ILOCOS NORTE",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Loom-frame border in iron-bark serif. Postcard variant of the Loom Frame strip."
  },
  {
    id: "knalum-night-postcard",
    name: "Katha Signature — Knalum Night Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#1A1816",
    textColor: "#EAE2D5",
    borderColor: "#2A2622",
    secondaryColor: "#C4B59D",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "LAKE SEBU",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#211D1A",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "T'nalak soil-black ground with raw-fiber ecru lettering and a single loko-root rust accent. 4×6 postcard variant."
  },
  {
    id: "brass-ring-postcard",
    name: "Katha Signature — Brass Ring Postcard",
    type: "postcard-vertical",
    layoutId: "pv-2",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#8C382A",
    secondaryColor: "#8C382A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "SOUTH COTABATO",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "24px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "The brass ring permission seal, postcard-format. A single loko-rust ring beneath the names."
  },
  // ─── 6×4 HORIZONTAL POSTCARDS ──────────────────────────────────────────
  // 3-photo row layout. Decoration aliased to existing strip designs.
  {
    id: "tradition-gold-landscape",
    name: "Style 28 — Tradition Gold Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#FAF6F0",
    textColor: "#1C1917",
    borderColor: "#C5A85C",
    secondaryColor: "#C5A85C",
    fontFamily: "'Cinzel', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "NAPA VALLEY",
    slotBorderRadius: "4px",
    slotBorderWidth: "3px",
    slotGap: "18px",
    slotBgColor: "#F4EDE3",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Tradition Gold rendered horizontal: gold-foil hairline frame, three photos in a row, formal Cinzel display."
  },
  {
    id: "linen-rose-landscape",
    name: "Style 29 — Linen Rose Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#FAF9F6",
    textColor: "#292524",
    borderColor: "#EBE9E4",
    secondaryColor: "#A59E92",
    fontFamily: "'Playfair Display', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ESTABLISHED",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "18px",
    slotBgColor: "#EDEDE9",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Linen-paper ground with a hand-sketched English rose. Landscape postcard variant — three stacked moments side by side."
  },
  {
    id: "editorial-landscape",
    name: "Style 30 — Editorial Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#FCFCFC",
    textColor: "#121212",
    borderColor: "#E5E5E5",
    secondaryColor: "#737373",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "GALLERY",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "18px",
    slotBgColor: "#F5F5F5",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Editorial gallery margins, hairline rule, wide-tracked display. Landscape postcard for cinematic three-photo storytelling."
  },
  {
    id: "botanical-arch-landscape",
    name: "Style 31 — Botanical Arch Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#FCFAF6",
    textColor: "#2B2D2B",
    borderColor: "#E3DFD5",
    secondaryColor: "#707A65",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "BOTANICAL",
    slotBorderRadius: "25px 25px 0px 0px",
    slotBorderWidth: "2px",
    slotGap: "18px",
    slotBgColor: "#F5F3ED",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Double fine-lined cathedral arch crowning three photo slots. Landscape variant of the Delicate Fine-Line Arch."
  },
  {
    id: "loom-frame-landscape",
    name: "Katha Signature — Loom Frame Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#241E1A",
    secondaryColor: "#241E1A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ILOCOS NORTE",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "18px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Loom-frame border in iron-bark serif. Landscape postcard variant for three-photo Katha events."
  },
  {
    id: "capiz-sage-landscape",
    name: "Katha Signature — Capiz Sage Landscape",
    type: "postcard",
    layoutId: "pc-3",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#9FA38F",
    secondaryColor: "#6E7268",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "CAPIZ",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "18px",
    slotBgColor: "#E4DCCE",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Capiz-shell windowpane in sage. Landscape postcard variant of the Capiz Sage signature."
  },
  // ─── L-SHAPE & INVERTED L LAYOUT VARIANTS ─────────────────────────────
  // Photos trace an L (open top-right) or Γ (open bottom-left), creating
  // editorial asymmetry without breaking the safe-margin grid.
  {
    id: "heirloom-pina-L",
    name: "Style 34 — Heirloom Piña L-Shape",
    type: "postcard-vertical",
    layoutId: "pv-L",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#C4B59D",
    secondaryColor: "#C4B59D",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "MANILA",
    slotBorderRadius: "2px",
    slotBorderWidth: "1.5px",
    slotGap: "20px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Three photos trace an L on a piña-fiber ground, with the open corner cradling a champagne calado divider."
  },
  {
    id: "loom-frame-invL",
    name: "Style 35 — Loom Frame Γ-Shape",
    type: "postcard-vertical",
    layoutId: "pv-invL",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#241E1A",
    secondaryColor: "#241E1A",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "ILOCOS NORTE",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "20px",
    slotBgColor: "#E0D7C7",
    innerSpacing: "60px",
    decorativeSvg: "",
    designerExplanation: "Inverted-L arrangement framed by the loom-bark border. The open bottom-left becomes a quiet whitespace for the names."
  },
  {
    id: "editorial-landscape-L",
    name: "Style 36 — Editorial L-Shape Landscape",
    type: "postcard",
    layoutId: "pc-L",
    backgroundColor: "#FCFCFC",
    textColor: "#121212",
    borderColor: "#E5E5E5",
    secondaryColor: "#737373",
    fontFamily: "'Italiana', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "GALLERY",
    slotBorderRadius: "0px",
    slotBorderWidth: "1px",
    slotGap: "20px",
    slotBgColor: "#F5F5F5",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Three photos trace an L on a gallery-clean ground. Hairline rule, wide-tracked Italiana display."
  },
  {
    id: "capiz-sage-invL",
    name: "Style 37 — Capiz Sage Γ-Shape Landscape",
    type: "postcard",
    layoutId: "pc-invL",
    backgroundColor: "#EAE2D5",
    textColor: "#241E1A",
    borderColor: "#9FA38F",
    secondaryColor: "#6E7268",
    fontFamily: "'Cormorant Garamond', serif",
    titleText: "Maria & Jose",
    subTitleText: "JULY 25, 2026",
    dateText: "CAPIZ",
    slotBorderRadius: "0px",
    slotBorderWidth: "1.5px",
    slotGap: "20px",
    slotBgColor: "#E4DCCE",
    innerSpacing: "28px",
    decorativeSvg: "",
    designerExplanation: "Capiz windowpane in sage. Inverted-L photo arrangement with the open corner reserved for the names."
  }
];

// ─── DECORATION ALIASES ───────────────────────────────────────────────
// New postcard variants reuse decoration logic from existing strip designs.
// Resolved at the top of renderDecorativeSvg before the switch statement.
const DECORATION_ALIASES: Record<string, string> = {
  // 4×6 vertical postcards → vertical decoration of source design
  "tradition-gold-postcard":   "wedding-luxe-gold",
  "editorial-postcard":        "wedding-editorial",
  "heirloom-pina-postcard":    "katha-heirloom-pina",
  "loom-frame-postcard":       "katha-loom-frame",
  "knalum-night-postcard":     "katha-knalum-night",
  "brass-ring-postcard":       "katha-brass-ring",
  // 6×4 landscape postcards → landscape decoration of source design
  "tradition-gold-landscape":  "wedding-luxe-gold",
  "linen-rose-landscape":      "wedding-white-rose",
  "editorial-landscape":       "wedding-editorial",
  "botanical-arch-landscape":  "wedding-botanical-arch",
  "loom-frame-landscape":      "katha-loom-frame",
  "capiz-sage-landscape":      "katha-capiz-sage",
  // L-shape & inverted-L variants reuse the source design's decoration —
  // the layout swap happens via preset.layoutId, not via decoration.
  "heirloom-pina-L":           "katha-heirloom-pina",
  "loom-frame-invL":           "katha-loom-frame",
  "editorial-landscape-L":     "wedding-editorial",
  "capiz-sage-invL":           "katha-capiz-sage",
};

export const LUXURY_FONTS = [
  { id: "cinzel", name: "Cinzel (Royal Roman)", css: "'Cinzel', serif" },
  { id: "playfair", name: "Playfair Display (Elegant Serif)", css: "'Playfair Display', serif" },
  { id: "bodoni", name: "Bodoni Moda (High Fashion Serif)", css: "'Bodoni Moda', serif" },
  { id: "cormorant", name: "Cormorant Garamond (Fine Delicate)", css: "'Cormorant Garamond', serif" },
  { id: "italiana", name: "Italiana (Geometric Roman)", css: "'Italiana', serif" },
  { id: "aboreto", name: "Aboreto (Wire-Thin Modern Capital)", css: "'Aboreto', sans-serif" },
  { id: "greatvibes", name: "Great Vibes (Soft Cursive Harmony)", css: "'Great Vibes', cursive" },
  { id: "alexbrush", name: "Alex Brush (Stately Royal Calligraphy)", css: "'Alex Brush', cursive" },
  { id: "pinyon", name: "Pinyon Script (Traditional Sloped Signature)", css: "'Pinyon Script', cursive" },
  { id: "sacramento", name: "Sacramento (Graceful Midcentury Pen)", css: "'Sacramento', cursive" },
  { id: "rochester", name: "Rochester (Antique Signage Script)", css: "'Rochester', cursive" },
  { id: "parisienne", name: "Parisienne (Flowing Parisian Romance)", css: "'Parisienne', cursive" },
  { id: "labelle", name: "La Belle Aurore (Casual Handwriting ink)", css: "'La Belle Aurore', cursive" },
  { id: "montserrat", name: "Montserrat (Clean Modernist Sans)", css: "'Montserrat', sans-serif" }
];

export const HARMONY_PALETTES = [
  {
    id: "classic-noir",
    name: "Classic Noir",
    bg: "#FAF9F5",
    text: "#1C1C1C",
    secondary: "#8A7342",
    border: "#D4CFC4",
    slotBg: "#EDEDE8",
  },
  {
    id: "royal-emerald",
    name: "Royal Emerald",
    bg: "#1E2B22",
    text: "#FAF6F0",
    secondary: "#DFCE83",
    border: "#6E7F71",
    slotBg: "#161F19",
  },
  {
    id: "terracotta-sunset",
    name: "Terracotta Sunset",
    bg: "#FBF5F0",
    text: "#3C1A14",
    secondary: "#BC6C52",
    border: "#D6C3B7",
    slotBg: "#EBE0D8",
  },
  {
    id: "midnight-onyx",
    name: "Midnight Onyx",
    bg: "#111111",
    text: "#FFFFFF",
    secondary: "#C5A85C",
    border: "#333333",
    slotBg: "#1A1A1A",
  },
  {
    id: "misty-lavender",
    name: "Misty Lavender",
    bg: "#F5F3F7",
    text: "#2C2235",
    secondary: "#8C7B99",
    border: "#D5CFDB",
    slotBg: "#EBE6EF",
  },
];

export function renderDecorativeSvg(presetId: string, type: "strip" | "postcard" | "postcard-vertical", color: string, secondaryColor: string, borderColor: string, textPosition: "bottom" | "top" = "bottom") {
  // Resolve alias FIRST so new postcard variants pick up the existing
  // decoration cases without duplicating 100+ lines of SVG.
  if (DECORATION_ALIASES[presetId]) presetId = DECORATION_ALIASES[presetId];

  const isGoldPreset = ["wedding-luxe-gold", "wedding-art-deco", "wedding-warm-terracotta", "wedding-royal-crest", "wedding-classic-monogram"].includes(presetId);
  const strokeColor = isGoldPreset ? "url(#svg-gold-shimmer)" : secondaryColor;

  const getTranslateY = (y: number, cardHeight: number): number => {
    return textPosition === "top" ? cardHeight - y : y;
  };

  const defs = `
    <defs>
      <linearGradient id="svg-gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C5A85C" />
        <stop offset="25%" stop-color="#F3E5BE" />
        <stop offset="50%" stop-color="#A58238" />
        <stop offset="75%" stop-color="#FFF3CD" />
        <stop offset="100%" stop-color="#C5A85C" />
      </linearGradient>
    </defs>
  `;

  if (type === "postcard-vertical") {
    switch (presetId) {
      case "rose-whisper-postcard":
        return defs + `
          <!-- Minimal modern double-hairline frame -->
          <rect x="24" y="24" width="1152" height="1752" fill="none" stroke="${strokeColor}" stroke-width="1.5" />
          <rect x="32" y="32" width="1136" height="1736" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.55" />
          <!-- Rose-gold monogram circle + hairline connectors in the text zone -->
          <g transform="translate(600, ${getTranslateY(1560, 1800)})" fill="none" stroke="${strokeColor}">
            <circle cx="0" cy="0" r="36" stroke-width="1" opacity="0.45" />
            <circle cx="0" cy="0" r="28" stroke-width="0.5" opacity="0.3" />
            <line x1="-200" y1="0" x2="-44" y2="0" stroke-width="0.75" opacity="0.35" />
            <line x1="44" y1="0" x2="200" y2="0" stroke-width="0.75" opacity="0.35" />
          </g>
        `;
      case "katha-heirloom-pina":
      case "katha-capiz-sage":
        return `
          <rect x="24" y="24" width="1152" height="1752" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <rect x="34" y="34" width="1132" height="1732" fill="none" stroke="${secondaryColor}" stroke-width="0.6" opacity="0.55" />
        `;
      case "katha-loom-frame":
        return `
          <rect x="22" y="22" width="1156" height="1756" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <rect x="36" y="36" width="1128" height="1728" fill="none" stroke="${secondaryColor}" stroke-width="0.9" opacity="0.7" />
        `;
      case "katha-knalum-night":
        return `
          <rect x="26" y="26" width="1148" height="1748" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.8" />
          <line x1="510" y1="${getTranslateY(1545, 1800)}" x2="690" y2="${getTranslateY(1545, 1800)}" stroke="#8C382A" stroke-width="3" />
        `;
      case "katha-brass-ring":
        return `
          <rect x="24" y="24" width="1152" height="1752" fill="none" stroke="${secondaryColor}" stroke-width="1.2" />
          <g transform="translate(600, ${getTranslateY(1560, 1800)})" fill="none" stroke="${secondaryColor}">
            <circle cx="0" cy="0" r="26" stroke-width="2.2" /><circle cx="0" cy="0" r="17" stroke-width="0.8" opacity="0.6" />
          </g>
        `;
      case "katha-binakul-weave":
        return `
          <rect x="24" y="24" width="1152" height="1752" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.55" />
          <g stroke="${secondaryColor}" fill="none" stroke-width="1" opacity="0.5">
            <g transform="translate(96,96) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(1104,96) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(96,1704) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(1104,1704) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
          </g>
        `;
      default:
        return defs + `
          <rect x="20" y="20" width="1160" height="1760" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.4" />
        `;
    }
  }

  if (type === "strip") {
    switch (presetId) {
      case "wedding-luxe-gold":
        return defs + `
          <!-- Elegant outer border lines -->
          <rect x="12" y="12" width="576" height="1776" fill="none" stroke="${strokeColor}" stroke-width="2" />
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${strokeColor}" stroke-width="0.75" opacity="0.75" />
          <!-- Deco corner triangles -->
          <line x1="12" y1="36" x2="36" y2="12" stroke="${strokeColor}" stroke-width="1.5" />
          <line x1="588" y1="36" x2="564" y2="12" stroke="${strokeColor}" stroke-width="1.5" />
          <line x1="12" y1="1764" x2="36" y2="1788" stroke="${strokeColor}" stroke-width="1.5" />
          <line x1="588" y1="1764" x2="564" y2="1788" stroke="${strokeColor}" stroke-width="1.5" />
        `;
      case "wedding-white-rose":
        return `
          <rect x="10" y="10" width="580" height="1780" fill="none" stroke="${secondaryColor}" stroke-dasharray="8 6" stroke-width="1.5" opacity="0.5" />
          <!-- White English Rose vector sprig drawing at text area -->
          <g transform="translate(430, ${getTranslateY(1420, 1800)}) scale(1.65)">
            <path d="M 12 30 C 5 22 15 15 22 24 C 28 12 40 20 32 30 C 45 32 35 48 24 40 C 15 45 8 36 12 30 Z" fill="#FFFFFF" stroke="${color}" stroke-width="1" />
            <path d="M 22 28 C 18 24 24 20 26 26 Z" fill="#FCFAF2" stroke="${color}" stroke-width="0.75" />
            <path d="M -5 32 Q 5 18 12 28" fill="none" stroke="#9A9F95" stroke-width="1" />
            <path d="M 38 42 Q 48 48 42 54" fill="none" stroke="#9A9F95" stroke-width="1" />
            <path d="M -5 32 C -10 32 -12 26 -8 24 Z" fill="#CCD1C6" />
          </g>
        `;
      case "wedding-heritage-sage":
        return `
          <!-- Structured Sage Banner text area background -->
          <rect x="0" y="${textPosition === "top" ? 0 : 1520}" width="600" height="280" fill="${secondaryColor}" />
          <!-- Sophisticated inner border with thin rules -->
          <rect x="20" y="20" width="560" height="1760" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.3" />
        `;
      case "wedding-warm-terracotta":
        return defs + `
          <rect x="15" y="15" width="570" height="1770" fill="none" stroke="${strokeColor}" stroke-width="1.5" />
          <rect x="22" y="22" width="556" height="1756" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.75" />
          <!-- Bohemian botanical leaf contour top-right -->
          <g transform="translate(460, 45) scale(1.6)" stroke="${strokeColor}" fill="none" stroke-width="1">
            <path d="M0,0 Q30,-20 60,0 Q30,20 0,0 Z" fill="${strokeColor}" opacity="0.15" />
            <path d="M0,0 C20,10 40,-10 60,0" />
            <path d="M15,2 Q22,-8 28,-3" />
            <path d="M30,-1 Q37,-11 43,-6" />
          </g>
        `;
      case "wedding-art-deco":
        return defs + `
          <!-- Art Deco concentric golden borders -->
          <rect x="14" y="14" width="572" height="1772" fill="none" stroke="${strokeColor}" stroke-width="2.5" />
          <rect x="22" y="22" width="556" height="1756" fill="none" stroke="${strokeColor}" stroke-width="1" opacity="0.8" />
          <rect x="28" y="28" width="544" height="1744" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.4" />
          <!-- Art deco chevrons in corners -->
          <g stroke="${strokeColor}" stroke-width="1.5" fill="none">
            <polyline points="14,60 60,14 100,14" />
            <polyline points="14,100 100,14" />
            <polyline points="586,60 540,14 500,14" />
            <polyline points="586,100 500,14" />
            <polyline points="14,1740 60,1786 100,1786" />
            <polyline points="14,1700 100,1786" />
            <polyline points="586,1740 540,1786 500,1786" />
            <polyline points="586,1700 500,1786" />
          </g>
        `;
      case "wedding-willow-vine":
        return `
          <!-- Soft willow branches tracing down the frame sides -->
          <g fill="none" stroke="${secondaryColor}" stroke-width="1.5">
            <path d="M 22,100 Q 5,200 20,350 T 15,600 T 25,850" />
            <path d="M 578,100 Q 595,200 580,350 T 585,600 T 575,850" />
            <path d="M 17,180 Q 5,160 12,150" fill="${secondaryColor}" opacity="0.7"/>
            <path d="M 12,250 Q 0,270 5,280" fill="${secondaryColor}" opacity="0.7"/>
            <path d="M 583,180 Q 595,160 588,150" fill="${secondaryColor}" opacity="0.7"/>
          </g>
        `;
      case "wedding-celestial":
        return `
          <!-- Constellation lines and moon in header background -->
          <g stroke="${secondaryColor}" fill="none" stroke-width="0.75" opacity="0.8">
            <circle cx="300" cy="110" r="45" stroke-dasharray="3 3" />
            <!-- Beautiful thin crescent moon -->
            <path d="M 295,85 A 30,30 0 0,0 295,145 A 24,24 0 0,1 295,85" fill="${secondaryColor}" />
            <circle cx="200" cy="90" r="1.5" fill="#FFFFFF" />
            <circle cx="400" cy="120" r="1.5" fill="#FFFFFF" />
            <circle cx="150" cy="140" r="1" fill="#FFFFFF" />
            <line x1="200" y1="90" x2="230" y2="110" stroke="${secondaryColor}" stroke-width="0.4" />
          </g>
        `;
      case "wedding-editorial":
        return `
          <!-- Extremely clean high fashion layout boundaries -->
          <rect x="36" y="36" width="528" height="1728" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <line x1="36" y1="${textPosition === "top" ? 310 : 1490}" x2="564" y2="${textPosition === "top" ? 310 : 1490}" stroke="${secondaryColor}" stroke-width="1.5" />
        `;
      case "wedding-tuscan-olive":
        return `
          <!-- Fine olive leaf sprigs draping over text area -->
          <g transform="translate(300, ${getTranslateY(1510, 1800)}) scale(1.2)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <path d="M -80, 20 Q 0, -10 80, 20" />
            <path d="M -40, 7 C -50,-2 -42,-12 -33,-4 C -25,2 -30,10 -40,7 Z" fill="${secondaryColor}" opacity="0.8" />
            <path d="M 20, 12 C 10,6 15,-5 25,0 C 35,5 30,15 20,12 Z" fill="${secondaryColor}" opacity="0.7" />
            <circle cx="-10" cy="2" r="4" fill="${secondaryColor}" />
            <circle cx="45" cy="13" r="3.5" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-vintage-lace":
        return `
          <!-- Intricate retro lace borders mapping corners -->
          <g fill="none" stroke="${secondaryColor}" stroke-width="1.5">
            <rect x="15" y="15" width="570" height="1770" stroke-dasharray="10 5" />
            <!-- Corner curves for retro look -->
            <path d="M 15,50 Q 50,50 50,15" />
            <path d="M 585,50 Q 550,50 550,15" />
            <path d="M 15,1750 Q 50,1750 50,1785" />
            <path d="M 585,1750 Q 550,1750 550,1785" />
          </g>
        `;
      case "wedding-dusty-rose":
        return `
          <!-- Double rose pink sweet contours -->
          <rect x="12" y="12" width="576" height="1776" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <!-- Small hearts at corner text areas -->
          <path d="M 40,${textPosition === "top" ? 290 : 1510} C 35,${textPosition === "top" ? 285 : 1505} 25,${textPosition === "top" ? 285 : 1505} 20,${textPosition === "top" ? 290 : 1510} C 15,${textPosition === "top" ? 295 : 1515} 15,${textPosition === "top" ? 305 : 1525} 25,${textPosition === "top" ? 315 : 1535} L 40,${textPosition === "top" ? 328 : 1548} L 55,${textPosition === "top" ? 315 : 1535} C 65,${textPosition === "top" ? 305 : 1525} 65,${textPosition === "top" ? 295 : 1515} 60,${textPosition === "top" ? 290 : 1510} C 55,${textPosition === "top" ? 285 : 1505} 45,${textPosition === "top" ? 285 : 1505} 40,${textPosition === "top" ? 290 : 1510} Z" fill="${secondaryColor}" />
          <path d="M 560,${textPosition === "top" ? 290 : 1510} C 555,${textPosition === "top" ? 285 : 1505} 545,${textPosition === "top" ? 285 : 1505} 540,${textPosition === "top" ? 290 : 1510} C 535,${textPosition === "top" ? 295 : 1515} 535,${textPosition === "top" ? 305 : 1525} 545,${textPosition === "top" ? 315 : 1535} L 560,${textPosition === "top" ? 328 : 1548} L 575,${textPosition === "top" ? 315 : 1535} C 585,${textPosition === "top" ? 305 : 1525} 585,${textPosition === "top" ? 295 : 1515} 580,${textPosition === "top" ? 290 : 1510} C 575,${textPosition === "top" ? 285 : 1505} 565,${textPosition === "top" ? 285 : 1505} 560,${textPosition === "top" ? 290 : 1510} Z" fill="${secondaryColor}" />
        `;
      case "wedding-royal-crest":
        return `
          <!-- Interlinked royal line borders -->
          <rect x="15" y="15" width="570" height="1770" fill="none" stroke="${secondaryColor}" stroke-width="3" />
          <rect x="24" y="24" width="552" height="1752" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.6" />
          <!-- Royal design crest below photos -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.15)" stroke="${secondaryColor}" fill="none" stroke-width="1.2">
            <ellipse cx="0" cy="0" rx="36" ry="26" />
            <path d="M -15, -12 L 0, -20 L 15, -12 L 10, 8 L -10, 8 Z" opacity="0.2" fill="${secondaryColor}" />
            <path d="M -44, 0 Q 0, -25 44, 0" />
            <path d="M -44, 10 Q 0, 35 44, 10" />
          </g>
        `;
      case "wedding-classic-monogram":
        return `
          <!-- Double border rules for monogram stationery -->
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <rect x="24" y="24" width="552" height="1752" fill="none" stroke="${borderColor}" stroke-width="0.75" />
          <!-- Beautiful circular floral laurel wreath centering typography -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.35)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <circle cx="0" cy="0" r="42" stroke-dasharray="3 3" opacity="0.7" />
            <path d="M -42, 0 C -42,-25 -20,-42 0,-42 C 20,-42 42,-25 42,0 C 42,25 20,42 0,42" />
            <!-- Tiny delicate floral leaf groupings -->
            <path d="M -42,-5 Q -50,-10 -42,-15" fill="${secondaryColor}" />
            <path d="M 42,-5 Q 50,-10 42,-15" fill="${secondaryColor}" />
            <path d="M -30,-30 Q -35,-38 -25,-35" fill="${secondaryColor}" />
            <path d="M 30,-30 Q 35,-38 25,-35" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-botanical-arch":
        return `
          <!-- Fine double aligned Cathedral Arches wrapping slots -->
          <path d="M 30,300 A 270,270 0 0,1 570,300 L 570,1770 L 30,1770 Z" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <path d="M 36,305 A 264,264 0 0,1 564,305 L 564,1764 L 36,1764 Z" fill="none" stroke="${secondaryColor}" stroke-width="0.75" opacity="0.6" />
          <!-- Botanical sprigs on top-most outer arch curve -->
          <g transform="translate(300, 32) scale(1.5)" stroke="${secondaryColor}" fill="none" stroke-width="1">
            <path d="M -20,20 Q 0,0 20,20" />
            <circle cx="0" cy="1" r="2.5" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-modern-crest":
        return `
          <!-- Modernist thin outer boundary -->
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${borderColor}" stroke-width="1" />
          <!-- Hexagonal thin geometry crest wrapping details -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.2)" stroke="${secondaryColor}" fill="none" stroke-width="1.5">
            <polygon points="0,-45 38,-22 38,22 0,45 -38,22 -38,-22" />
            <line x1="-38" y1="0" x2="38" y2="0" stroke="${borderColor}" stroke-width="0.5" stroke-dasharray="2 2" />
          </g>
        `;
      case "wedding-noir-velvet":
        return `
          <!-- Clean haute gold border offsets -->
          <rect x="15" y="15" width="570" height="1770" fill="none" stroke="${secondaryColor}" stroke-width="1.2" />
          <!-- Elegant abstract single line orchid stems -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.4)" fill="none" stroke="${secondaryColor}" stroke-width="1">
            <path d="M -80,45 Q 0,10 80,45" opacity="0.5" />
            <circle cx="0" cy="18" r="4" fill="${secondaryColor}" />
            <path d="M -30,25 C -40,15 -35,5 -25,12 Z" />
            <path d="M 30,25 C 40,15 35,5 25,12 Z" />
          </g>
        `;
      case "wedding-hand-painted-hydrangea":
        return `
          <!-- Outer border matching retro postage stamp frames -->
          <rect x="20" y="20" width="560" height="1760" fill="none" stroke="${borderColor}" stroke-width="1.5" />
          <!-- Soft, delicate watercolor blue hydrangea outline sketches -->
          <g transform="translate(300, ${getTranslateY(1505, 1800)}) scale(1.3)" fill="none" stroke="${secondaryColor}" stroke-width="1">
            <path d="M -70,30 C -60,0 -40,-10 -50,15 L -70,30 Z" fill="${secondaryColor}" opacity="0.2" />
            <path d="M 70,30 C 60,0 40,-10 50,15 L 70,30 Z" fill="${secondaryColor}" opacity="0.2" />
            <circle cx="0" cy="10" r="6" fill="${secondaryColor}" opacity="0.15" />
            <circle cx="-15" cy="15" r="4" fill="${secondaryColor}" opacity="0.1" />
            <circle cx="15" cy="15" r="4" fill="${secondaryColor}" opacity="0.1" />
          </g>
        `;
      case "wedding-interlocked-wreath":
        return `
          <!-- Luxury laurel wreath for monogram -->
          <rect x="15" y="15" width="570" height="1770" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.5)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <path d="M 0,-36 A 36,36 0 1,0 0,36 A 36,36 0 1,0 0,-36" stroke-dasharray="3 3" opacity="0.5" />
            <!-- Beautiful cascading branch elements -->
            <path d="M -36,0 C -36,-18 -20,-32 0,-32" />
            <path d="M 36,0 C 36,-18 20,-32 0,-32" />
            <path d="M -36,0 C -36,18 -20,32 0,32" />
            <path d="M 36,0 C 36,18 20,32 0,32" />
            <!-- Tiny laurel leaves -->
            <circle cx="-32" cy="-15" r="2.5" fill="${secondaryColor}" />
            <circle cx="32" cy="-15" r="2.5" fill="${secondaryColor}" />
            <circle cx="-32" cy="15" r="2.5" fill="${secondaryColor}" />
            <circle cx="32" cy="15" r="2.5" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-decked-monogram":
        return `
          <!-- Deckled-look border -->
          <rect x="12" y="12" width="576" height="1776" fill="none" stroke="${secondaryColor}" stroke-width="1" stroke-dasharray="20 4 4 4" />
          <!-- Vintage simulated high-dimension wax seal graphic -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.35)" fill="none" stroke="${secondaryColor}" stroke-width="1.5">
            <path d="M -35,5 C -45,35 45,35 35,5 C 25,-25 -25,-25 -35,5 Z" fill="${secondaryColor}" opacity="0.15" stroke-width="1" />
            <circle cx="0" cy="4" r="28" stroke="${secondaryColor}" stroke-width="1" />
          </g>
        `;
      case "wedding-luxury-blind-deboss":
        return `
          <!-- Beautiful 3D debossed paper effect border offset -->
          <rect x="15" y="15" width="570" height="1770" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.95" />
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.35" />
          <rect x="24" y="24" width="552" height="1752" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.5" />
          <!-- Fine stationery hot-stamp alignment crosshairs below slots -->
          <g transform="translate(300, ${getTranslateY(1515, 1800)}) scale(1.4)" stroke="${secondaryColor}" fill="none" stroke-width="1">
            <line x1="-50" y1="0" x2="-35" y2="0" stroke-width="1.5" />
            <line x1="35" y1="0" x2="50" y2="0" stroke-width="1.5" />
            <circle cx="0" cy="0" r="3" fill="${secondaryColor}" />
          </g>
        `;
      case "katha-heirloom-pina":
        return `
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <rect x="26" y="26" width="548" height="1748" fill="none" stroke="${secondaryColor}" stroke-width="0.6" opacity="0.55" />
          <g transform="translate(300, ${getTranslateY(1455, 1800)})" stroke="${secondaryColor}" stroke-width="1.4" fill="${secondaryColor}">
            <line x1="-150" y1="0" x2="-26" y2="0" stroke-dasharray="1.5 7" stroke-linecap="round" />
            <line x1="26" y1="0" x2="150" y2="0" stroke-dasharray="1.5 7" stroke-linecap="round" />
            <path d="M -16,0 L 0,-9 L 16,0 L 0,9 Z" fill="none" stroke-width="1.1" />
            <circle cx="0" cy="0" r="2.4" />
          </g>
        `;
      case "katha-loom-frame":
        return `
          <rect x="16" y="16" width="568" height="1768" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <rect x="30" y="30" width="540" height="1740" fill="none" stroke="${secondaryColor}" stroke-width="0.9" opacity="0.7" />
          <g stroke="${secondaryColor}" stroke-width="1.6">
            <line x1="16" y1="52" x2="30" y2="52" /><line x1="52" y1="16" x2="52" y2="30" />
            <line x1="584" y1="52" x2="570" y2="52" /><line x1="548" y1="16" x2="548" y2="30" />
            <line x1="16" y1="1748" x2="30" y2="1748" /><line x1="52" y1="1784" x2="52" y2="1770" />
            <line x1="584" y1="1748" x2="570" y2="1748" /><line x1="548" y1="1784" x2="548" y2="1770" />
          </g>
        `;
      case "katha-knalum-night":
        return `
          <rect x="20" y="20" width="560" height="1760" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.8" />
          <line x1="240" y1="${getTranslateY(1432, 1800)}" x2="360" y2="${getTranslateY(1432, 1800)}" stroke="#8C382A" stroke-width="2.5" />
        `;
      case "katha-brass-ring":
        return `
          <rect x="20" y="20" width="560" height="1760" fill="none" stroke="${secondaryColor}" stroke-width="1.2" />
          <g transform="translate(300, ${getTranslateY(1452, 1800)})" fill="none" stroke="${secondaryColor}">
            <circle cx="0" cy="0" r="22" stroke-width="2" />
            <circle cx="0" cy="0" r="14" stroke-width="0.75" opacity="0.6" />
          </g>
        `;
      case "katha-binakul-weave":
        return `
          <rect x="18" y="18" width="564" height="1764" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.55" />
          <g stroke="${secondaryColor}" fill="none" stroke-width="1" opacity="0.5">
            <g transform="translate(74,74) rotate(45)"><rect x="-26" y="-26" width="52" height="52" /><rect x="-17" y="-17" width="34" height="34" /><rect x="-9" y="-9" width="18" height="18" /></g>
            <g transform="translate(526,74) rotate(45)"><rect x="-26" y="-26" width="52" height="52" /><rect x="-17" y="-17" width="34" height="34" /><rect x="-9" y="-9" width="18" height="18" /></g>
            <g transform="translate(74,1726) rotate(45)"><rect x="-26" y="-26" width="52" height="52" /><rect x="-17" y="-17" width="34" height="34" /><rect x="-9" y="-9" width="18" height="18" /></g>
            <g transform="translate(526,1726) rotate(45)"><rect x="-26" y="-26" width="52" height="52" /><rect x="-17" y="-17" width="34" height="34" /><rect x="-9" y="-9" width="18" height="18" /></g>
          </g>
        `;
      case "katha-capiz-sage":
        return `
          <rect x="20" y="20" width="560" height="1760" fill="none" stroke="${secondaryColor}" stroke-width="1.2" />
          <g transform="translate(300, ${getTranslateY(1455, 1800)})" stroke="${secondaryColor}" stroke-width="1">
            <rect x="-72" y="-12" width="24" height="24" fill="${secondaryColor}" fill-opacity="0.15" />
            <rect x="-42" y="-12" width="24" height="24" fill="none" />
            <rect x="-12" y="-12" width="24" height="24" fill="${secondaryColor}" fill-opacity="0.15" />
            <rect x="18" y="-12" width="24" height="24" fill="none" />
            <rect x="48" y="-12" width="24" height="24" fill="${secondaryColor}" fill-opacity="0.15" />
          </g>
        `;
      default:
        return "";
    }
  } else {
    // Landscape Postcard 6x4 ratio: 1800 x 1200
    switch (presetId) {
      case "wedding-luxe-gold":
        return defs + `
          <!-- Concentric elegant postcard gold frame details -->
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${strokeColor}" stroke-width="4.5" />
          <rect x="36" y="36" width="1728" height="1128" fill="none" stroke="${strokeColor}" stroke-width="1.5" opacity="0.8" />
          <line x1="24" y1="72" x2="72" y2="24" stroke="${strokeColor}" stroke-width="3" />
          <line x1="1776" y1="72" x2="1728" y2="24" stroke="${strokeColor}" stroke-width="3" />
          <line x1="24" y1="1128" x2="72" y2="1176" stroke="${strokeColor}" stroke-width="3" />
          <line x1="1776" y1="1128" x2="1728" y2="1176" stroke="${strokeColor}" stroke-width="3" />
        `;
      case "wedding-white-rose":
        return `
          <rect x="22" y="22" width="1756" height="1156" fill="none" stroke="${secondaryColor}" stroke-width="1.5" stroke-dasharray="15 10" opacity="0.6" />
          <!-- Vintage English Rose nestled inside right text area -->
          <g transform="translate(1600, ${getTranslateY(920, 1200)}) scale(2.8)">
            <path d="M 12 30 C 5 22 15 15 22 24 C 28 12 40 20 32 30 C 45 32 35 48 24 40 C 15 45 8 36 12 30 Z" fill="#FFFFFF" stroke="${color}" stroke-width="1" />
            <path d="M 22 28 C 18 24 24 20 26 26 Z" fill="#FCFAF2" stroke="${color}" stroke-width="0.75" />
            <path d="M -5 32 Q 5 18 12 28" fill="none" stroke="#9A9F95" stroke-width="0.8" />
            <path d="M 38 42 Q 48 48 42 54" fill="none" stroke="#9A9F95" stroke-width="0.8" />
          </g>
        `;
      case "wedding-heritage-sage":
        return `
          <!-- Sage block for postcard -->
          <rect x="0" y="${textPosition === "top" ? 0 : 930}" width="1800" height="270" fill="${secondaryColor}" />
          <!-- Sophisticated postcard boundary outline -->
          <rect x="36" y="36" width="1728" height="1128" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.25" />
        `;
      case "wedding-warm-terracotta":
        return defs + `
          <rect x="25" y="25" width="1750" height="1150" fill="none" stroke="${strokeColor}" stroke-width="3" />
          <rect x="38" y="38" width="1724" height="1124" fill="none" stroke="${strokeColor}" stroke-width="1" opacity="0.75" />
          <g transform="translate(1620, 90) scale(2.5)" stroke="${strokeColor}" fill="none" stroke-width="1.2">
            <path d="M0,0 Q30,-20 60,0 Q30,20 0,0 Z" fill="${strokeColor}" opacity="0.15" />
            <path d="M0,0 C20,10 40,-10 60,0" />
          </g>
        `;
      case "wedding-art-deco":
        return defs + `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${strokeColor}" stroke-width="4" />
          <rect x="36" y="36" width="1728" height="1128" fill="none" stroke="${strokeColor}" stroke-width="1.5" opacity="0.85" />
          <g stroke="${strokeColor}" stroke-width="2.5" fill="none">
            <polyline points="24,120 120,24 200,24" />
            <polyline points="1776,120 1680,24 1600,24" />
            <polyline points="24,1080 120,1176 200,1176" />
            <polyline points="1776,1080 1680,1176 1600,1176" />
          </g>
        `;
      case "wedding-willow-vine":
        return `
          <!-- Delicate Eucalyptus branches tracing top and bottom for Postcards -->
          <g fill="none" stroke="${secondaryColor}" stroke-width="2.2" opacity="0.85">
            <path d="M 120,36 Q 400,15 900,30 T 1680,36" />
            <path d="M 170,1164 Q 500,1185 900,1170 T 1630,1164" />
            <!-- Little willow leaf designs -->
            <path d="M 320,28 Q 300,5 290,12" fill="${secondaryColor}" />
            <path d="M 850,30 Q 840,55 860,50" fill="${secondaryColor}" />
            <path d="M 640,1172 Q 650,1145 630,1150" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-celestial":
        return `
          <g stroke="${secondaryColor}" fill="none" stroke-width="1" opacity="0.9">
            <!-- Glowing Moon & Celestial Star alignments left / right corner -->
            <g transform="translate(180, ${getTranslateY(1025, 1200)}) scale(1.3)">
              <circle cx="0" cy="0" r="30" stroke-dasharray="4 4" />
              <path d="M -5,-15 A 20,20 0 0,0 -5,25 A 16,16 0 0,1 -5,-15" fill="${secondaryColor}" />
            </g>
            <circle cx="160" cy="${textPosition === "top" ? 250 : 950}" r="2.5" fill="#FFFFFF" />
            <circle cx="210" cy="${textPosition === "top" ? 100 : 1100}" r="2" fill="#FFFFFF" />
            <circle cx="1620" cy="${textPosition === "top" ? 220 : 980}" r="2" fill="#FFFFFF" />
            <line x1="160" y1="${textPosition === "top" ? 250 : 950}" x2="210" y2="${textPosition === "top" ? 100 : 1100}" stroke="${secondaryColor}" stroke-width="0.5" />
          </g>
        `;
      case "wedding-editorial":
        return `
          <rect x="42" y="42" width="1716" height="1116" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <line x1="42" y1="${textPosition === "top" ? 290 : 910}" x2="1758" y2="${textPosition === "top" ? 290 : 910}" stroke="${secondaryColor}" stroke-width="2" />
        `;
      case "wedding-tuscan-olive":
        return `
          <g transform="translate(900, ${getTranslateY(915, 1200)}) scale(1.6)" fill="none" stroke="${secondaryColor}" stroke-width="1.5">
            <path d="M -120, 20 Q 0, -10 120, 20" />
            <path d="M -60, 8 C -72,-2 -60,-15 -50,-6 C -40,3 -48,15 -60,8 Z" fill="${secondaryColor}" opacity="0.8" />
            <path d="M 40, 14 C 28,6 35,-6 45,0 C 55,6 50,18 40,14 Z" fill="${secondaryColor}" opacity="0.7" />
            <circle cx="-10" cy="3" r="5.5" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-vintage-lace":
        return `
          <g fill="none" stroke="${secondaryColor}" stroke-width="2">
            <rect x="25" y="25" width="1750" height="1150" stroke-dasharray="16 8" />
            <path d="M 25,100 Q 100,100 100,25" />
            <path d="M 1775,100 Q 1700,100 1700,25" />
            <path d="M 25,1100 Q 100,1100 100,1175" />
            <path d="M 1775,1100 Q 1700,1100 1700,1175" />
          </g>
        `;
      case "wedding-dusty-rose":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="2.5" />
          <path d="M 100,${textPosition === "top" ? 165 : 1035} C 92,${textPosition === "top" ? 155 : 1025} 78,${textPosition === "top" ? 155 : 1025} 70,${textPosition === "top" ? 165 : 1035} C 60,${textPosition === "top" ? 175 : 1045} 60,${textPosition === "top" ? 190 : 1060} 78,${textPosition === "top" ? 205 : 1075} L 100,${textPosition === "top" ? 225 : 1095} L 122,${textPosition === "top" ? 205 : 1075} C 140,${textPosition === "top" ? 190 : 1060} 140,${textPosition === "top" ? 175 : 1045} 130,${textPosition === "top" ? 165 : 1035} C 122,${textPosition === "top" ? 155 : 1025} 108,${textPosition === "top" ? 155 : 1025} 100,${textPosition === "top" ? 165 : 1035} Z" fill="${secondaryColor}" />
          <path d="M 1700,${textPosition === "top" ? 165 : 1035} C 1692,${textPosition === "top" ? 155 : 1025} 1678,${textPosition === "top" ? 155 : 1025} 1670,${textPosition === "top" ? 165 : 1035} C 1660,${textPosition === "top" ? 175 : 1045} 1660,${textPosition === "top" ? 190 : 1060} 1678,${textPosition === "top" ? 205 : 1075} L 1700,${textPosition === "top" ? 225 : 1095} L 1722,${textPosition === "top" ? 205 : 1075} C 1740,${textPosition === "top" ? 190 : 1060} 1740,${textPosition === "top" ? 175 : 1045} 1730,${textPosition === "top" ? 165 : 1035} Z" fill="${secondaryColor}" opacity="0.9" />
        `;
      case "wedding-royal-crest":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="4.5" />
          <g transform="translate(900, ${getTranslateY(915, 1200)}) scale(1.5)" stroke="${secondaryColor}" fill="none" stroke-width="1.5">
            <ellipse cx="0" cy="0" rx="45" ry="32" />
            <path d="M -50, 0 Q 0, -30 50, 0" />
            <path d="M -50, 15 Q 0, 45 50, 15" />
          </g>
        `;
      case "wedding-classic-monogram":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="3" />
          <rect x="32" y="32" width="1736" height="1136" fill="none" stroke="${borderColor}" stroke-width="0.75" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.6)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <circle cx="0" cy="0" r="42" stroke-dasharray="3 3" opacity="0.75" />
            <path d="M -42, 0 C -42,-25 -20,-42 0,-42 C 20,-42 42,-25 42,0 C 42,25 20,42 0,42" />
          </g>
        `;
      case "wedding-botanical-arch":
        return `
          <path d="M 50,250 A 400,400 0 0,1 1750,250 L 1750,1150 L 50,1150 Z" fill="none" stroke="${secondaryColor}" stroke-width="3" />
          <path d="M 60,258 A 390,390 0 0,1 1740,258 L 1740,1140 L 60,1140 Z" fill="none" stroke="${secondaryColor}" stroke-width="0.75" opacity="0.6" />
        `;
      case "wedding-modern-crest":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${borderColor}" stroke-width="1.2" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.5)" stroke="${secondaryColor}" fill="none" stroke-width="1.5">
            <polygon points="0,-45 38,-22 38,22 0,45 -38,22 -38,-22" />
          </g>
        `;
      case "wedding-noir-velvet":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.5)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <path d="M -80,45 Q 0,10 80,45" opacity="0.5" />
            <circle cx="0" cy="18" r="4.5" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-hand-painted-hydrangea":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${borderColor}" stroke-width="2" />
          <g transform="translate(900, ${getTranslateY(1010, 1200)}) scale(1.5)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <circle cx="0" cy="5" r="7" fill="${secondaryColor}" opacity="0.2" />
            <circle cx="-15" cy="10" r="5" fill="${secondaryColor}" opacity="0.15" />
            <circle cx="15" cy="10" r="5" fill="${secondaryColor}" opacity="0.15" />
          </g>
        `;
      case "wedding-interlocked-wreath":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="2.5" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.6)" fill="none" stroke="${secondaryColor}" stroke-width="1.2">
            <path d="M 0,-36 A 36,36 0 1,0 0,36 A 36,36 0 1,0 0,-36" stroke-dasharray="3 3" opacity="0.6" />
            <circle cx="-32" cy="-15" r="3" fill="${secondaryColor}" />
            <circle cx="32" cy="-15" r="3" fill="${secondaryColor}" />
          </g>
        `;
      case "wedding-decked-monogram":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="1" stroke-dasharray="25 6" opacity="0.8" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.5)" fill="none" stroke="${secondaryColor}" stroke-width="1.5">
            <path d="M -35,5 C -45,35 45,35 35,5 C 25,-25 -25,-25 -35,5 Z" fill="${secondaryColor}" opacity="0.16" />
          </g>
        `;
      case "wedding-luxury-blind-deboss":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.95" />
          <rect x="32" y="32" width="1736" height="1136" fill="none" stroke="${secondaryColor}" stroke-width="1.2" opacity="0.3" />
          <g transform="translate(900, ${getTranslateY(1020, 1200)}) scale(1.5)" stroke="${secondaryColor}" fill="none" stroke-width="1.2">
            <line x1="-50" y1="0" x2="-35" y2="0" stroke-width="2" />
            <line x1="35" y1="0" x2="50" y2="0" stroke-width="2" />
          </g>
        `;
      case "katha-heirloom-pina":
      case "katha-capiz-sage":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="1.5" />
          <rect x="34" y="34" width="1732" height="1132" fill="none" stroke="${secondaryColor}" stroke-width="0.6" opacity="0.55" />
        `;
      case "katha-loom-frame":
        return `
          <rect x="22" y="22" width="1756" height="1156" fill="none" stroke="${secondaryColor}" stroke-width="2" />
          <rect x="36" y="36" width="1728" height="1128" fill="none" stroke="${secondaryColor}" stroke-width="0.9" opacity="0.7" />
        `;
      case "katha-knalum-night":
        return `
          <rect x="26" y="26" width="1748" height="1148" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.8" />
          <line x1="810" y1="${getTranslateY(1045, 1200)}" x2="990" y2="${getTranslateY(1045, 1200)}" stroke="#8C382A" stroke-width="3" />
        `;
      case "katha-brass-ring":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="1.2" />
          <g transform="translate(900, ${getTranslateY(1055, 1200)})" fill="none" stroke="${secondaryColor}">
            <circle cx="0" cy="0" r="26" stroke-width="2.2" /><circle cx="0" cy="0" r="17" stroke-width="0.8" opacity="0.6" />
          </g>
        `;
      case "katha-binakul-weave":
        return `
          <rect x="24" y="24" width="1752" height="1152" fill="none" stroke="${secondaryColor}" stroke-width="1" opacity="0.55" />
          <g stroke="${secondaryColor}" fill="none" stroke-width="1" opacity="0.5">
            <g transform="translate(96,96) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(1704,96) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(96,1104) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
            <g transform="translate(1704,1104) rotate(45)"><rect x="-32" y="-32" width="64" height="64" /><rect x="-21" y="-21" width="42" height="42" /><rect x="-11" y="-11" width="22" height="22" /></g>
          </g>
        `;
      default:
        return "";
    }
  }
}
