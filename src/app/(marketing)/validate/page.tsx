import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "Validate your idea" };

export default function ValidatePage() {
  return (
    <PagePlaceholder
      eyebrow="Validation Engine"
      title="Get your idea reviewed."
      description="A custom score, clear feedback and 3 actionable next steps — mentor-reviewed today, AI-powered soon."
    />
  );
}
