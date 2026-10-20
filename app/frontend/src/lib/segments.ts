import type { Segment } from "@/components/ProportionBar";
import { SENTIMENT_META, SENTIMENTS, STANCE_META, STANCES } from "./labels";
import { postsHref } from "./post-utils";
import type { PostFilters, Sentiment, StanceCounts } from "./types";

/** Stance counts as bar segments, each linking to the matching posts. */
export function stanceSegments(counts: StanceCounts, filters: PostFilters = {}): Segment[] {
  return STANCES.map((s) => ({
    key: s,
    label: STANCE_META[s].label,
    value: counts[s],
    token: STANCE_META[s].token,
    href: postsHref({ ...filters, stance: s }),
  }));
}

/** Sentiment counts as bar segments, each linking to the matching posts. */
export function sentimentSegments(counts: Record<Sentiment, number>, filters: PostFilters = {}): Segment[] {
  return SENTIMENTS.map((s) => ({
    key: s,
    label: SENTIMENT_META[s].label,
    value: counts[s],
    token: SENTIMENT_META[s].token,
    href: postsHref({ ...filters, sentiment: s }),
  }));
}
