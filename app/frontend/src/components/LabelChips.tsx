import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatConfidence } from "@/lib/format";
import { cssVar, EMOTION_LABEL, SENTIMENT_META, STANCE_META } from "@/lib/labels";
import type { PostLabels } from "@/lib/types";
import styles from "./LabelChips.module.css";

interface ChipProps {
  name: string;
  value: string;
  confidence: number;
  swatch?: string;
  hatched?: boolean;
}

function Chip({ name, value, confidence, swatch, hatched }: ChipProps) {
  const low = confidence < REVIEW_THRESHOLD;
  return (
    <li className={styles.chip} data-low={low || undefined}>
      <span className={styles.name}>{name}</span>
      {swatch && <span className={styles.swatch} style={{ background: cssVar(swatch) }} />}
      {hatched && <span className={`${styles.swatch} ${styles.hatch}`} />}
      <span className={styles.value}>{value}</span>
      <span className={`${styles.confidence} tabular`} title="Confidence score">
        {formatConfidence(confidence)}
        {low && <span className="visually-hidden"> (low confidence)</span>}
      </span>
    </li>
  );
}

/** All four labels on a post, each with its confidence. Low-confidence chips get a dashed outline. */
export function LabelChips({ labels }: { labels: PostLabels }) {
  const { stance, sentiment, emotion, sarcasm } = labels;
  return (
    <ul className={styles.chips} aria-label="Labels">
      <Chip
        name="Stance"
        value={STANCE_META[stance.value].label}
        swatch={STANCE_META[stance.value].token}
        confidence={stance.confidence}
      />
      <Chip
        name="Mood"
        value={SENTIMENT_META[sentiment.value].label}
        swatch={SENTIMENT_META[sentiment.value].token}
        confidence={sentiment.confidence}
      />
      <Chip name="Emotion" value={EMOTION_LABEL[emotion.value]} confidence={emotion.confidence} />
      <Chip
        name="Sarcasm"
        value={sarcasm.value ? "Likely" : "Not likely"}
        hatched={sarcasm.value}
        confidence={sarcasm.confidence}
      />
    </ul>
  );
}
