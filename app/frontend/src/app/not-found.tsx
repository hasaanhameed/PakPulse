import Link from "next/link";

import styles from "./status.module.css";

export default function NotFound() {
  return (
    <div className={styles.status}>
      <h1 className={styles.title}>Nothing here</h1>
      <p className="muted">This page, post or narrative does not exist in the current data.</p>
      <Link href="/" className="btn">
        Back to the overview
      </Link>
    </div>
  );
}
