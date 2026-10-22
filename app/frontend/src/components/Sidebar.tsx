"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatDateTime, formatNumber } from "@/lib/format";
import { LogoMark } from "./LogoMark";
import { NavIcon, type NavIconName } from "./NavIcon";
import styles from "./Sidebar.module.css";

const NAV: { href: string; label: string; icon: NavIconName; countKey?: "review" }[] = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/narratives", label: "Narratives", icon: "narratives" },
  { href: "/posts", label: "Posts", icon: "posts" },
  { href: "/brief", label: "Daily brief", icon: "brief" },
  { href: "/review", label: "Review queue", icon: "review", countKey: "review" },
  { href: "/topic", label: "Topic setup", icon: "topic" },
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
      <Link href="/" className={styles.brand}>
        <LogoMark className={styles.mark} />
        <span>PakPulse</span>
      </Link>

      <nav aria-label="Main" className={styles.nav}>
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.navLink}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <NavIcon name={item.icon} />
                <span className={styles.navLabel}>{item.label}</span>
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

      <div className={styles.topic}>
        <span className={styles.topicLabel}>Topic</span>
        <span className={styles.topicName}>{topicName}</span>
        <span className={`${styles.topicMeta} tabular`}>
          {snapshotCount} rounds · {formatNumber(postCount)} posts
        </span>
        <span className={`${styles.topicMeta} tabular`}>Last collected {formatDateTime(lastCollectedAt)}</span>
      </div>
    </aside>
  );
}
