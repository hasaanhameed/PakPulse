import Link from "next/link";

import { InfoTip } from "@/components/InfoTip";
import { PageHeader } from "@/components/PageHeader";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PostCard } from "@/components/PostCard";
import { Legend, ProportionBar } from "@/components/ProportionBar";
import { PulseChart } from "@/components/PulseChart";
import { Sparkline } from "@/components/Sparkline";
import { TrendTag } from "@/components/TrendTag";
import { getBrief, getNarratives, getOverview, getPostsByIds, getTopic } from "@/lib/api";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatChange, formatDateTime, formatNumber, formatShare } from "@/lib/format";
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
import type { Emotion } from "@/lib/types";
import styles from "./page.module.css";

/** Emotions take the color of the mood they lean to, so color still means something (DESIGN.md -> Data colors). */
const EMOTION_TOKEN: Record<Emotion, string> = {
  anger: "--jamun",
  worry: "--jamun",
  disappointment: "--jamun",
  hope: "--haldi",
  humour: "--slate",
  none: "--stone",
};

export default async function OverviewPage() {
  const [topic, overview, narratives, brief] = await Promise.all([
    getTopic(),
    getOverview(),
    getNarratives("growth"),
    getBrief(),
  ]);
  const { totals } = overview;
  const rounds = topic.snapshots;
  const last = rounds[rounds.length - 1];
  const prev = rounds[rounds.length - 2] ?? last;
  const criticalShare = (s: (typeof rounds)[number]) => s.byStance.critical / s.posts;
  const criticalChange = Math.round((criticalShare(last) - criticalShare(prev)) * 100);
  const mood = sentimentSegments(totals.sentiment);
  const maxEmotion = Math.max(...EMOTIONS.map((e) => totals.emotion[e]));
  const emotionsBySize = [...EMOTIONS].sort((a, b) => totals.emotion[b] - totals.emotion[a]);
  const topRising = narratives[0];
  const sparkMax = Math.max(...narratives.flatMap((n) => n.bySnapshot));

  // Three claims from the latest brief that rest on posts, and one post behind each.
  const findings = (brief?.sections ?? []).flatMap((s) => s.items).filter((i) => i.cites.length > 0).slice(0, 3);
  const evidence = await getPostsByIds([...new Set(findings.map((f) => f.cites[0]))]);
  const narrativeTitle = new Map(narratives.map((n) => [n.id, n.title]));

  return (
    <div>
      <PageHeader
        title="Overview"
        meta={<span className="tabular">Round {rounds.length} collected {formatDateTime(last.collectedAt)} PKT</span>}
        actions={
          <Link href="/brief" className="btn btn-primary">
            Open the brief
          </Link>
        }
      />

      <section className={`${styles.pulse} on-forest`} aria-label="Post volume">
        <div className={styles.pulseHead}>
          <div>
            <p className={styles.pulseLabel}>Posts analysed</p>
            <p className={`${styles.pulseValue} tabular`}>{formatNumber(totals.posts)}</p>
          </div>
          <ul className={styles.platforms}>
            {PLATFORMS.map((p) => (
              <li key={p}>
                <PlatformIcon platform={p} size={16} />
                {PLATFORM_LABEL[p]}
                <span className="tabular">{formatNumber(rounds.reduce((a, s) => a + s.byPlatform[p], 0))}</span>
              </li>
            ))}
          </ul>
          <InfoTip topic="this chart">
            Posts per 6-hour window. Each round holds the posts made since the previous round. Times in PKT.
          </InfoTip>
        </div>
        <PulseChart bins={overview.volume} snapshots={rounds} />
      </section>

      <section className={styles.figures} aria-label="Key figures">
        <div className={`${styles.figure} ${styles.figureWide}`}>
          <div className={styles.figureText}>
            <p className="eyebrow">Critical posts</p>
            <p className={`${styles.figureValue} tabular`}>{formatShare(totals.stance.critical, totals.posts)}</p>
            <p className={styles.figureNote}>
              <span className="tabular">
                {criticalChange >= 0 ? "↑" : "↓"} {Math.abs(criticalChange)} pts
              </span>{" "}
              in round {rounds.length}
            </p>
          </div>
          <div
            className={styles.roundBars}
            role="img"
            aria-label={`Critical share by round: ${rounds.map((s) => formatShare(s.byStance.critical, s.posts)).join(", ")}`}
          >
            {rounds.map((s, i) => (
              <span key={s.id} className={styles.roundBar}>
                <span
                  className={styles.roundBarFill}
                  data-latest={i === rounds.length - 1 || undefined}
                  style={{ height: `${Math.round(criticalShare(s) * 80)}px` }}
                />
                <span className="tabular">R{i + 1}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.figure}>
          <p className="eyebrow">Likely sarcastic</p>
          <p className={styles.figureRow}>
            <span className={`${styles.figureValue} tabular`}>{formatShare(totals.sarcasmLikely, totals.posts)}</span>
            <Link href={postsHref({ sarcasm: "likely" })} className="tabular">
              {formatNumber(totals.sarcasmLikely)} posts
            </Link>
          </p>
          <p className={styles.figureNote}>Least reliable label so far</p>
        </div>

        <Link href="/review" className={`${styles.figure} ${styles.figureLink}`}>
          <p className="eyebrow">Waiting for review</p>
          <p className={`${styles.figureValue} tabular`}>{formatNumber(totals.reviewQueue)}</p>
          <p className={styles.figureNote}>
            Below <span className="tabular">{REVIEW_THRESHOLD.toFixed(2)}</span> confidence
          </p>
        </Link>

        {topRising && (
          <Link href={`/narratives/${topRising.id}`} className={`${styles.figure} ${styles.figureWide} ${styles.figureLink}`}>
            <div className={styles.figureText}>
              <p className={styles.figureRow}>
                <span className="eyebrow">Fastest growing</span>
                <TrendTag trend={topRising.trend} />
              </p>
              <p className={styles.risingTitle}>{topRising.title}</p>
              <p className={styles.figureRow}>
                <span className={`${styles.risingValue} tabular`}>
                  {topRising.change === null ? "New" : formatChange(topRising.change)}
                </span>
                <span className={`${styles.figureNote} tabular`}>
                  {topRising.bySnapshot.slice(-2).map(formatNumber).join(" → ")} posts
                </span>
              </p>
            </div>
          </Link>
        )}
      </section>

      <div className={styles.columns}>
        <section className={`panel ${styles.block}`} aria-labelledby="stance-title">
          <div className={styles.blockHead}>
            <h2 id="stance-title" className="section-title">
              Stance toward the topic
            </h2>
            <InfoTip topic="stance">
              Whether a post supports, criticises or stays neutral on the topic. Select a segment to see its posts.
            </InfoTip>
          </div>
          <ProportionBar segments={stanceSegments(totals.stance)} size="lg" label="Stance, all posts" />
          <Legend segments={stanceSegments(totals.stance)} />

          <div className={styles.rows}>
            <h3 className="eyebrow">Critical share by language and platform</h3>
            {LANGUAGES.map((l) => {
              const counts = overview.stanceByLanguage[l];
              const n = STANCES.reduce((a, s) => a + counts[s], 0);
              return (
                <div key={l} className={styles.row}>
                  <span className={styles.rowLabel}>{LANGUAGE_LABEL[l]}</span>
                  <ProportionBar segments={stanceSegments(counts, { language: l })} label={`Stance in ${LANGUAGE_LABEL[l]} posts`} />
                  <span className={`${styles.rowValue} tabular`} data-high={counts.critical / n > 0.6 || undefined}>
                    {formatShare(counts.critical, n)}
                  </span>
                </div>
              );
            })}
            {PLATFORMS.map((p) => {
              const counts = overview.stanceByPlatform[p];
              const n = STANCES.reduce((a, s) => a + counts[s], 0);
              return (
                <div key={p} className={styles.row}>
                  <span className={styles.rowLabel}>{PLATFORM_LABEL[p]}</span>
                  <ProportionBar segments={stanceSegments(counts, { platform: p })} label={`Stance on ${PLATFORM_LABEL[p]}`} />
                  <span className={`${styles.rowValue} tabular`} data-high={counts.critical / n > 0.6 || undefined}>
                    {formatShare(counts.critical, n)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`panel ${styles.block}`} aria-labelledby="mood-title">
          <div className={styles.blockHead}>
            <h2 id="mood-title" className="section-title">
              Mood and emotion
            </h2>
            <InfoTip topic="mood">How posts feel, separate from where they stand on the topic.</InfoTip>
          </div>
          <ProportionBar segments={mood} size="lg" label="Mood, all posts" />
          <Legend segments={mood} />

          <div className={styles.rows}>
            <h3 className="eyebrow">Main emotion</h3>
            <ul className={styles.emotions}>
              {emotionsBySize.map((e) => (
                <li key={e}>
                  <Link href={postsHref({ emotion: e })} className={styles.emotion}>
                    <span className={styles.rowLabel}>{EMOTION_LABEL[e]}</span>
                    <span className={styles.emotionTrack}>
                      <span
                        className={styles.emotionBar}
                        style={{ width: `${(totals.emotion[e] / maxEmotion) * 100}%`, background: `var(${EMOTION_TOKEN[e]})` }}
                      />
                    </span>
                    <span className={`${styles.rowValue} tabular`}>{formatNumber(totals.emotion[e])}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className={`panel ${styles.block}`} aria-labelledby="narratives-title">
        <div className={styles.blockHead}>
          <h2 id="narratives-title" className="section-title">
            Narratives to watch
          </h2>
          <span className={styles.headNote}>Change: round {rounds.length - 1} to round {rounds.length}</span>
          <Link href="/narratives" className="link-arrow">
            All narratives →
          </Link>
        </div>
        <div className={styles.tableScroll}>
          <ul className={styles.narratives}>
            {narratives.slice(0, 6).map((n) => (
              <li key={n.id}>
                <Link href={`/narratives/${n.id}`} className={styles.narrative}>
                  <span className={styles.narrativeTitle}>
                    {n.title}
                    {n.trend !== "steady" && <TrendTag trend={n.trend} />}
                  </span>
                  <Sparkline values={n.bySnapshot} max={sparkMax} label={`Posts per round: ${n.bySnapshot.join(", ")}`} />
                  <span className={`${styles.narrativeCount} tabular`}>{formatNumber(n.posts)}</span>
                  <span className={`${styles.narrativeChange} tabular`}>
                    {n.change === null ? "New" : formatChange(n.change)}
                  </span>
                  <span className={styles.narrativeMix}>
                    {/* The whole row is a link, so the bar inside must not hold links of its own. */}
                    <ProportionBar
                      segments={stanceSegments(n.stance).map(({ href: _href, ...s }) => s)}
                      size="sm"
                      label={`Stance in ${n.title}`}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {brief && findings.length > 0 && (
        <div className={styles.evidence}>
          <section className={`panel ${styles.block}`} aria-labelledby="findings-title">
            <div className={styles.blockHead}>
              <h2 id="findings-title" className="section-title">
                Three things to know
              </h2>
              <Link href={`/brief?id=${brief.id}`} className="link-arrow">
                Full brief →
              </Link>
            </div>
            <ol className={styles.findings}>
              {findings.map((f, i) => (
                <li key={f.text} className={styles.finding}>
                  <span className={`${styles.findingNumber} tabular`}>{i + 1}</span>
                  <div className={styles.findingBody}>
                    <p>{f.text}</p>
                    <Link href={`/brief?id=${brief.id}`} className={styles.findingSources}>
                      <span className="tabular">{f.cites.length}</span> source {f.cites.length === 1 ? "post" : "posts"}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={`panel ${styles.block}`} aria-labelledby="evidence-title">
            <div className={styles.blockHead}>
              <h2 id="evidence-title" className="section-title">
                Posts behind the change
              </h2>
              <Link href="/posts" className="link-arrow">
                All posts →
              </Link>
            </div>
            <div className={styles.evidencePosts}>
              {evidence.map((p) => (
                <PostCard key={p.id} post={p} narrativeTitle={p.narrativeId ? narrativeTitle.get(p.narrativeId) ?? null : null} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
