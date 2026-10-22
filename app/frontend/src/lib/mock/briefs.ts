import type { Brief } from "../types";

// MOCK DATA for prototyping. Hand-written stand-ins for AI-drafted briefs.
// Figures match the mock aggregates; every claim cites mock posts.

export const briefs: Brief[] = [
  {
    id: "2026-10-18",
    date: "2026-10-18T12:00:00+05:00",
    snapshotId: "s3",
    generatedAt: "2026-10-18T12:40:00+05:00",
    sections: [
      {
        heading: "Summary",
        items: [
          {
            text: "Critical posts rose to 60% of the 2,387 posts in round 3, up from 52% in round 2. Anger and worry about knock-on costs drive most of them.",
            cites: ["p07", "p08", "p25"],
          },
          {
            text: "The conversation has moved from the price rise itself to its effects: transport fares, food prices and the cost of getting to work.",
            cites: ["p06", "p10", "p23"],
          },
        ],
      },
      {
        heading: "What changed since round 2",
        items: [
          {
            text: "A possible transporters' strike is the fastest-growing narrative, up from 104 to 371 posts. Most posts report the strike call or warn of market shortages rather than take a side.",
            cites: ["p28", "p29", "p32"],
          },
          {
            text: "Posts about motorcycle commuters rose by 52%. Many describe the writer's own daily costs, often in Roman Urdu.",
            cites: ["p23", "p27"],
          },
          {
            text: "Supportive posts fell from 448 to 318 as attention to the relief package faded. Recent posts about the package focus on registration problems.",
            cites: ["p17", "p20"],
          },
        ],
      },
      {
        heading: "Narratives to watch",
        items: [
          {
            text: "Transporters' strike. If it goes ahead, expect the story to widen from fuel to shortages of vegetables and fruit.",
            cites: ["p29", "p30"],
          },
          {
            text: "Motorcycle commuters. Personal cost stories now appear on Instagram and Threads as well as X.",
            cites: ["p25", "p27"],
          },
        ],
      },
      {
        heading: "Read with care",
        items: [
          {
            text: "About 11% of posts are flagged as likely sarcastic. Sarcasm in Roman Urdu is the least reliable label so far, and 214 labels are waiting for review.",
            cites: ["p11", "p16"],
          },
          {
            text: "Threads makes up 8% of posts, so any comparison that involves Threads rests on small numbers.",
            cites: [],
          },
        ],
      },
    ],
  },
  {
    id: "2026-10-16",
    date: "2026-10-16T12:00:00+05:00",
    snapshotId: "s2",
    generatedAt: "2026-10-16T12:35:00+05:00",
    sections: [
      {
        heading: "Summary",
        items: [
          {
            text: "The relief package announced on 15 Oct lifted supportive posts to 448, or 22% of round 2. That is the highest supportive share so far.",
            cites: ["p17", "p18", "p22"],
          },
          {
            text: "Critical posts still lead at 52%, focused on IMF conditions and rising fares.",
            cites: ["p02", "p04", "p06"],
          },
        ],
      },
      {
        heading: "What changed since round 1",
        items: [
          {
            text: "Jokes and memes about the price fell slightly but remain the third-largest narrative.",
            cites: ["p13", "p15"],
          },
          {
            text: "Talk of a transporters' strike appeared for the first time, with 104 posts.",
            cites: ["p32"],
          },
        ],
      },
    ],
  },
];
