export type CollectionSlug = "cosmic-dust" | "otherworldly" | "skyline";

export type Collection = {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
};

export const collections: Collection[] = [
  {
    slug: "cosmic-dust",
    name: "Cosmic Dust",
    tagline: "Stars, planets and constellations",
    description:
      "The Cosmic Dust collection features a beautiful array of stars, planets and constellations, with an added air of glamour and allure. Presented in white gold and with a mix of precious stones.",
  },
  {
    slug: "otherworldly",
    name: "Otherworldly",
    tagline: "Asymmetric lines and dynamic curvatures",
    description:
      "Focusing on asymmetric lines and dynamic curvatures, the Otherworldly Collection epitomizes an architectural discipline playing with minimalism, space and movement.",
  },
  {
    slug: "skyline",
    name: "Skyline",
    tagline: "Architecture, spiral shapes and geometric lines",
    description:
      "Reminiscent of grand cities, the Skyline collection is inspired by architecture, spiral shapes and clean geometric lines.",
  },
];

export function getCollectionBySlug(
  slug: CollectionSlug
): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
