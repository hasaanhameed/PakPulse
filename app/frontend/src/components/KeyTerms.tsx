import { LANGUAGE_LABEL } from "@/lib/labels";
import type { KeyTerm } from "@/lib/types";
import styles from "./KeyTerms.module.css";

/** Key terms in their own script. Urdu terms render right to left. */
export function KeyTerms({ terms }: { terms: KeyTerm[] }) {
  return (
    <ul className={styles.terms} aria-label="Key terms">
      {terms.map((t) => (
        <li
          key={t.text}
          className={styles.term}
          lang={t.language === "ur" ? "ur" : undefined}
          dir={t.language === "ur" ? "rtl" : undefined}
          title={LANGUAGE_LABEL[t.language]}
        >
          {t.text}
        </li>
      ))}
    </ul>
  );
}
