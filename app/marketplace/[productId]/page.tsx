import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, findProduct } from "@/lib/data/products";
import { ProductDetailView } from "@/components/ProductDetailView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ productId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) return {};
  return {
    title: `${product.name} — Slotcase Marketplace`,
    description: product.blurb,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
