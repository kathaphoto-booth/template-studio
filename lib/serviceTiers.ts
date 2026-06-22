export type ServiceTierId =
  | "signature-oak"
  | "editorial-oak"
  | "modernist-white"
  | "monochrome-white";

export type ServiceTier = {
  id: ServiceTierId;
  name: string;
  material: "Oak" | "White";
  price: number; // USD
  blackAndWhite: boolean;
  narrative: string;
  narrativeLong: string;
  inclusions: string[];
  hero: string;
  gallery: string[];
};

export const SERVICE_TIERS: readonly ServiceTier[] = [
  {
    id: "signature-oak",
    name: "Signature Installation",
    material: "Oak",
    price: 949,
    blackAndWhite: false,
    narrative:
      "An oak installation designed for heritage venues. Studio DSLR optics deliver full-color precision, blending seamlessly into historic spaces.",
    narrativeLong:
      "Dark oak hardware, studio-grade optics, high-fidelity color. Built to settle into historic estates and grand celebrations without intruding.",
    inclusions: [
      "Four hours, hand-operated throughout",
      "Studio DSLR sensors calibrated for true color",
      "Unlimited instant matte prints",
      "Private high-resolution gallery after",
    ],
    hero: "/installations/tier-signature.jpg",
    gallery: ["/installations/insitu-oak.jpg", "/installations/archive.jpg"],
  },
  {
    id: "editorial-oak",
    name: "Editorial Installation",
    material: "Oak",
    price: 1149,
    blackAndWhite: true,
    narrative:
      "Our flagship oak installation, designed for striking black-and-white portraiture. Rich contrast and deep shadows that demand to be printed.",
    narrativeLong:
      "Our flagship. Dark oak hardware configured for refined black-and-white frames — stark, high-contrast portraits that hold their weight for years.",
    inclusions: [
      "Four hours of black-tie portraiture",
      "Black-and-white rendering tuned for skin and shadow",
      "Unlimited archival matte prints",
      "Private high-resolution gallery after",
    ],
    hero: "/installations/tier-editorial.jpg",
    gallery: ["/installations/heirlooms.jpg", "/installations/archive.jpg"],
  },
  {
    id: "modernist-white",
    name: "Modernist Installation",
    material: "White",
    price: 749,
    blackAndWhite: false,
    narrative:
      "A minimalist white installation offering a clean, bright look. Studio DSLR optics capture full-color moments for contemporary rooms.",
    narrativeLong:
      "A sleek white shell with studio-grade optics — a clean, luminous presence for contemporary galleries and modern industrial rooms.",
    inclusions: [
      "Four hours, hand-operated throughout",
      "Bright, true-to-life color rendering",
      "Fast install with hidden power and data",
      "Unlimited instant prints + private gallery",
    ],
    hero: "/installations/tier-modernist.jpg",
    gallery: ["/installations/insitu-white.jpg", "/installations/color.jpg"],
  },
  {
    id: "monochrome-white",
    name: "Monochrome Installation",
    material: "White",
    price: 949,
    blackAndWhite: true,
    narrative:
      "A classic white installation tuned for sharp black-and-white portraiture. High-contrast prints designed for modern spaces.",
    narrativeLong:
      "White hardware tuned for refined black-and-white frames — high-contrast, razor-sharp portraits for clean-lined lofts and corporate galas.",
    inclusions: [
      "Four hours of editorial portraiture",
      "High-contrast monochrome rendering",
      "Low-footprint install, full wire containment",
      "Unlimited archival prints + private gallery",
    ],
    hero: "/installations/tier-monochrome.jpg",
    gallery: ["/installations/legacy.jpg", "/installations/archive.jpg"],
  },
] as const;

export const SERVICE_TIER_IDS = SERVICE_TIERS.map((t) => t.id);

export function getServiceTier(id: string): ServiceTier | undefined {
  return SERVICE_TIERS.find((t) => t.id === id);
}

export function isServiceTierId(id: unknown): id is ServiceTierId {
  return typeof id === "string" && SERVICE_TIERS.some((t) => t.id === id);
}
