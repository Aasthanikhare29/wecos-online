import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "Studios" };

export default function StudiosPage() {
  return (
    <PagePlaceholder
      eyebrow="WeCos Studios"
      title="Premium services, built for founders."
      description="In-house teams across technology, marketing, HR, accounting and legal. Service pages are coming soon."
    />
  );
}
