import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { Legend, ProportionBar } from "@/components/ProportionBar";
import { TrendTag } from "@/components/TrendTag";
import { VolumeChart } from "@/components/VolumeChart";
import { getBrief, getNarratives, getOverview, getTopic } from "@/lib/api";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatChange, formatDate, formatNumber, formatShare, formatShortDate } from "@/lib/format";
import {
  EMOTION_LABEL,
  EMOTIONS,
  LANGUAGE_LABEL,
  LANGUAGES,
  PLATFORM_LABEL,
  PLATFORMS,
  STANCES,
} from "@/lib/labels";
import { postsHref } from "@/lib/post-utils";
import { sentimentSegments, stanceSegments } from "@/lib/segments";
import styles from "./page.module.css";

export default async function OverviewPage() {
  const [topic, overview, narratives, brief] = await Promise.all([
    getTopic(),
    getOverview(),
    getNarratives("size"),
    getBrief(),
  ]);
  const { totals } = overview;
  const first = topic.snapshots[0];
  const last = topic.snapshots[topic.snapshots.length - 1];
  const mood = sentimentSegments(totals.sentiment);
  const maxEmotion = Math.max(...EMOTIONS.map((e) => totals.emotion[e]));

  return (
    <div>
      <PageHeader
        title="Overview"
        meta={
          <>
            {topic.name} · {topic.snapshots.length} snapshots, {formatShortDate(first.windowStart)} to{" "}
            {formatDate(last.collectedAt)} · Times in PKT
          </>
        }
        actions={
          <Link href="/brief" className="btn">
            Read the latest brief
          </Link>
        }
      />

      <section className={styles.figures} aria-label="Key figures">
        <div className={`${styles.figure} ${styles.hero}`}>
          <p className={styles.figureLabel}>Posts analysed</p>
          <p className={styles.figureValue}>{formatNumber(totals.posts)}</p>
          <p className={styles.figureNote}>
            {PLATFORMS.map((p) => `${PLATFORM_LABEL[p]} ${formatNumber(
              topic.snapshots.reduce((a, s) => a + s.byPlatform[p], 0),
            )}`).join(" · ")}
          </p>
        </div>
        <div className={styles.figure}>
          <p className={styles.figureLabel}>Critical posts</p>
          <p className={styles.figureValue}>{formatShare(totals.stance.critical, totals.posts)}</p>
          <p className={styles.figureNote}>
            {formatShare(first.byStance.critical, first.posts)} in snapshot 1,{" "}
            {formatShare(last.byStance.critical, last.posts)} in snapshot {topic.snapshots.length}
          </p>
        </div>
        <div className={styles.figure}>
          <p className={styles.figureLabel}>Likely sarcastic</p>
          <p className={styles.figureValue}>{formatShare(totals.sarcasmLikely, totals.posts)}</p>
          <p className={styles.figureNote}>
            <Link href={postsHref({ sarcasm: "likely" })}>{formatNumber(totals.sarcasmLikely)} posts</Link>.
            Least reliable label so far
          </p>
        </div>
        <div className={styles.figure}>
          <p className={styles.figureLabel}>Waiting for review</p>
          <p className={styles.figureValue}>{formatNumber(totals.reviewQueue)}</p>
          <p className={styles.figureNote}>
            <Link href="/review">Labels below {REVIEW_THRESHOLD.toFixed(2)} confidence</Link>
          </p>
        </div>
      </section>

      <section className={`panel ${styles.block}`} aria-labelledby="volume-title">
        <div className={styles.blockHead}>
          <div>
            <h2 id="volume-title" className="section-title">
              Posts over time, by stance
            </h2>
            <p className="section-note">
              6-hour windows. Lines S1 to S3 mark when each snapshot was collected; each one holds the
              posts made since the previous snapshot.
            </p>
          </div>
          <Legend segments={stanceSegments(totals.stance)} showValues={false} />
        </div>
        <VolumeChart data={overview.volume} snapshots={topic.snapshots} />
      </section>

      <div className={styles.columns}>
        <section className={`panel ${styles.block}`} aria-labelledby="stance-title">
          <div>
            <h2 id="stance-title" className="section-title">
              Stance toward the topic
            </h2>
            <p className="section-note">Select a segment to see its posts.</p>
          </div>
          <div className={styles.stack}>
            <ProportionBar segments={stanceSegments(totals.stance)} size="lg" label="Stance, all posts" />
            <Legend segments={stanceSegments(totals.stance)} />
          </div>

          <div className={styles.rows}>
            <h3 className={styles.rowsTitle}>By language</h3>
            {LANGUAGES.map((l) => {
              const counts = overview.stanceByLanguage[l];
              const n = STANCES.reduce((a, s) => a + counts[s], 0);
              return (
                <div key={l} className={styles.row}>
                  <span className={styles.rowLabel}>{LANGUAGE_LABEL[l]}</span>
                  <ProportionBar
                    segments={stanceSegments(counts, { language: l })}
                    label={`Stance in ${LANGUAGE_LABEL[l]} posts`}
                  />
                  <span className={`${styles.rowValue} tabular`}>
                    {formatShare(counts.critical, n)} critical
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.rows}>
            <h3 className={styles.rowsTitle}>By platform</h3>
            {PLATFORMS.map((p) => {
              const counts = overview.stanceByPlatform[p];
              const n = STANCES.reduce((a, s) => a + counts[s], 0);
              return (
                <div key={p} className={styles.row}>
                  <span className={styles.rowLabel}>{PLATFORM_LABEL[p]}</span>
                  <ProportionBar
                    segments={stanceSegments(counts, { platform: p })}
                    label={`Stance on ${PLATFORM_LABEL[p]}`}
                  />
                  <span className={`${styles.rowValue} tabular`}>
                    {formatShare(counts.critical, n)} critical
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`panel ${styles.block}`} aria-labelledby="mood-title">
          <div>
            <h2 id="mood-title" className="section-title">
              Mood
            </h2>
            <p className="section-note">How posts feel, separate from where they stand.</p>
          </div>
          <div className={styles.stack}>
            <ProportionBar segments={mood} size="lg" label="Mood, all posts" />
            <Legend segments={mood} />
          </div>

          <div className={styles.rows}>
            <h3 className={styles.rowsTitle}>Main emotion</h3>
            <ul className={styles.emotions}>
              {EMOTIONS.map((e) => (
                <li key={e}>
                  <Link href={postsHref({ emotion: e })} className={styles.emotion}>
                    <span className={styles.rowLabel}>{EMOTION_LABEL[e]}</span>
                    <span className={styles.emotionTrack}>
                      <span
                        className={styles.emotionBar}
                        style={{ width: `${(totals.emotion[e] / maxEmotion) * 100}%` }}
                      />
                    </span>
                    <span className={`${styles.rowValue} tabular`}>
                      {formatNumber(totals.emotion[e])}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className={`panel ${styles.block}`} aria-labelledby="narratives-title">
        <div className={styles.blockHead}>
          <div>
            <h2 id="narratives-title" className="section-title">
              Largest narratives
            </h2>
            <p className="section-note">Change compares the last two snapshots.</p>
          </div>
          <Link href="/narratives" className="link-arrow">
            All narratives
          </Link>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Narrative</th>
                <th scope="col" className={styles.num}>
                  Posts
                </th>
                <th scope="col" className={styles.num}>
                  Change
                </th>
                <th scope="col" className={styles.mixCol}>
                  Stance mix
                </th>
              </tr>
            </thead>
            <tbody>
              {narratives.slice(0, 5).map((n) => (
                <tr key={n.id}>
                  <td>
                    <Link href={`/narratives/${n.id}`} className={styles.narrativeLink}>
                      {n.title}
                    </Link>
                    {(n.trend === "emerging" || n.trend === "growing") && <TrendTag trend={n.trend} />}
                  </td>
                  <td className={`${styles.num} tabular`}>{formatNumber(n.posts)}</td>
                  <td className={`${styles.num} tabular`}>{n.change === null ? "New" : formatChange(n.change)}</td>
                  <td className={styles.mixCol}>
                    <ProportionBar
                      segments={stanceSegments(n.stance, { narrative: n.id })}
                      size="sm"
                      label={`Stance in ${n.title}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {brief && (
        <section className={`panel ${styles.block} ${styles.brief}`} aria-labelledby="brief-title">
          <div className={styles.blockHead}>
            <div>
              <h2 id="brief-title" className="section-title">
                From the latest brief
              </h2>
              <p className="section-note">{formatDate(brief.date)}. Drafted by AI, linked to source posts.</p>
            </div>
            <Link href={`/brief?id=${brief.id}`} className="link-arrow">
              Read the full brief
            </Link>
          </div>
          <div className={styles.briefText}>
            {brief.sections[0].items.map((item) => (
              <p key={item.text}>{item.text}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
