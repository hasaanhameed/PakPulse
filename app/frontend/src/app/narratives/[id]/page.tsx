import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { KeyTerms } from "@/components/KeyTerms";
import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { Legend, ProportionBar } from "@/components/ProportionBar";
import { SnapshotColumns } from "@/components/SnapshotColumns";
import { TrendTag } from "@/components/TrendTag";
import { getNarrative, getNarrativePosts, getTopic } from "@/lib/api";
import { formatChange, formatNumber, formatShare } from "@/lib/format";
import { LANGUAGE_LABEL } from "@/lib/labels";
import { postsHref } from "@/lib/post-utils";
import { stanceSegments } from "@/lib/segments";
import styles from "./narrative.module.css";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const n = await getNarrative(id);
  return { title: n?.title ?? "Narrative" };
}

export default async function NarrativePage({ params }: Params) {
  const { id } = await params;
  const [narrative, topic, samples] = await Promise.all([
    getNarrative(id),
    getTopic(),
    getNarrativePosts(id, 6),
  ]);
  if (!narrative) notFound();

  const stance = stanceSegments(narrative.stance, { narrative: narrative.id });
  const snapshotLabels = topic.snapshots.map((s) => s.label);

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link href="/narratives" className={styles.back}>
            Narratives
          </Link>
        }
        title={narrative.title}
        meta={narrative.summary}
        actions={
          <Link href={postsHref({ narrative: narrative.id })} className="btn">
            View all posts
          </Link>
        }
      />

      <dl className={styles.facts}>
        <div>
          <dt>Posts</dt>
          <dd className="tabular">{formatNumber(narrative.posts)}</dd>
        </div>
        <div>
          <dt>Change since last round</dt>
          <dd>
            <span className="tabular">{narrative.change === null ? "New" : formatChange(narrative.change)}</span>
            {narrative.trend !== "steady" && <TrendTag trend={narrative.trend} />}
          </dd>
        </div>
        <div>
          <dt>Likely sarcastic</dt>
          <dd className="tabular">{Math.round(narrative.sarcasmShare * 100)}%</dd>
        </div>
        <div>
          <dt>Main languages</dt>
          <dd>{narrative.mainLanguages.map((l) => LANGUAGE_LABEL[l]).join(", ")}</dd>
        </div>
      </dl>

      <div className={styles.columns}>
        <section className={`panel ${styles.block}`} aria-labelledby="per-snapshot">
          <h2 id="per-snapshot" className="section-title">
            Posts per round
          </h2>
          <SnapshotColumns values={narrative.bySnapshot} labels={snapshotLabels} />
        </section>

        <section className={`panel ${styles.block}`} aria-labelledby="stance-mix">
          <h2 id="stance-mix" className="section-title">
            Stance
          </h2>
          <ProportionBar segments={stance} size="lg" label={`Stance in ${narrative.title}`} />
          <Legend segments={stance} />
          {narrative.sarcasmShare > 0.3 && (
            <p className={styles.caution}>
              {Math.round(narrative.sarcasmShare * 100)}% of these posts are likely sarcastic, so stance
              labels here are less certain than elsewhere. Check the{" "}
              <Link href={postsHref({ narrative: narrative.id, confidence: "low" })}>
                low-confidence posts
              </Link>
              .
            </p>
          )}
          <div className={styles.terms}>
            <h3 className={styles.subTitle}>Key terms</h3>
            <KeyTerms terms={narrative.keyTerms} />
          </div>
        </section>
      </div>

      <section aria-labelledby="samples" className={styles.samples}>
        <div className={styles.samplesHead}>
          <h2 id="samples" className="section-title">
            Sample posts
          </h2>
          <p className="section-note">
            Most engaged first.{" "}
            {formatShare(narrative.stance.critical, narrative.posts)} of this narrative is critical.
          </p>
        </div>
        {samples.length ? (
          <div className={styles.grid}>
            {samples.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <p className="muted">No sample posts in the mock data for this narrative.</p>
        )}
      </section>
    </div>
  );
}
