import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  /** Small line above the title, e.g. a breadcrumb. */
  eyebrow?: React.ReactNode;
  /** One line of context under the title. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, eyebrow, meta, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.title}>{title}</h1>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
