import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = { title: "Coffee Clubs" };

export default function CoffeeClubsPage() {
  return (
    <PagePlaceholder
      eyebrow="Coffee Clubs"
      title="Calm, local, credible."
      description="Monthly founder meetups across India. Pick your city from the menu — full chapter pages are coming soon."
    />
  );
}
