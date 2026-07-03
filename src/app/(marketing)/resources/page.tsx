import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <PagePlaceholder
      eyebrow="Resources"
      title="Insights, toolkits and free stuff."
      description="Founder stories, templates and lead magnets to help you execute fast. Library is coming soon."
    />
  );
}
