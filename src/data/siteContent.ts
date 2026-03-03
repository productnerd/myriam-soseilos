const IMG_BASE = "https://myriamsos.co.uk/wp-content/uploads/2024/02";

export const siteContent = {
  brand: {
    name: "Myriam Soseilos",
    tagline: "Audaciously different fine jewellery",
    heroSubtitle:
      "Unconventional designs inspired by architecture, space and the wearer themselves. For the ones who dare to be different.",
  },
  about: {
    intro:
      "Myriam Soseilos is an award-winning designer known for pushing the boundaries of jewellery design. Featured in Vogue UK and Marie Claire, stocked at Selfridges, and showcased at fashion weeks in London, Paris and Shanghai — her work spans the worlds of fine jewellery, sculpture and wearable art.",
    origin:
      "Myriam's journey into jewellery began during a traineeship at Vogue, where she was immersed in the world of fashion and design. She went on to work at a leading advertising agency, but found herself drawn to creating jewellery in her spare time. When people began asking to buy her pieces — and commission bespoke designs — she made the leap to follow her passion full-time.",
    evolution:
      "Her early collections were defined by sharp, angular, architectural forms. Over time her style evolved to incorporate movement and transformation — pieces that shift, twist and change with the wearer. She pioneered the use of magnets in fine jewellery, allowing pieces to be worn in multiple configurations. She created a ring that changes colour with body temperature, and was one of the first jewellery designers to work with osmium, the world's densest naturally occurring element.",
    philosophy:
      "Nothing Myriam creates is conventional. Whether it's straight-line geometric shapes, architectural influences, or flexible pieces that transform and adapt — there's nothing quite like it on the market. Her designs are incomparable and impossible to replicate, because they come from a fiercely creative and individual mind.",
    tedTalk: {
      url: "https://www.youtube.com/watch?v=GHxo5kTgqHo",
      title: "Myriam's TEDx talk on the intersection of jewellery, art and identity",
    },
    sustainability: {
      intro:
        "Our philosophy is to handcraft jewellery created from materials that are ethically sourced and processed with consideration to the environment and social impact.",
      points: [
        "90% of the precious metal we use is 100% recycled, reducing the ecological risk involved in mining new metal",
        "Our diamonds are obtained from conflict-free sources and are laser-inscribed with a tracking number",
        "We work with lab-created diamonds that match the appearance, structure and durability of natural gems",
        "We verify that our sources for all gems promote worker well-being and support the local economy",
        "We are an eco-friendly brand making every effort to ensure each piece brings the least amount of harm to the environment",
      ],
    },
  },
  bespoke: {
    heading: "Bespoke Creations",
    description:
      "Myriam creates fully custom, one-of-a-kind pieces — engagement rings born from shared memories, heirloom transformations that bridge generations, statement pieces that capture a moment in time. Each commission is a deeply personal collaboration, moving from concept to finished piece in just 3 to 4 weeks. Using precision 3D modelling, every detail is perfected before casting at a specialist atelier in Athens and hand-finishing in Cyprus or the UK. Clients can also bring existing jewellery to be recycled and reimagined into something entirely new.",
    collections:
      "Each collection has its own story — but all reflect the same unconventional spirit. Choose your metal, gemstones and finish to make any piece uniquely yours.",
    clientJourney: {
      consultation: "Every piece begins with a conversation. Myriam meets with each client to understand their story, style and vision.",
      design: "Using 3DesignCad, Myriam creates detailed digital models that bring your concept to life before any metal is touched.",
      crafting: "Pieces are cast at a specialist atelier in Athens, then finished by hand — either in Cyprus or the UK, depending on the client's location.",
      delivery: "For European clients, pieces are typically delivered in person. UK clients receive their finished creation with a personal touch.",
    },
    cta: "Schedule a Consultation",
  },
  contact: {
    email: "info@myriamsos.co.uk",
  },
  images: {
    hero: `${IMG_BASE}/background_blue.webp`,
    heroVideo: undefined as string | undefined, // Set to a video URL to use video hero background
    bespoke: `${IMG_BASE}/bespoke-large.webp`,
    aboutMyriam: `${IMG_BASE}/myriam.webp`,
    aboutJewellery: `${IMG_BASE}/Dreamingless-Power-Barcelet-and-Carmelita-Ring.webp`,
    categories: {
      necklaces: `${IMG_BASE}/necklaces.webp`,
      earrings: `${IMG_BASE}/earrings2.webp`,
      bracelets: `${IMG_BASE}/bracelets.webp`,
      rings: `${IMG_BASE}/rings.webp`,
    },
  },
};
