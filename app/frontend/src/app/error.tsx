"use client";

import styles from "./status.module.css";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={styles.status} role="alert">
      <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" className={styles.errorIcon}>
        <path d="M8 1.5 15 14H1L8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="12" r="0.9" fill="currentColor" />
      </svg>
      <h1 className={styles.title}>This screen could not load its data</h1>
      <p className="muted">Data already collected is safe. Try again, and if it keeps failing, check the backend.</p>
      <button type="button" className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
