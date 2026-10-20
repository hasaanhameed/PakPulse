import type { NarrativeTrend } from "@/lib/types";
import styles from "./TrendTag.module.css";

const LABEL: Record<NarrativeTrend, string> = {
  emerging: "Emerging",
  growing: "Growing fast",
  steady: "Steady",
  fading: "Fading",
};

/** Text tag for a narrative's trend. Ink only: growth is not good or bad in itself. */
export function TrendTag({ trend }: { trend: NarrativeTrend }) {
  return (
    <span className={styles.tag} data-trend={trend}>
      {LABEL[trend]}
    </span>
  );
}
