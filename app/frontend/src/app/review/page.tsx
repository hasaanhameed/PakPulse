import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getOverview, getReviewQueue } from "@/lib/api";
import { REVIEW_THRESHOLD } from "@/lib/config";
import { formatNumber } from "@/lib/format";
import { ReviewQueue } from "./ReviewQueue";

export const metadata: Metadata = { title: "Review queue" };

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ post?: string }> }) {
  const { post } = await searchParams;
  const [queue, overview] = await Promise.all([getReviewQueue(), getOverview()]);

  return (
    <div>
      <PageHeader
        title="Review queue"
        meta={
          <>
            {formatNumber(overview.totals.reviewQueue)} posts have a label below{" "}
            {REVIEW_THRESHOLD.toFixed(2)} confidence. Your corrections become the test set for measuring
            accuracy. The threshold is a placeholder until it is agreed.
          </>
        }
      />
      <ReviewQueue posts={queue} initialId={post} />
    </div>
  );
}
