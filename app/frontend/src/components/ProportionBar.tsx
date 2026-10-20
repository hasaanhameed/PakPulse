import Link from "next/link";

import { cssVar } from "@/lib/labels";
import { formatNumber, formatShare } from "@/lib/format";
import styles from "./ProportionBar.module.css";

export interface Segment {
  key: string;
  label: string;
  value: number;
  /** CSS variable name, e.g. "--kiln". */
  token: string;
  /** Where the segment leads: the posts behind it. */
  href?: string;
}

interface ProportionBarProps {
  segments: Segment[];
  size?: "lg" | "md" | "sm";
  /** Accessible summary prefix, e.g. "Stance in Urdu posts". */
  label: string;
}

/** A 100% stacked bar. Every segment shows its count on hover and links to its posts. */
export function ProportionBar({ segments, size = "md", label }: ProportionBarProps) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const summary = `${label}: ${segments
    .map((s) => `${s.label} ${formatShare(s.value, total)}`)
    .join(", ")}`;

  return (
    <div className={`${styles.bar} ${styles[size]}`} role="group" aria-label={summary}>
      {segments
        .filter((s) => s.value > 0)
        .map((s) => {
          const content = (
            <span className={styles.tip} role="tooltip">
              <span className={styles.tipLabel}>
                <span className={styles.swatch} style={{ background: cssVar(s.token) }} />
                {s.label}
              </span>
              <span className="tabular">
                {formatNumber(s.value)} posts, {formatShare(s.value, total)}
              </span>
            </span>
          );
          const style = { flexGrow: s.value, background: cssVar(s.token) };
          return s.href ? (
            <Link
              key={s.key}
              href={s.href}
              className={styles.segment}
              style={style}
              aria-label={`${s.label}: ${formatNumber(s.value)} posts. View posts`}
            >
              {content}
            </Link>
          ) : (
            <span key={s.key} className={styles.segment} style={style} tabIndex={0}>
              {content}
            </span>
          );
        })}
    </div>
  );
}

interface LegendProps {
  segments: Segment[];
  showValues?: boolean;
}

/** Legend for a proportion bar. Text stays in ink; the swatch carries the color. */
export function Legend({ segments, showValues = true }: LegendProps) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <ul className={styles.legend}>
      {segments.map((s) => (
        <li key={s.key} className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: cssVar(s.token) }} />
          <span>{s.label}</span>
          {showValues && (
            <span className={`${styles.legendValue} tabular`}>
              {formatShare(s.value, total)}
              <span className={styles.legendCount}> · {formatNumber(s.value)}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
