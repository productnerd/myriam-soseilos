import { MediaItem } from "@/components/ui/Media";

export type BespokePieceData = {
  id: string;
  title: string;
  subtitle: string;
  year: number;
  duration: string;
  materials: string[];
  story: string;
  media: MediaItem[];
};

const IMG_BASE = "https://myriamsos.co.uk/wp-content/uploads/2024/02";

export const bespokePieces: BespokePieceData[] = [
  {
    id: "constellation-ring",
    title: "The Constellation Ring",
    subtitle: "An engagement ring written in the stars",
    year: 2023,
    duration: "4 months",
    materials: ["Rose Gold", "Brilliant-Cut Diamond", "White Sapphires"],
    story:
      "When James approached Myriam with the idea of an engagement ring inspired by the night sky on the evening he and Sophie first met, it became one of the most personal commissions she had ever undertaken. Working from astronomical charts of that exact date and location, Myriam mapped the constellation pattern into the band itself, with each star represented by a carefully placed white sapphire. The centrepiece \u2014 a brilliant-cut diamond \u2014 sits where Polaris would be, the guiding star of their relationship. The rose gold band features flowing asymmetric lines that echo the curvature of the celestial sphere, creating a piece that is both deeply scientific and profoundly romantic. Every angle reveals a new detail, a new story. Sophie later said that knowing the exact stars from their first evening together were embedded in her ring made it feel like wearing a piece of their shared history.",
    media: [
      { src: `${IMG_BASE}/rings.webp`, alt: "Constellation Ring - design process", type: "image" },
      { src: `${IMG_BASE}/bespoke-large.webp`, alt: "Constellation Ring - finished piece", type: "image" },
    ],
  },
  {
    id: "eternal-embrace-bracelet",
    title: "The Eternal Embrace Bracelet",
    subtitle: "A 25th anniversary celebration of unity",
    year: 2022,
    duration: "6 weeks",
    materials: ["White Gold", "Blue Sapphires"],
    story:
      "For their silver wedding anniversary, David wanted something extraordinary for his wife Elena \u2014 a piece that would symbolise twenty-five years of partnership and growth. Myriam designed a bracelet where two distinct strands of white gold intertwine and separate along the length, meeting at key points marked with small clusters of sapphires representing their three children. The bracelet's form was inspired by the double helix, a nod to Elena's career in medical research and the idea that their lives have become inextricably woven together at a molecular level. The clasp mechanism itself is a piece of engineering art \u2014 two halves that slide together seamlessly, impossible to separate without knowing the precise motion. Myriam spent weeks perfecting the tension in the intertwining strands, ensuring each curve felt organic and alive. The result is a piece that moves with the wearer, catching light differently with every gesture.",
    media: [
      { src: `${IMG_BASE}/bracelets.webp`, alt: "Eternal Embrace Bracelet - detail", type: "image" },
      { src: `${IMG_BASE}/Dreamingless-Power-Barcelet-and-Carmelita-Ring.webp`, alt: "Eternal Embrace Bracelet - worn", type: "image" },
    ],
  },
  {
    id: "celestial-pendant",
    title: "The Celestial Pendant",
    subtitle: "Reimagining a grandmother's legacy",
    year: 2021,
    duration: "3 weeks",
    materials: ["White Gold", "Recycled Diamonds", "Recycled Art Deco Brooch"],
    story:
      "When Amara inherited her grandmother's art deco brooch \u2014 a cherished family piece from the 1930s that had become too fragile to wear \u2014 she knew she wanted to transform it into something she could carry forward into the next generation. Myriam's approach was one of deep respect: she carefully studied the original brooch's geometric patterns and the way light played across its facets, then reimagined those elements as a contemporary pendant. The original diamonds were re-set into a new architectural framework of white gold, with the triangular motifs of the art deco period translated into Myriam's signature angular forms. Where the original was symmetrical and rigid, the new pendant introduces subtle asymmetry and movement \u2014 a bridge between the grandmother's era and Amara's modern sensibility. The chain itself features tiny geometric links that echo the pendant's form, creating a cohesive piece that honours its origin while being entirely new.",
    media: [
      { src: `${IMG_BASE}/necklaces.webp`, alt: "Celestial Pendant - design", type: "image" },
      { src: `${IMG_BASE}/earrings2.webp`, alt: "Celestial Pendant - craftsmanship", type: "image" },
    ],
  },
];
