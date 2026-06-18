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
  inclusions: string[];
  heroMedia?: string; // path to hero video or image
  galleryMedia?: string; // path to gallery image or video
};

export const SERVICE_TIERS: readonly ServiceTier[] = [
  {
    id: "signature-oak",
    name: "Signature Installation",
    material: "Oak",
    price: 949,
    blackAndWhite: false,
    narrative:
      "A timeless oak experience curated for heritage venues. Studio DSLR optics deliver full-color precision, blending seamlessly into historic spaces.",
    inclusions: [
      "Four hours of continuous portraiture",
      "Studio DSLR sensors calibrated for true-to-life color",
      "Early arrival, clean install, no exposed cabling",
      "One installation director guiding composition and light",
      "Unlimited instant matte prints",
      "Private high-resolution gallery after the event",
    ],
    heroMedia: "/media/hero-signature.mp4",
    galleryMedia: "/media/gallery-signature.jpg",
  },
  {
    id: "editorial-oak",
    name: "Editorial Installation",
    material: "Oak",
    price: 1149,
    blackAndWhite: true,
    narrative:
      "Our flagship oak experience, curated for striking black-and-white portraiture. Timeless contrast and deep shadows that demand to be printed.",
    inclusions: [
      "Four hours of black-tie portraiture",
      "Black-and-white rendering tuned for luminous skin and deep shadow",
      "Full site integration, precise hardware mapping, no exposed cabling",
      "One installation director managing the light space",
      "Unlimited instant archival black-and-white matte prints",
      "Private high-resolution gallery after the event",
    ],
    heroMedia: "/media/hero-editorial.mp4",
    galleryMedia: "/media/gallery-editorial.jpg",
  },
  {
    id: "modernist-white",
    name: "Modernist Installation",
    material: "White",
    price: 749,
    blackAndWhite: false,
    narrative:
      "A minimalist white installation curating a clean, bright experience. Studio DSLR optics capture full-color moments for contemporary rooms.",
    inclusions: [
      "Four hours of continuous portraiture",
      "Studio DSLR sensors tuned for bright, sharp color",
      "Fast install with hidden power and data routing",
      "One installation director holding grid symmetry",
      "Unlimited instant matte prints",
      "Private high-resolution gallery after the event",
    ],
    heroMedia: "/media/hero-modernist.mp4",
    galleryMedia: "/media/gallery-modernist.jpg",
  },
  {
    id: "monochrome-white",
    name: "Monochrome Installation",
    material: "White",
    price: 949,
    blackAndWhite: true,
    narrative:
      "A timeless white installation tuned for sharp black-and-white portraiture. High-contrast experiences curated for modern spaces.",
    inclusions: [
      "Four hours of editorial portraiture",
      "High-contrast black-and-white rendering that sharpens facial structure",
      "Low-footprint install with full wire containment",
      "One installation director directing guest movement",
      "Unlimited instant high-contrast matte prints",
      "Private high-resolution gallery after the event",
    ],
    heroMedia: "/media/hero-monochrome.mp4",
    galleryMedia: "/media/gallery-monochrome.jpg",
  },
] as const;

export const SERVICE_TIER_IDS = SERVICE_TIERS.map((t) => t.id);

export function getServiceTier(id: string): ServiceTier | undefined {
  return SERVICE_TIERS.find((t) => t.id === id);
}

export function isServiceTierId(id: unknown): id is ServiceTierId {
  return typeof id === "string" && SERVICE_TIERS.some((t) => t.id === id);
}
