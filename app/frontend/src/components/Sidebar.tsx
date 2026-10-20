"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatDateTime, formatNumber } from "@/lib/format";
import { LogoMark } from "./LogoMark";
import styles from "./Sidebar.module.css";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/narratives", label: "Narratives" },
  { href: "/posts", label: "Posts" },
  { href: "/brief", label: "Daily brief" },
  { href: "/review", label: "Review queue", countKey: "review" as const },
  { href: "/topic", label: "Topic setup" },
];

interface SidebarProps {
  topicName: string;
  snapshotCount: number;
  postCount: number;
  lastCollectedAt: string;
  reviewCount: number;
}

export function Sidebar({ topicName, snapshotCount, postCount, lastCollectedAt, reviewCount }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link href="/" className={styles.brand}>
          <LogoMark className={styles.mark} />
          <span>PakPulse</span>
        </Link>

        <div className={styles.topic}>
          <span className={styles.topicLabel}>Topic</span>
          <span className={styles.topicName}>{topicName}</span>
          <span className={styles.topicMeta}>
            {snapshotCount} snapshots, {formatNumber(postCount)} posts
            <br />
            Last collected {formatDateTime(lastCollectedAt)}
          </span>
        </div>
      </div>

      <nav aria-label="Main" className={styles.nav}>
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.navLink}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <span>{item.label}</span>
                {item.countKey === "review" && (
                  <span className={`${styles.count} tabular`} aria-label={`${reviewCount} waiting`}>
                    {formatNumber(reviewCount)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
