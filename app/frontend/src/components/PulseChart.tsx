import { formatNumber } from "@/lib/format";
import type { Snapshot, VolumeBin } from "@/lib/types";
import styles from "./PulseChart.module.css";

interface PulseChartProps {
  bins: VolumeBin[];
  snapshots: Snapshot[];
}

const W = 1000;
const H = 120;
const TOP = 12;
const BASE = 110;

/**
 * The signature chart: total posts per 6-hour window as one heartbeat-like line, echoing the logo.
 * Dashed lines mark where each collection round begins. Drawn on the Forest night band.
 */
export function PulseChart({ bins, snapshots }: PulseChartProps) {
  const totals = bins.map((b) => b.supportive + b.neutral + b.critical);
  const max = Math.max(...totals, 1);
  const step = bins.length > 1 ? W / (bins.length - 1) : W;
  const pts = totals.map((v, i) => [i * step, BASE - (v / max) * (BASE - TOP)] as const);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `M0 ${BASE} L${line.split(" ").join(" L")} L${W} ${BASE} Z`;

  // How many bins fall in each round's window, to place the boundaries and size the labels.
  const perRound = snapshots.map(
    (s) =>
      bins.filter((b) => {
        const t = new Date(b.start).getTime();
        return t >= new Date(s.windowStart).getTime() && t < new Date(s.collectedAt).getTime();
      }).length,
  );
  const boundaries: number[] = [];
  perRound.reduce((acc, n, i) => {
    if (i > 0) boundaries.push((acc - 0.5) * step);
    return acc + n;
  }, 0);

  const peak = totals.indexOf(max);
  const summary = `Posts per 6-hour window across ${snapshots.length} collection rounds. Highest: ${formatNumber(
    max,
  )} posts in window ${peak + 1} of ${bins.length}.`;

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={summary} className={styles.svg}>
        <line x1="0" y1={BASE} x2={W} y2={BASE} className={styles.base} />
        {boundaries.map((x) => (
          <line key={x} x1={x} y1="4" x2={x} y2={BASE} className={styles.boundary} />
        ))}
        <path d={area} className={styles.area} />
        <polyline points={line} className={styles.line} />
      </svg>
      <figcaption className={styles.rounds}>
        {snapshots.map((s, i) => (
          <span key={s.id} style={{ flexGrow: Math.max(perRound[i], 1) }}>
            Round {i + 1} <span className="tabular">{formatNumber(s.posts)}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
