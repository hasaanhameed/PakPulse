import type { Overview, Stance, VolumeBin } from "../types";
import { topic } from "./topic";

// MOCK DATA for prototyping. Aggregates for a simulated 5,962-post collection.
// Stance totals per language and per platform add up to the overall stance totals.

const BIN_HOURS = 6;

/**
 * Relative posting activity per 6-hour bin, per snapshot window.
 * Night bins (00:00 to 06:00) are quieter. Spikes follow the price announcement,
 * the relief package (15 Oct) and the strike call (17 Oct).
 */
const BIN_WEIGHTS: number[][] = [
  [1.0, 0.55, 0.9],
  [1.0, 0.95, 0.45, 0.8, 1.3, 1.1, 0.4, 0.7],
  [0.8, 0.85, 0.4, 0.9, 1.2, 1.25, 0.5, 1.0],
];

/** Extra weight per stance in particular bins, keyed by `${snapshotIndex}:${binIndex}`. */
const STANCE_BOOST: Partial<Record<string, Partial<Record<Stance, number>>>> = {
  "1:4": { supportive: 1.8 },
  "1:5": { supportive: 1.5 },
  "2:4": { critical: 1.15 },
  "2:5": { critical: 1.15 },
};

/** Split `total` across `weights` as whole numbers that add up exactly (largest remainder). */
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of order) {
    if (left <= 0) break;
    out[i] += 1;
    left -= 1;
  }
  return out;
}

function buildVolume(): VolumeBin[] {
  const bins: VolumeBin[] = [];
  topic.snapshots.forEach((snapshot, si) => {
    const weights = BIN_WEIGHTS[si];
    const start = new Date(snapshot.windowStart).getTime();
    const perStance = (["supportive", "neutral", "critical"] as Stance[]).map((stance) =>
      distribute(
        snapshot.byStance[stance],
        weights.map((w, bi) => w * (STANCE_BOOST[`${si}:${bi}`]?.[stance] ?? 1)),
      ),
    );
    weights.forEach((_, bi) => {
      bins.push({
        start: new Date(start + bi * BIN_HOURS * 3600_000).toISOString(),
        supportive: perStance[0][bi],
        neutral: perStance[1][bi],
        critical: perStance[2][bi],
      });
    });
  });
  return bins;
}

export const overview: Overview = {
  totals: {
    posts: 5962,
    stance: { supportive: 1018, neutral: 1684, critical: 3260 },
    sentiment: { positive: 702, neutral: 1951, negative: 3309 },
    emotion: { anger: 1842, worry: 1120, disappointment: 760, humour: 846, hope: 391, none: 1003 },
    sarcasmLikely: 671,
    reviewQueue: 214,
  },
  stanceByLanguage: {
    en: { supportive: 498, neutral: 712, critical: 936 },
    ur: { supportive: 262, neutral: 371, critical: 471 },
    ru: { supportive: 258, neutral: 601, critical: 1853 },
  },
  stanceByPlatform: {
    x: { supportive: 801, neutral: 1262, critical: 2649 },
    instagram: { supportive: 141, neutral: 263, critical: 384 },
    threads: { supportive: 76, neutral: 159, critical: 227 },
  },
  volume: buildVolume(),
};
