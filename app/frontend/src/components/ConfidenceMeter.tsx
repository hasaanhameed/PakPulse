import { formatConfidence } from "@/lib/format";
import styles from "./ConfidenceMeter.module.css";

/**
 * Confidence as four rising bars (like signal strength) plus the score.
 * The bars give a quick read; the number stays for precision (D-013).
 */
export function ConfidenceMeter({ confidence, showValue = true }: { confidence: number; showValue?: boolean }) {
  const filled = Math.round(confidence * 4);
  return (
    <span className={styles.meter}>
      <span className={styles.bars} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.bar} data-on={i < filled || undefined} />
        ))}
      </span>
      {showValue && <span className={`${styles.value} tabular`}>{formatConfidence(confidence)}</span>}
    </span>
  );
}
