import { REVIEW_THRESHOLD } from "@/lib/config";
import { cssVar, EMOTION_LABEL, SENTIMENT_META, STANCE_META } from "@/lib/labels";
import type { LabelKey, PostLabels } from "@/lib/types";
import { ConfidenceMeter } from "./ConfidenceMeter";
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
      <span className={styles.confidence} title="Confidence score">
        <ConfidenceMeter confidence={confidence} />
        {low && <span className="visually-hidden"> (low confidence)</span>}
      </span>
    </li>
  );
}

/**
 * A post's labels, each with its confidence. Low-confidence chips get a dashed outline.
 * `only` shows a subset, e.g. stance and mood on compact cards.
 */
export function LabelChips({ labels, only }: { labels: PostLabels; only?: LabelKey[] }) {
  const { stance, sentiment, emotion, sarcasm } = labels;
  const show = (key: LabelKey) => !only || only.includes(key);
  return (
    <ul className={styles.chips} aria-label="Labels">
      {show("stance") && (
        <Chip
          name="Stance"
          value={STANCE_META[stance.value].label}
          swatch={STANCE_META[stance.value].token}
          confidence={stance.confidence}
        />
      )}
      {show("sentiment") && (
        <Chip
          name="Mood"
          value={SENTIMENT_META[sentiment.value].label}
          swatch={SENTIMENT_META[sentiment.value].token}
          confidence={sentiment.confidence}
        />
      )}
      {show("emotion") && <Chip name="Emotion" value={EMOTION_LABEL[emotion.value]} confidence={emotion.confidence} />}
      {show("sarcasm") && (
        <Chip
          name="Sarcasm"
          value={sarcasm.value ? "Likely" : "Not likely"}
          hatched={sarcasm.value}
          confidence={sarcasm.confidence}
        />
      )}
    </ul>
  );
}
