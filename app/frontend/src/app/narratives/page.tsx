import type { Metadata } from "next";
import Link from "next/link";

import { KeyTerms } from "@/components/KeyTerms";
import { PageHeader } from "@/components/PageHeader";
import { ProportionBar } from "@/components/ProportionBar";
import { SnapshotColumns } from "@/components/SnapshotColumns";
import { TrendTag } from "@/components/TrendTag";
import { getNarratives, getTopic, getUnclusteredCount } from "@/lib/api";
import { formatChange, formatNumber, formatShare } from "@/lib/format";
import { postsHref } from "@/lib/post-utils";
import { stanceSegments } from "@/lib/segments";
import styles from "./narratives.module.css";

export const metadata: Metadata = { title: "Narratives" };

export default async function NarrativesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort = sortParam === "growth" ? "growth" : "size";
  const [narratives, topic, unclustered] = await Promise.all([
    getNarratives(sort),
    getTopic(),
    getUnclusteredCount(),
  ]);
  const snapshotLabels = topic.snapshots.map((_, i) => `S${i + 1}`);

  return (
    <div>
      <PageHeader
        title="Narratives"
        meta={`${narratives.length} narratives found across ${topic.snapshots.length} snapshots. Change compares the last two snapshots.`}
        actions={
          <nav className={styles.sort} aria-label="Sort narratives">
            <Link href="/narratives" aria-current={sort === "size" ? "true" : undefined}>
              Largest
            </Link>
            <Link href="/narratives?sort=growth" aria-current={sort === "growth" ? "true" : undefined}>
              Fastest growing
            </Link>
          </nav>
        }
      />

      <ol className={styles.list}>
        {narratives.map((n, i) => {
          const critical = formatShare(n.stance.critical, n.posts);
          return (
            <li key={n.id} className={styles.item}>
              <span className={`${styles.rank} tabular`}>{i + 1}</span>

              <div className={styles.body}>
                <h2 className={styles.title}>
                  <Link href={`/narratives/${n.id}`}>{n.title}</Link>
                  {n.trend !== "steady" && <TrendTag trend={n.trend} />}
                </h2>
                <p className={styles.summary}>{n.summary}</p>
                <KeyTerms terms={n.keyTerms} />
              </div>

              <dl className={styles.stats}>
                <div>
                  <dt>Posts</dt>
                  <dd className="tabular">{formatNumber(n.posts)}</dd>
                </div>
                <div>
                  <dt>Change</dt>
                  <dd className="tabular">{n.change === null ? "New" : formatChange(n.change)}</dd>
                </div>
                <div>
                  <dt>By round</dt>
                  <dd>
                    <SnapshotColumns values={n.bySnapshot} labels={snapshotLabels} mini />
                  </dd>
                </div>
              </dl>

              <div className={styles.mix}>
                <ProportionBar
                  segments={stanceSegments(n.stance, { narrative: n.id })}
                  label={`Stance in ${n.title}`}
                />
                <p className={styles.mixNote}>
                  {critical} critical · {formatShare(n.stance.supportive, n.posts)} supportive
                </p>
                <Link href={postsHref({ narrative: n.id })} className={styles.postsLink}>
                  View posts
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <p className={styles.footnote}>
        {formatNumber(unclustered)} posts did not fit any narrative.{" "}
        <Link href="/posts">Browse all posts</Link>
      </p>
    </div>
  );
}
