import type { Metadata } from "next";
import Link from "next/link";

import { AutoSubmitForm } from "@/components/AutoSubmitForm";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { getNarratives, getPosts, parsePostFilters } from "@/lib/api";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatNumber } from "@/lib/format";
import {
  EMOTION_LABEL,
  EMOTIONS,
  LANGUAGE_LABEL,
  LANGUAGES,
  PLATFORM_LABEL,
  PLATFORMS,
  SENTIMENT_META,
  SENTIMENTS,
  STANCE_META,
  STANCES,
} from "@/lib/labels";
import { postsHref } from "@/lib/post-utils";
import type { PostFilters } from "@/lib/types";
import styles from "./posts.module.css";

export const metadata: Metadata = { title: "Posts" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={styles.control}>
      <span className="field-label">{label}</span>
      <select name={name} defaultValue={value ?? ""} className="select">
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parsePostFilters(await searchParams);
  const [result, narratives] = await Promise.all([getPosts(filters), getNarratives("size")]);
  const narrativeTitle = (id: string | null) => (id ? narratives.find((n) => n.id === id)?.title ?? null : null);
  const active = Object.entries(filters).filter(([k, v]) => v !== undefined && k !== "page" && k !== "sort");
  const pageHref = (page: number): string => postsHref({ ...filters, page } as PostFilters);

  return (
    <div>
      <PageHeader
        title="Posts"
        meta="Filter to see the posts behind any number."
      />

      <AutoSubmitForm className={styles.filters}>
        <label className={`${styles.control} ${styles.search}`}>
          <span className="field-label">Search text</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ""}
            className="input"
            placeholder="Word or phrase"
          />
        </label>
        <Select
          name="stance"
          label="Stance"
          value={filters.stance}
          options={STANCES.map((s) => ({ value: s, label: STANCE_META[s].label }))}
        />
        <Select
          name="sentiment"
          label="Mood"
          value={filters.sentiment}
          options={SENTIMENTS.map((s) => ({ value: s, label: SENTIMENT_META[s].label }))}
        />
        <Select
          name="emotion"
          label="Emotion"
          value={filters.emotion}
          options={EMOTIONS.map((e) => ({ value: e, label: EMOTION_LABEL[e] }))}
        />
        <Select
          name="language"
          label="Language"
          value={filters.language}
          options={LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABEL[l] }))}
        />
        <Select
          name="platform"
          label="Platform"
          value={filters.platform}
          options={PLATFORMS.map((p) => ({ value: p, label: PLATFORM_LABEL[p] }))}
        />
        <Select
          name="sarcasm"
          label="Sarcasm"
          value={filters.sarcasm}
          options={[
            { value: "likely", label: "Likely" },
            { value: "unlikely", label: "Not likely" },
          ]}
        />
        <Select
          name="confidence"
          label="Confidence"
          value={filters.confidence}
          options={[{ value: "low", label: `Below ${REVIEW_THRESHOLD.toFixed(2)}` }]}
        />
        <Select
          name="narrative"
          label="Narrative"
          value={filters.narrative}
          options={narratives.map((n) => ({ value: n.id, label: n.title }))}
        />
        <label className={styles.control}>
          <span className="field-label">Sort</span>
          <select name="sort" defaultValue={filters.sort ?? "newest"} className="select">
            <option value="newest">Newest first</option>
            <option value="engagement">Most engaged</option>
            <option value="confidence">Least certain first</option>
          </select>
        </label>
        <div className={styles.formActions}>
          <button type="submit" className="btn">
            Apply
          </button>
          {active.length > 0 && (
            <Link href="/posts" className="btn btn-quiet">
              Clear filters
            </Link>
          )}
        </div>
      </AutoSubmitForm>

      <div className={styles.resultsHead}>
        <p className="tabular">
          <strong>{formatNumber(result.total)}</strong> {result.total === 1 ? "post matches" : "posts match"}
          {result.pages > 1 && (
            <span className="muted">
              {" "}
              · page {result.page} of {result.pages}
            </span>
          )}
        </p>
        <p className="section-note">Mock data holds a small set of example posts. Real data will hold every collected post.</p>
      </div>

      {result.items.length ? (
        <div className={styles.list}>
          {result.items.map((p) => (
            <PostCard key={p.id} post={p} narrativeTitle={narrativeTitle(p.narrativeId)} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No posts match these filters.</p>
          <p className="muted">
            Try removing a filter, or <Link href="/posts">clear them all</Link>.
          </p>
        </div>
      )}

      {result.pages > 1 && (
        <nav className={styles.pager} aria-label="Pages">
          {result.page > 1 ? (
            <Link href={pageHref(result.page - 1)} className="btn">
              Previous
            </Link>
          ) : (
            <span />
          )}
          {result.page < result.pages && (
            <Link href={pageHref(result.page + 1)} className="btn">
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
