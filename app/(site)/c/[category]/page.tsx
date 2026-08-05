import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultGrid } from "@/components/ai/ResultGrid";
import { getCategoryBySlug } from "@/lib/data/categories";
import { listActiveProducts } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const record = await getCategoryBySlug(category);
  return { title: record?.name ?? category.replace(/-/g, " ") };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const products = await listActiveProducts({ categorySlug: slug, limit: 48 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="label mb-2">Category</p>
      <h1 className="font-display text-display-lg text-ink">{category.name}</h1>
      <div className="mt-10">
        <ResultGrid products={products} />
      </div>
    </div>
  );
}
