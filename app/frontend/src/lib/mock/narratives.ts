import type { Narrative } from "../types";

// MOCK DATA for prototyping. Counts per snapshot add up to the snapshot totals
// in topic.ts once the 567 unclustered posts are included.

export const narratives: Narrative[] = [
  {
    id: "imf-conditions",
    title: "Price rise blamed on IMF conditions",
    summary:
      "Posts link the increase to loan programme conditions and ask why the burden falls on ordinary households rather than on official perks.",
    keyTerms: [
      { text: "IMF conditions", language: "en" },
      { text: "shartain", language: "ru" },
      { text: "آئی ایم ایف", language: "ur" },
      { text: "levy", language: "en" },
    ],
    bySnapshot: [402, 431, 451],
    stance: { supportive: 61, neutral: 298, critical: 925 },
    sarcasmShare: 0.08,
    mainLanguages: ["en", "ur"],
  },
  {
    id: "fares-and-food",
    title: "Fares and food prices will follow",
    summary:
      "Reports of higher rickshaw, van and goods transport fares, and expectations that milk, bread and vegetable prices will rise next.",
    keyTerms: [
      { text: "kiraya", language: "ru" },
      { text: "fares", language: "en" },
      { text: "کرایہ", language: "ur" },
      { text: "doodh", language: "ru" },
    ],
    bySnapshot: [298, 352, 386],
    stance: { supportive: 22, neutral: 241, critical: 773 },
    sarcasmShare: 0.05,
    mainLanguages: ["ru", "ur"],
  },
  {
    id: "jokes-and-memes",
    title: "Jokes and memes about the new price",
    summary:
      "Humour about walking, bicycles and petrol as a luxury gift. Mostly sarcastic, so stance labels here are the least certain.",
    keyTerms: [
      { text: "khushboo", language: "ru" },
      { text: "luxury", language: "en" },
      { text: "status symbol", language: "en" },
      { text: "عید", language: "ur" },
    ],
    bySnapshot: [301, 262, 249],
    stance: { supportive: 31, neutral: 189, critical: 592 },
    sarcasmShare: 0.58,
    mainLanguages: ["ru", "en"],
  },
  {
    id: "relief-package",
    title: "Relief package will offset the increase",
    summary:
      "Discussion of the targeted subsidy for motorcycle owners: support for targeting, explainers on eligibility, and later complaints about registration.",
    keyTerms: [
      { text: "relief package", language: "en" },
      { text: "subsidy", language: "en" },
      { text: "ریلیف پیکج", language: "ur" },
      { text: "registration", language: "en" },
    ],
    bySnapshot: [96, 388, 260],
    stance: { supportive: 512, neutral: 158, critical: 74 },
    sarcasmShare: 0.06,
    mainLanguages: ["en", "ur"],
  },
  {
    id: "motorcycle-commuters",
    title: "Motorcycle commuters hit hardest",
    summary:
      "Riders and delivery workers describe their own daily fuel costs and the share of income they now spend getting to work.",
    keyTerms: [
      { text: "bike", language: "ru" },
      { text: "delivery riders", language: "en" },
      { text: "موٹر سائیکل", language: "ur" },
      { text: "rozana", language: "ru" },
    ],
    bySnapshot: [118, 196, 297],
    stance: { supportive: 8, neutral: 97, critical: 506 },
    sarcasmShare: 0.04,
    mainLanguages: ["ru", "en"],
  },
  {
    id: "transport-strike",
    title: "Transporters threaten a strike",
    summary:
      "Goods transporters have called a strike over fares. Posts report the call and warn of shortages in markets if it goes ahead.",
    keyTerms: [
      { text: "hartal", language: "ru" },
      { text: "strike", language: "en" },
      { text: "ہڑتال", language: "ur" },
      { text: "transporters", language: "en" },
    ],
    bySnapshot: [12, 104, 371],
    stance: { supportive: 41, neutral: 168, critical: 278 },
    sarcasmShare: 0.03,
    mainLanguages: ["ru", "ur"],
  },
  {
    id: "regional-comparison",
    title: "Comparisons with regional prices",
    summary:
      "Posts compare the new price with neighbouring countries. Some say it is still cheaper, others say comparisons ignore local incomes.",
    keyTerms: [
      { text: "region", language: "en" },
      { text: "purchasing power", language: "en" },
      { text: "doosre mulk", language: "ru" },
    ],
    bySnapshot: [139, 141, 141],
    stance: { supportive: 212, neutral: 117, critical: 92 },
    sarcasmShare: 0.09,
    mainLanguages: ["en"],
  },
];

/** Posts that did not fit any narrative, per snapshot. */
export const unclusteredBySnapshot = [178, 157, 232];
