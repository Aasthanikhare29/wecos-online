import type { Metadata } from "next";
import { studios } from "@/config/site";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export function generateStaticParams() {
  return studios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = studios.find((s) => s.slug === slug);
  return { title: found ? `${found.name} Studio` : "Studios" };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = studios.find((s) => s.slug === slug);

  return (
    <PagePlaceholder
      eyebrow="WeCos Studios"
      title={found ? `${found.name} Studio` : "Studio"}
      description={found?.summary ?? "This studio is coming soon."}
    />
  );
}
