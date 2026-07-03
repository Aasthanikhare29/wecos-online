import type { Metadata } from "next";
import { resources } from "@/config/site";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = resources.find((r) => r.slug === slug);
  return { title: found?.name ?? "Resources" };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = resources.find((r) => r.slug === slug);

  return (
    <PagePlaceholder
      eyebrow="Resources"
      title={found?.name ?? "Resource"}
      description={found?.summary ?? "This resource is coming soon."}
    />
  );
}
