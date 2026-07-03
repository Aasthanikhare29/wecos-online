import type { Metadata } from "next";
import { cities } from "@/config/site";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const found = cities.find((c) => c.slug === city);
  return { title: found ? `${found.name} Coffee Club` : "Coffee Club" };
}

export default async function CityCoffeeClubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const found = cities.find((c) => c.slug === city);
  const name = found?.name ?? city;

  return (
    <PagePlaceholder
      eyebrow="Coffee Club"
      title={`${name} Coffee Club`}
      description={`Monthly founder meetups in ${name}. RSVP, members and discussions are coming soon.`}
    />
  );
}
