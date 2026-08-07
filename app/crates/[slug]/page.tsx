import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CRATES, getCrateBySlug } from "@/lib/data/crates";
import { CrateDetailView } from "@/components/CrateDetailView";

export function generateStaticParams() {
  return CRATES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const crate = getCrateBySlug(slug);
  if (!crate) return {};
  return {
    title: `${crate.name} — Slotcase`,
    description: crate.shortDescription,
  };
}

export default async function CratePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const crate = getCrateBySlug(slug);
  if (!crate) notFound();

  return <CrateDetailView crate={crate} />;
}
