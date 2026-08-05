import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

// URL-synced filters (?q=&category=&max=&sort=) — shareable, SEO. Wires to
// the hybrid search RPC in Build order step 4 (references/ai-search.md).
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; max?: string; sort?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="label mb-2">Search</p>
      <h1 className="font-display text-display-lg text-ink">
        {q ? `Results for "${q}"` : "All products"}
      </h1>
      <p className="mt-4 text-sm text-smoke">
        Hybrid search results render here once the catalog + pgvector RPC ship
        (Build order step 4).
      </p>
    </div>
  );
}
