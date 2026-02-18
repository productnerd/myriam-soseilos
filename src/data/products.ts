import { CollectionSlug } from "./collections";
import { MediaItem } from "@/components/ui/Media";

export type Product = {
  slug: string;
  name: string;
  price: number;
  currency: "GBP";
  sku: string;
  collection: CollectionSlug;
  category: "necklaces" | "rings";
  description: string;
  materials: string[];
  gems: string[];
  metalColor: string;
  images: MediaItem[];
};

const IMG_BASE = "https://myriamsos.co.uk/wp-content/uploads/2024/02";

export const products: Product[] = [
  {
    slug: "constellations-triangle-pendant",
    name: "Constellations Triangle Pendant",
    price: 3640,
    currency: "GBP",
    sku: "CD-Pendant-CT-WG-WS",
    collection: "cosmic-dust",
    category: "necklaces",
    description:
      "The Cosmic Dust collection features a beautiful array of stars, planets and constellations with an added air of glamour and allure. Constellations triangle pendant, shown in white gold with white sapphires.",
    materials: ["White Gold"],
    gems: ["White Sapphires"],
    metalColor: "White Gold",
    images: [
      {
        src: `${IMG_BASE}/CD_P_Triangle_WG_WS_PWD_P-scaled-1.webp`,
        alt: "Constellations Triangle Pendant - front view",
      },
    ],
  },
  {
    slug: "osmium-pendant",
    name: "Osmium Pendant",
    price: 3200,
    currency: "GBP",
    sku: "CD_Pendant_O_WG_WS/O",
    collection: "cosmic-dust",
    category: "necklaces",
    description:
      "Osmium pendant from the Cosmic Dust collection, shown in white gold with osmium and white sapphires. A celestial piece that captures the essence of the cosmos.",
    materials: ["White Gold", "Osmium"],
    gems: ["White Sapphires"],
    metalColor: "White Gold",
    images: [
      {
        src: `${IMG_BASE}/CD_P_Osmium_WG_O_WS_P1.webp`,
        alt: "Osmium Pendant - front view",
      },
      {
        src: `${IMG_BASE}/CD_P_Osmium_WG_O_WS_P2.webp`,
        alt: "Osmium Pendant - detail view",
      },
    ],
  },
  {
    slug: "aquilla-ring",
    name: "Aquilla Ring",
    price: 1225,
    currency: "GBP",
    sku: "OW-Ring-A-RG",
    collection: "otherworldly",
    category: "rings",
    description:
      "From the Otherworldly collection, the Aquilla ring epitomizes an architectural discipline playing with minimalism, space and movement. Shown in rose gold.",
    materials: ["Rose Gold"],
    gems: [],
    metalColor: "Rose Gold",
    images: [
      {
        src: `${IMG_BASE}/Aquilla-ring-PRODUCT.webp`,
        alt: "Aquilla Ring",
      },
    ],
  },
  {
    slug: "aurora-ring",
    name: "Aurora Ring",
    price: 3900,
    currency: "GBP",
    sku: "OW-Ring-A-RG-WS/PWD",
    collection: "otherworldly",
    category: "rings",
    description:
      "The Aurora ring from the Otherworldly collection features asymmetric lines and dynamic curvatures. Shown in rose gold with white sapphires and a princess cut white diamond.",
    materials: ["Rose Gold"],
    gems: ["White Sapphires", "Princess Cut White Diamond"],
    metalColor: "Rose Gold",
    images: [
      {
        src: `${IMG_BASE}/OW_R_Aurora_RG_WS_PWD_P2-scaled-1.webp`,
        alt: "Aurora Ring",
      },
    ],
  },
  {
    slug: "side-finger-triangle-ring",
    name: "Side Finger Triangle Ring",
    price: 1650,
    currency: "GBP",
    sku: "SL-Ring-SFT-RG-P",
    collection: "skyline",
    category: "rings",
    description:
      "From the Skyline collection, inspired by architecture, spiral shapes and clean geometric lines. Side Finger Triangle ring, shown in rose gold with citrine.",
    materials: ["Rose Gold"],
    gems: ["Citrine"],
    metalColor: "Rose Gold",
    images: [
      {
        src: `${IMG_BASE}/S_R_SideFingerTriangle_RG_C_P-scaled-1.webp`,
        alt: "Side Finger Triangle Ring - product view",
      },
      {
        src: `${IMG_BASE}/S_R_SideFingerTriangle_RG_C_M.webp`,
        alt: "Side Finger Triangle Ring - worn view",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(
  collection: CollectionSlug
): Product[] {
  return products.filter((p) => p.collection === collection);
}
