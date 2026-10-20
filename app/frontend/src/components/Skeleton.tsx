import styles from "./Skeleton.module.css";

export function SkeletonBlock({ height = 16, width = "100%" }: { height?: number; width?: number | string }) {
  return <span className={styles.block} style={{ height, width }} aria-hidden="true" />;
}

/** Generic page skeleton: header, a figure strip, a chart and a list. */
export function PageSkeleton() {
  return (
    <div className={styles.page} role="status" aria-live="polite">
      <span className="visually-hidden">Loading</span>
      <div className={styles.header}>
        <SkeletonBlock height={14} width={120} />
        <SkeletonBlock height={30} width={260} />
        <SkeletonBlock height={14} width={340} />
      </div>
      <div className={styles.strip}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.figure}>
            <SkeletonBlock height={12} width={90} />
            <SkeletonBlock height={28} width={110} />
          </div>
        ))}
      </div>
      <div className={styles.panel}>
        <SkeletonBlock height={16} width={200} />
        <SkeletonBlock height={220} />
      </div>
      <div className={styles.panel}>
        <SkeletonBlock height={16} width={160} />
        <SkeletonBlock height={14} />
        <SkeletonBlock height={14} width="80%" />
        <SkeletonBlock height={14} width="90%" />
      </div>
    </div>
  );
}
