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
    year: 2019,
    title: "Innovation Award",
    organization: "National Association of Jewellers",
    type: "winner",
  },
  {
    year: 2017,
    title: "International Jewellery Designer of the Year",
    organization: "International Trade & Export Awards",
    type: "winner",
  },
  {
    year: 2015,
    title: "Designer of the Year",
    organization: "Madame Figaro International Award",
    type: "winner",
  },
  {
    year: 2014,
    title: "New Designer of the Year",
    organization: "UK Watch & Jewellery Awards",
    type: "finalist",
  },
  {
    year: 2013,
    title: "Designer of the Year",
    organization: "London Jewellery Week",
    type: "finalist",
  },
];

export const pressFeatures: PressFeature[] = [
  { name: "Vogue UK", type: "publication" },
  { name: "Marie Claire", type: "publication" },
  { name: "Madame Figaro", type: "publication" },
  { name: "Selfridges", type: "retail" },
  { name: "TEDx", type: "talk" },
  { name: "London Fashion Week", type: "event" },
  { name: "Paris Fashion Week", type: "event" },
  { name: "Shanghai Fashion Week", type: "event" },
];
