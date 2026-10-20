import "server-only";

import { MOCK_LATENCY_MS, POSTS_PER_PAGE } from "./config";
import { EMOTIONS, LANGUAGES, PLATFORMS, SENTIMENTS, STANCES } from "./labels";
import { engagementOf, isLowConfidence, lowestConfidence } from "./post-utils";
import { briefs } from "./mock/briefs";
import { narratives, unclusteredBySnapshot } from "./mock/narratives";
import { overview } from "./mock/overview";
import { posts } from "./mock/posts";
import { topic } from "./mock/topic";
import type {
  Brief,
  Narrative,
  NarrativeTrend,
  NarrativeWithTrend,
  Overview,
  Post,
  PostFilters,
  Topic,
} from "./types";

// The dashboard's only data source. Every function here returns mock data for now.
// When the backend API exists, replace each body with a fetch to its endpoint
// (endpoints are TBD, see app/backend/CLAUDE.md). Pages never import mock data directly.

const delay = () => new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

export async function getTopic(): Promise<Topic> {
  await delay();
  return topic;
}

export async function getOverview(): Promise<Overview> {
  await delay();
  return overview;
}

function withTrend(n: Narrative): NarrativeWithTrend {
  const total = n.bySnapshot.reduce((a, b) => a + b, 0);
  const last = n.bySnapshot[n.bySnapshot.length - 1];
  const prev = n.bySnapshot[n.bySnapshot.length - 2];
  const change = prev ? (last - prev) / prev : null;
  let trend: NarrativeTrend = "steady";
  if (n.bySnapshot[0] < last * 0.1) trend = "emerging";
  else if (change !== null && change > 0.25) trend = "growing";
  else if (change !== null && change < -0.05) trend = "fading";
  return { ...n, posts: total, change, trend };
}

export async function getNarratives(sort: "size" | "growth" = "size"): Promise<NarrativeWithTrend[]> {
  await delay();
  const list = narratives.map(withTrend);
  return list.sort((a, b) =>
    sort === "growth" ? (b.change ?? 0) - (a.change ?? 0) : b.posts - a.posts,
  );
}

/** Posts that did not fit any narrative, across all snapshots. */
export async function getUnclusteredCount(): Promise<number> {
  await delay();
  return unclusteredBySnapshot.reduce((a, b) => a + b, 0);
}

export async function getNarrative(id: string): Promise<NarrativeWithTrend | null> {
  await delay();
  const n = narratives.find((x) => x.id === id);
  return n ? withTrend(n) : null;
}

function matches(post: Post, f: PostFilters): boolean {
  if (f.q && !post.text.toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.stance && post.labels.stance.value !== f.stance) return false;
  if (f.sentiment && post.labels.sentiment.value !== f.sentiment) return false;
  if (f.emotion && post.labels.emotion.value !== f.emotion) return false;
  if (f.language && post.language !== f.language) return false;
  if (f.platform && post.platform !== f.platform) return false;
  if (f.sarcasm && post.labels.sarcasm.value !== (f.sarcasm === "likely")) return false;
  if (f.confidence === "low" && !isLowConfidence(post)) return false;
  if (f.narrative && post.narrativeId !== f.narrative) return false;
  return true;
}

export async function getPosts(
  filters: PostFilters,
): Promise<{ items: Post[]; total: number; page: number; pages: number }> {
  await delay();
  const sorted = posts.filter((p) => matches(p, filters)).sort((a, b) => {
    if (filters.sort === "engagement") return engagementOf(b) - engagementOf(a);
    if (filters.sort === "confidence") return lowestConfidence(a) - lowestConfidence(b);
    return b.postedAt.localeCompare(a.postedAt);
  });
  const pages = Math.max(1, Math.ceil(sorted.length / POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, filters.page ?? 1), pages);
  const items = sorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  return { items, total: sorted.length, page, pages };
}

export async function getPost(id: string): Promise<Post | null> {
  await delay();
  return posts.find((p) => p.id === id) ?? null;
}

/** Posts in the order of `ids`. Unknown IDs are skipped. */
export async function getPostsByIds(ids: string[]): Promise<Post[]> {
  await delay();
  return ids.map((id) => posts.find((p) => p.id === id)).filter((p): p is Post => Boolean(p));
}

export async function getNarrativePosts(narrativeId: string, limit: number): Promise<Post[]> {
  await delay();
  return posts
    .filter((p) => p.narrativeId === narrativeId)
    .sort((a, b) => engagementOf(b) - engagementOf(a))
    .slice(0, limit);
}

export async function listBriefs(): Promise<Pick<Brief, "id" | "date" | "snapshotId">[]> {
  await delay();
  return briefs.map(({ id, date, snapshotId }) => ({ id, date, snapshotId }));
}

export async function getBrief(id?: string): Promise<Brief | null> {
  await delay();
  if (!id) return briefs[0] ?? null;
  return briefs.find((b) => b.id === id) ?? null;
}

/** Briefs that cite a given post. */
export async function getBriefsCiting(postId: string): Promise<Pick<Brief, "id" | "date">[]> {
  await delay();
  return briefs
    .filter((b) => b.sections.some((s) => s.items.some((i) => i.cites.includes(postId))))
    .map(({ id, date }) => ({ id, date }));
}

/** Mock posts with at least one label below the review threshold, least certain first. */
export async function getReviewQueue(): Promise<Post[]> {
  await delay();
  return posts.filter(isLowConfidence).sort((a, b) => lowestConfidence(a) - lowestConfidence(b));
}

type SearchParams = Record<string, string | string[] | undefined>;

function pick<T extends string>(value: string | string[] | undefined, allowed: readonly T[]): T | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return allowed.includes(v as T) ? (v as T) : undefined;
}

/** Turns URL search params into validated post filters. Unknown values are ignored. */
export function parsePostFilters(sp: SearchParams): PostFilters {
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page);
  const narrative = Array.isArray(sp.narrative) ? sp.narrative[0] : sp.narrative;
  return {
    q: q?.trim() || undefined,
    stance: pick(sp.stance, STANCES),
    sentiment: pick(sp.sentiment, SENTIMENTS),
    emotion: pick(sp.emotion, EMOTIONS),
    language: pick(sp.language, LANGUAGES),
    platform: pick(sp.platform, PLATFORMS),
    sarcasm: pick(sp.sarcasm, ["likely", "unlikely"] as const),
    confidence: pick(sp.confidence, ["low"] as const),
    narrative: narratives.some((n) => n.id === narrative) ? narrative : undefined,
    sort: pick(sp.sort, ["newest", "engagement", "confidence"] as const),
    page: Number.isFinite(page) && page > 0 ? page : undefined,
  };
}
