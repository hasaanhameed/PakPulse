import { formatNumber } from "@/lib/format";
import styles from "./SnapshotColumns.module.css";

interface SnapshotColumnsProps {
  values: number[];
  labels: string[];
  /** Small inline version for lists: no value labels, latest column emphasised. */
  mini?: boolean;
}

/** Posts per snapshot as a single-series column chart. The latest snapshot is in ink. */
export function SnapshotColumns({ values, labels, mini = false }: SnapshotColumnsProps) {
  const max = Math.max(...values, 1);
  const summary = values.map((v, i) => `${labels[i]}: ${formatNumber(v)}`).join(", ");

  return (
    <div className={styles.chart} data-mini={mini || undefined} role="img" aria-label={`Posts per snapshot. ${summary}`}>
      {values.map((v, i) => (
        <div key={labels[i]} className={styles.col} title={`${labels[i]}: ${formatNumber(v)} posts`}>
          {!mini && <span className={`${styles.value} tabular`}>{formatNumber(v)}</span>}
          <span className={styles.track}>
            <span
              className={styles.bar}
              data-latest={i === values.length - 1 || undefined}
              style={{ height: `${Math.max((v / max) * 100, 2)}%` }}
            />
          </span>
          {!mini && <span className={styles.label}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}
