import Link from "next/link";

import { formatDateTime } from "@/lib/format";
import { LANGUAGE_TAG, PLATFORM_LABEL } from "@/lib/labels";
import { engagementText, isLowConfidence } from "@/lib/post-utils";
import type { Post } from "@/lib/types";
import { LabelChips } from "./LabelChips";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
  narrativeTitle?: string | null;
  /** Compact cards hide engagement and the narrative line. */
  compact?: boolean;
  /** Citation number, shown when the card is a brief source. */
  number?: number;
  id?: string;
}

/** Post text in its own script and direction. Urdu renders right to left. */
export function PostText({ post, className }: { post: Post; className?: string }) {
  return (
    <p
      className={className}
      lang={post.language === "ur" ? "ur" : post.language === "ru" ? "ur-Latn" : "en"}
      dir={post.language === "ur" ? "rtl" : "ltr"}
    >
      {post.text}
    </p>
  );
}

export function PostMeta({ post }: { post: Post }) {
  return (
    <p className={styles.meta}>
      <span className={styles.platform}>{PLATFORM_LABEL[post.platform]}</span>
      <span lang={post.language === "ur" ? "ur" : undefined} className={styles.lang}>
        {LANGUAGE_TAG[post.language]}
      </span>
      <time dateTime={post.postedAt}>{formatDateTime(post.postedAt)}</time>
    </p>
  );
}

export function PostCard({ post, narrativeTitle, compact = false, number, id }: PostCardProps) {
  const low = isLowConfidence(post);
  return (
    <article className={styles.card} data-compact={compact || undefined} id={id}>
      <header className={styles.head}>
        {number !== undefined && <span className={`${styles.number} tabular`}>{number}</span>}
        <PostMeta post={post} />
        {low && <span className={styles.lowTag}>Needs review</span>}
      </header>

      <PostText post={post} className={styles.text} />

      <LabelChips labels={post.labels} />

      <footer className={styles.foot}>
        {!compact && narrativeTitle !== undefined && (
          <span>
            {narrativeTitle ? (
              <Link href={`/narratives/${post.narrativeId}`}>{narrativeTitle}</Link>
            ) : (
              <span className="muted">No narrative</span>
            )}
          </span>
        )}
        {!compact && (
          <span className="muted tabular">{engagementText(post)}</span>
        )}
        <Link href={`/posts/${post.id}`} className={styles.details}>
          Post details
        </Link>
      </footer>
    </article>
  );
}
