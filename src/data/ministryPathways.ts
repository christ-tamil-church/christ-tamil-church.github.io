export type MinistryPathway = {
  id: "worship" | "connect" | "grow" | "serve";
  labelTa: string;
  labelEn: string;
  words: string[];
  accentWord: number;
  introduction: string;
  ministries: Array<{ name: string }>;
  cta: {
    label: string;
    href: string;
  };
};

export const pathwayLabels = {
  worship: { ta: "ஆராதனை", en: "Worship" },
  connect: { ta: "ஐக்கியம்", en: "Connect" },
  grow: { ta: "பக்தி விருத்தி", en: "Grow" },
  serve: { ta: "ஊழியம்", en: "Serve" }
} as const;

export const ministryPathways: MinistryPathway[] = [
  {
    id: "worship",
    labelTa: pathwayLabels.worship.ta,
    labelEn: pathwayLabels.worship.en,
    words: ["Worship", "is", "our", "purpose."],
    accentWord: 0,
    introduction:
      "We gather to praise, pray, and receive God’s Word together in Tamil and English.",
    ministries: [
      { name: "Sunday Worship Service" },
      { name: "Communion Service" },
      { name: "First Day of the Month Service" },
      { name: "Kids’ Circle" }
    ],
    cta: { label: "Explore worship", href: "/worship" }
  },
  {
    id: "connect",
    labelTa: pathwayLabels.connect.ta,
    labelEn: pathwayLabels.connect.en,
    words: ["Connecting", "to", "grow."],
    accentWord: 0,
    introduction:
      "Faith becomes family as we share meals, celebrations, and everyday life together.",
    ministries: [
      { name: "Fellowship Meals" },
      { name: "Summer Picnic" },
      { name: "Family Visits" },
      { name: "Summer Carnival" },
      { name: "Harvest Festival" },
      { name: "Carol Rounds" }
    ],
    cta: { label: "Explore", href: "/connect" }
  },
  {
    id: "grow",
    labelTa: pathwayLabels.grow.ta,
    labelEn: pathwayLabels.grow.en,
    words: ["Growing", "to", "serve."],
    accentWord: 0,
    introduction:
      "Every generation is encouraged to grow through Scripture, prayer, discipleship, and fellowship.",
    ministries: [
      { name: "Sunday School" },
      { name: "Youth Group, Women’s Fellowship & Men’s Fellowship" },
      { name: "Monthly Fasting Prayer & Annual Family Camp" },
      { name: "Intercessory Prayer" },
      { name: "Weekly Bible Study" }
    ],
    cta: { label: "Explore ways to grow", href: "/grow" }
  },
  {
    id: "serve",
    labelTa: pathwayLabels.serve.ta,
    labelEn: pathwayLabels.serve.en,
    words: ["Serving", "is", "a", "privilege."],
    accentWord: 0,
    introduction:
      "We joyfully use what God has given us to care for our neighbors and support His mission.",
    ministries: [
      { name: "Community Outreach" },
      { name: "Mission Support" },
      { name: "Mission Sunday" },
      { name: "Annual Christmas Festival" }
    ],
    cta: { label: "Find a way to serve", href: "/serve" }
  }
];
