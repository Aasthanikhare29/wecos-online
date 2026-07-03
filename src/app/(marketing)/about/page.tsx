import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="About"
      title="We're here to raise founders."
      description="Calm-tech growth, a business backbone and an earning ecosystem — built for India's next generation of founders."
    />
  );
}
