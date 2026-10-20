import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { PostMeta, PostText } from "@/components/PostCard";
import { getBriefsCiting, getNarrative, getPost, getTopic } from "@/lib/api";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatConfidence, formatDate } from "@/lib/format";
import { cssVar, EMOTION_LABEL, LANGUAGE_LABEL, SENTIMENT_META, STANCE_META } from "@/lib/labels";
import { engagementText, isLowConfidence } from "@/lib/post-utils";
import styles from "./post.module.css";

type Params = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Post details" };

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const [narrative, topic, citedIn] = await Promise.all([
    post.narrativeId ? getNarrative(post.narrativeId) : Promise.resolve(null),
    getTopic(),
    getBriefsCiting(post.id),
  ]);
  const snapshot = topic.snapshots.find((s) => s.id === post.snapshotId);
  const { stance, sentiment, emotion, sarcasm } = post.labels;

  const rows = [
    { name: "Stance", value: STANCE_META[stance.value].label, token: STANCE_META[stance.value].token, confidence: stance.confidence },
    { name: "Mood", value: SENTIMENT_META[sentiment.value].label, token: SENTIMENT_META[sentiment.value].token, confidence: sentiment.confidence },
    { name: "Emotion", value: EMOTION_LABEL[emotion.value], token: null, confidence: emotion.confidence },
    { name: "Sarcasm", value: sarcasm.value ? "Likely sarcastic" : "Not likely sarcastic", token: null, confidence: sarcasm.confidence },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link href="/posts" className={styles.back}>
            Posts
          </Link>
        }
        title="Post details"
        meta={`${LANGUAGE_LABEL[post.language]} post from ${snapshot?.label ?? "an unknown snapshot"}.`}
        actions={
          isLowConfidence(post) ? (
            <Link href={`/review?post=${post.id}`} className="btn btn-primary">
              Review labels
            </Link>
          ) : undefined
        }
      />

      <div className={styles.layout}>
        <article className={`panel ${styles.post}`}>
          <PostMeta post={post} />
          <PostText post={post} className={styles.text} />
          <p className="muted tabular">{engagementText(post)}</p>
          <p className={styles.source}>
            {post.sourceUrl ? (
              <a href={post.sourceUrl} target="_blank" rel="noreferrer">
                Open the original post
              </a>
            ) : (
              <span className="muted">Mock post. There is no original to open.</span>
            )}
          </p>
        </article>

        <aside className={styles.side}>
          <section className="panel">
            <h2 className="section-title">Labels</h2>
            <p className="section-note">
              Scores below {REVIEW_THRESHOLD.toFixed(2)} send the post to the review queue.
              {post.usedContext && " The labeller used the parent post as context."}
            </p>
            <ul className={styles.labels}>
              {rows.map((r) => {
                const low = r.confidence < REVIEW_THRESHOLD;
                return (
                  <li key={r.name} className={styles.label} data-low={low || undefined}>
                    <span className={styles.labelName}>{r.name}</span>
                    <span className={styles.labelValue}>
                      {r.token && <span className={styles.swatch} style={{ background: cssVar(r.token) }} />}
                      {r.value}
                    </span>
                    <span className={styles.meter} aria-hidden="true">
                      <span className={styles.meterFill} style={{ width: `${r.confidence * 100}%` }} />
                      <span className={styles.meterMark} style={{ left: `${REVIEW_THRESHOLD * 100}%` }} />
                    </span>
                    <span className={`${styles.score} tabular`}>
                      {formatConfidence(r.confidence)}
                      {low && <span className={styles.lowText}> low</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="panel">
            <h2 className="section-title">Where this post is used</h2>
            <ul className={styles.uses}>
              <li>
                <span className="muted">Narrative</span>
                {narrative ? (
                  <Link href={`/narratives/${narrative.id}`}>{narrative.title}</Link>
                ) : (
                  <span>None</span>
                )}
              </li>
              <li>
                <span className="muted">Cited in</span>
                {citedIn.length ? (
                  <span>
                    {citedIn.map((b, i) => (
                      <span key={b.id}>
                        {i > 0 && ", "}
                        <Link href={`/brief?id=${b.id}`}>Brief of {formatDate(b.date)}</Link>
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>No brief</span>
                )}
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
