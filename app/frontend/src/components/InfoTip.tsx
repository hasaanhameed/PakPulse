import styles from "./InfoTip.module.css";

interface InfoTipProps {
  /** What the tip explains, e.g. "stance". Read out as "About stance". */
  topic: string;
  children: React.ReactNode;
}

/**
 * A small "i" button that shows an explanation on hover or keyboard focus.
 * Used instead of a sentence under every heading, to keep screens light (DESIGN.md -> Less text).
 */
export function InfoTip({ topic, children }: InfoTipProps) {
  return (
    <span className={styles.wrap}>
      <button type="button" className={styles.button} aria-label={`About ${topic}`}>
        i
      </button>
      <span className={styles.tip} role="tooltip">
        {children}
      </span>
    </span>
  );
}
