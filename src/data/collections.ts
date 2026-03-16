export type CollectionSlug =
  | "transformers"
  | "otherworldly"
  | "skyline"
  | "cosmic-dust"
  | "jagged"
  | "naked-square"
  | "sosie"
  | "error-01";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  coverImage?: string;
};

export const collections: Collection[] = [
  {
    slug: "transformers",
    name: "Transformers",
    tagline: "Jewellery that does something",
    description:
      "The Transformer collection is driven by one question: what else could it do? Pieces that rotate, expand, reverse and reconfigure — fine jewellery with mechanical complications that challenge what a ring, pendant or earring can be.",
  },
  {
    slug: "otherworldly",
    name: "Otherworldly",
    tagline: "Asymmetric lines and dynamic curvatures",
    description:
      "Focusing on asymmetric lines and dynamic curvatures, the Otherworldly collection epitomizes an architectural discipline playing with minimalism, space and movement.",
  },
  {
    slug: "skyline",
    name: "Skyline",
    tagline: "Architecture, spiral shapes and geometric lines",
    description:
      "Reminiscent of grand cities, the Skyline collection is inspired by architecture, spiral shapes and clean geometric lines.",
  },
  {
    slug: "cosmic-dust",
    name: "Cosmic Dust",
    tagline: "Stars, planets and constellations",
    description:
      "The Cosmic Dust collection features a beautiful array of stars, planets and constellations, with an added air of glamour and allure. Presented in white gold with a mix of precious stones.",
    coverImage: "/images/products/cover-cosmic-dust.jpg",
  },
  {
    slug: "jagged",
    name: "Jagged",
    tagline: "Sharp angles and crystalline geometry",
    description:
      "The Jagged collection plays with sharp, crystalline forms — stick shapes, clusters and angular geometry set with sapphires, spinels and diamonds. Pieces that catch the light from every angle.",
    coverImage: "/images/products/cover-jagged.jpg",
  },
  {
    slug: "naked-square",
    name: "Naked Square",
    tagline: "Raw square forms and open structures",
    description:
      "The Naked Square collection strips jewellery back to its geometric essence — open square forms, crosses and twisted eternity shapes in rose gold, white gold and black rhodium.",
    coverImage: "/images/products/cover-naked-square.jpg",
  },
  {
    slug: "sosie",
    name: "Sos!e",
    tagline: "Everyday wearable colour",
    description:
      "The Sos!e collection brings colour and playfulness to everyday wear — side finger triangles, friendship bracelets and coloured gemstone rings in rose gold and silver.",
  },
  {
    slug: "error-01",
    name: "Error 01",
    tagline: "",
    description: "",
    coverImage: "/images/products/cover-error-01.jpg",
  },
];

export function getCollectionBySlug(
  slug: CollectionSlug
): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
