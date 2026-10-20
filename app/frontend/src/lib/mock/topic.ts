import type { Topic } from "../types";

// MOCK DATA for prototyping. Not real posts, accounts or figures.
// The real demo topic is still open (PROGRESS open question 2).

export const topic: Topic = {
  id: "fuel-price-rise",
  name: "Fuel price rise",
  description: "Public reaction to the October fuel price increase and the measures that followed.",
  keywords: {
    en: ["fuel price", "petrol price", "petrol hike", "fuel levy", "relief package"],
    ur: ["پیٹرول کی قیمت", "پیٹرول مہنگا", "تیل کی قیمتیں"],
    ru: ["petrol mehnga", "petrol ki qeemat", "petrol price barh gayi"],
  },
  accounts: [
    { platform: "x", handle: "@mock_energy_ministry", category: "official" },
    { platform: "x", handle: "@mock_regulator", category: "official" },
    { platform: "x", handle: "@mock_news_desk", category: "news" },
    { platform: "instagram", handle: "@mock_daily_news", category: "news" },
    { platform: "x", handle: "@mock_energy_analyst", category: "analyst" },
    { platform: "threads", handle: "@mock_economy_desk", category: "news" },
  ],
  snapshots: [
    {
      id: "s1",
      label: "Snapshot 1",
      windowStart: "2026-10-13T18:00:00+05:00",
      collectedAt: "2026-10-14T12:00:00+05:00",
      posts: 1544,
      byStance: { supportive: 252, neutral: 520, critical: 772 },
      byPlatform: { x: 1226, instagram: 198, threads: 120 },
    },
    {
      id: "s2",
      label: "Snapshot 2",
      windowStart: "2026-10-14T12:00:00+05:00",
      collectedAt: "2026-10-16T12:00:00+05:00",
      posts: 2031,
      byStance: { supportive: 448, neutral: 527, critical: 1056 },
      byPlatform: { x: 1602, instagram: 271, threads: 158 },
    },
    {
      id: "s3",
      label: "Snapshot 3",
      windowStart: "2026-10-16T12:00:00+05:00",
      collectedAt: "2026-10-18T12:00:00+05:00",
      posts: 2387,
      byStance: { supportive: 318, neutral: 637, critical: 1432 },
      byPlatform: { x: 1884, instagram: 319, threads: 184 },
    },
  ],
};
