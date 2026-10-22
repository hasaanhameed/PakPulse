import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { PostCard } from "@/components/PostCard";
import { getBrief, getPostsByIds, getTopic, listBriefs } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import styles from "./brief.module.css";

export const metadata: Metadata = { title: "Daily brief" };

export default async function BriefPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const [brief, all, topic] = await Promise.all([getBrief(id), listBriefs(), getTopic()]);
  if (!brief) notFound();

  // Number each cited post once, in order of first citation.
  const order: string[] = [];
  for (const section of brief.sections) {
    for (const item of section.items) {
      for (const c of item.cites) if (!order.includes(c)) order.push(c);
    }
  }
  const sources = await getPostsByIds(order);
  const numberOf = (postId: string) => order.indexOf(postId) + 1;
  const snapshot = topic.snapshots.find((s) => s.id === brief.snapshotId);

  return (
    <div>
      <PageHeader
        title={`Brief for ${formatDate(brief.date)}`}
        meta={
          <>
            Drafted by AI from {snapshot?.label.toLowerCase() ?? "the latest round"} at{" "}
            {formatDateTime(brief.generatedAt)}. Every claim links to the posts it rests on. Check them
            before you share anything.
          </>
        }
        actions={
          <nav className={styles.dates} aria-label="Other briefs">
            {all.map((b) => (
              <Link
                key={b.id}
                href={`/brief?id=${b.id}`}
                aria-current={b.id === brief.id ? "page" : undefined}
              >
                {formatDate(b.date)}
              </Link>
            ))}
          </nav>
        }
      />

      <div className={styles.layout}>
        <article className={styles.brief}>
          {brief.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.items.map((item) => (
                <p key={item.text} className={styles.claim}>
                  {item.text}
                  {item.cites.length > 0 ? (
                    <span className={styles.cites}>
                      {item.cites.map((c) => (
                        <a
                          key={c}
                          href={`#source-${c}`}
                          className={`${styles.cite} tabular`}
                          aria-label={`Source ${numberOf(c)}`}
                        >
                          {numberOf(c)}
                        </a>
                      ))}
                    </span>
                  ) : (
                    <span className={styles.dataNote}>Data note</span>
                  )}
                </p>
              ))}
            </section>
          ))}
        </article>

        <aside className={styles.sources} aria-labelledby="sources-title">
          <h2 id="sources-title" className={styles.sourcesTitle}>
            Sources <span className="muted tabular">{sources.length}</span>
          </h2>
          <ol className={styles.sourceList}>
            {sources.map((p) => (
              <li key={p.id}>
                <PostCard post={p} compact number={numberOf(p.id)} id={`source-${p.id}`} />
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
