export type ServiceTierId =
  | "signature-oak"
  | "editorial-oak"
  | "modernist-white"
  | "monochrome-white";

export type ServiceTier = {
  id: ServiceTierId;
  name: string;
  architecture: "Oak" | "White";
  price: number; // USD
  blackAndWhite: boolean;
  narrative: string;
  inclusions: string[];
};

export const SERVICE_TIERS: readonly ServiceTier[] = [
  {
    id: "signature-oak",
    name: "Signature Installation",
    architecture: "Oak",
    price: 949,
    blackAndWhite: false,
    narrative:
      "Weathered oak hardware with studio DSLR optics and full-color calibration. Built to sit inside heritage venues and historic estates without asking for attention.",
    inclusions: [
      "Four hours of continuous portraiture",
      "Studio DSLR sensors calibrated for true-to-life color",
      "Early arrival, clean install, no exposed cabling",
      "One installation director guiding composition and light",
      "Unlimited instant matte prints",
      "Private high-resolution gallery after the event",
    ],
  },
  {
    id: "editorial-oak",
    name: "Editorial Installation",
    architecture: "Oak",
    price: 1149,
    blackAndWhite: true,
    narrative:
      "The flagship oak configuration, set to a black-and-white skin-rendering profile. Stark, high-contrast portraiture that holds up in print.",
    inclusions: [
      "Four hours of black-tie portraiture",
      "Black-and-white rendering tuned for luminous skin and deep shadow",
      "Full site integration, precise hardware mapping, no exposed cabling",
      "One installation director managing the light space",
      "Unlimited instant archival black-and-white matte prints",
      "Private high-resolution gallery after the event",
    ],
  },
  {
    id: "modernist-white",
    name: "Modernist Installation",
    architecture: "White",
    price: 749,
    blackAndWhite: false,
    narrative:
      "A minimalist white chassis with studio DSLR optics and full-color calibration. A clean, bright presence for contemporary galleries and industrial rooms.",
    inclusions: [
      "Four hours of continuous portraiture",
      "Studio DSLR sensors tuned for bright, sharp color",
      "Fast install with hidden power and data routing",
      "One installation director holding grid symmetry",
      "Unlimited instant matte prints",
      "Private high-resolution gallery after the event",
    ],
  },
  {
    id: "monochrome-white",
    name: "Monochrome Installation",
    architecture: "White",
    price: 949,
    blackAndWhite: true,
    narrative:
      "White hardware set to a black-and-white rendering profile. High-contrast, sharp portraiture for clean lines and modern rooms.",
    inclusions: [
      "Four hours of editorial portraiture",
      "High-contrast black-and-white rendering that sharpens facial structure",
      "Low-footprint install with full wire containment",
      "One installation director directing guest movement",
      "Unlimited instant high-contrast matte prints",
      "Private high-resolution gallery after the event",
    ],
  },
] as const;

export const SERVICE_TIER_IDS = SERVICE_TIERS.map((t) => t.id);

export function getServiceTier(id: string): ServiceTier | undefined {
  return SERVICE_TIERS.find((t) => t.id === id);
}

export function isServiceTierId(id: unknown): id is ServiceTierId {
  return typeof id === "string" && SERVICE_TIERS.some((t) => t.id === id);
}
