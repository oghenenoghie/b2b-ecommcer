import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return { title: category.replace(/-/g, " ") };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="label mb-2">Category</p>
      <h1 className="font-display text-display-lg capitalize text-ink">
        {category.replace(/-/g, " ")}
      </h1>
      <p className="mt-4 text-sm text-smoke">
        Category browse + facet rail lands in Build order step 3.
      </p>
    </div>
  );
}
