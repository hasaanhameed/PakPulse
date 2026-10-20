import { REVIEW_THRESHOLD } from "./config";
import type { Post, PostFilters } from "./types";

// Pure helpers, safe to use in both server and client components.

export function lowestConfidence(post: Post): number {
  return Math.min(...Object.values(post.labels).map((l) => l.confidence));
}

export function isLowConfidence(post: Post): boolean {
  return lowestConfidence(post) < REVIEW_THRESHOLD;
}

export function engagementOf(post: Post): number {
  return post.engagement.likes + post.engagement.reposts + post.engagement.replies;
}

/** "1,470 likes · 466 reposts · 121 replies". Instagram has no reposts, so they are left out there. */
export function engagementText(post: Post): string {
  const n = (v: number) => v.toLocaleString("en-GB");
  const parts = [`${n(post.engagement.likes)} likes`];
  if (post.platform !== "instagram") parts.push(`${n(post.engagement.reposts)} reposts`);
  parts.push(`${n(post.engagement.replies)} replies`);
  return parts.join(" · ");
}

/** Builds a /posts link for the given filters. */
export function postsHref(filters: PostFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `/posts?${qs}` : "/posts";
}
