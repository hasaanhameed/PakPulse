import type { Metadata } from "next";
import { IBM_Plex_Sans, Noto_Nastaliq_Urdu, Source_Serif_4 } from "next/font/google";

import { Sidebar } from "@/components/Sidebar";
import { getOverview, getTopic } from "@/lib/api";
import "./globals.css";
import styles from "./layout.module.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
  display: "swap",
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-urdu",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "PakPulse", template: "%s · PakPulse" },
  description: "Narrative and sentiment monitoring across X, Instagram and Threads.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [topic, overview] = await Promise.all([getTopic(), getOverview()]);

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${urdu.variable}`}>
      <body>
        <div className={styles.app}>
          <Sidebar
            topicName={topic.name}
            snapshotCount={topic.snapshots.length}
            postCount={overview.totals.posts}
            lastCollectedAt={topic.snapshots[topic.snapshots.length - 1].collectedAt}
            reviewCount={overview.totals.reviewQueue}
          />
          <main className={styles.main} id="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
