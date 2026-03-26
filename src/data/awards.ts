export type Award = {
  year: number;
  title: string;
  organization: string;
  type: "winner" | "finalist";
};

export type PressFeature = {
  name: string;
  type: "publication" | "retail" | "event" | "talk";
};

export const awards: Award[] = [
  {
    year: 2025,
    title: "Creative Designer of the Year",
    organization: "Retail Jeweller",
    type: "finalist",
  },
  {
    year: 2025,
    title: "Jewellery Brand of the Year",
    organization: "Professional Jeweller",
    type: "finalist",
  },
  {
    year: 2023,
    title: "Creative Designer of the Year",
    organization: "Retail Jeweller",
    type: "finalist",
  },
  {
    year: 2021,
    title: "Creative Designer of the Year",
    organization: "Retail Jeweller",
    type: "winner",
  },
  {
    year: 2019,
    title: "Innovation of the Year: The AquaWave",
    organization: "National Association of Jewellers",
    type: "winner",
  },
  {
    year: 2017,
    title: "Designer of the Year",
    organization: "National Association of Jewellers",
    type: "finalist",
  },
  {
    year: 2015,
    title: "Designer of the Year",
    organization: "Madame Figaro Women of the Year Awards",
    type: "winner",
  },
  {
    year: 2014,
    title: "New Designer of the Year",
    organization: "Retail Jeweller",
    type: "finalist",
  },
  {
    year: 2013,
    title: "Designer of the Year",
    organization: "London Jewellery Week",
    type: "winner",
  },
];

export const pressFeatures: PressFeature[] = [
  // Publications first
  { name: "Marie Claire", type: "publication" },
  { name: "Madame Figaro", type: "publication" },
  { name: "Vogue Italia", type: "publication" },
  { name: "Vogue India", type: "publication" },
  { name: "Country & Town House", type: "publication" },
  { name: "Retail Jeweller", type: "publication" },
  { name: "You & Your Wedding", type: "publication" },
  // Fashion weeks
  { name: "London Fashion Week", type: "event" },
  { name: "Paris Fashion Week", type: "event" },
  { name: "Milano Fashion Week", type: "event" },
  // Other
  { name: "Selfridges", type: "retail" },
  { name: "TEDx", type: "talk" },
];
