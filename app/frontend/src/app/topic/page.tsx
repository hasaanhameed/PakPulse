import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { getTopic } from "@/lib/api";
import { TopicForm } from "./TopicForm";

export const metadata: Metadata = { title: "Topic setup" };

export default async function TopicPage() {
  const topic = await getTopic();
  return (
    <div>
      <PageHeader
        title="Topic setup"
        meta="Keywords and key accounts decide what gets collected. Keep the keyword set small: every extra keyword costs money."
      />
      <TopicForm topic={topic} />
    </div>
  );
}
