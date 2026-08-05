import type { Metadata } from "next";
import Link from "next/link";

import { ResultGrid } from "@/components/ai/ResultGrid";
import { searchProducts } from "@/lib/search";
import { listActiveProducts, getProductCardsByIds } from "@/lib/data/products";
import { listTopLevelCategories } from "@/lib/data/categories";
import { toMinor } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types";

export const metadata: Metadata = {
  title: "Search",
};

type SearchPageParams = { q?: string; category?: string; max?: string; qty?: string };

// URL-synced filters (?q=&category=&max=&qty=) — shareable, SEO. Uses the
// hybrid search RPC when a query is present, otherwise falls back to a
// plain filtered catalog listing.
export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
  const params = await searchParams;
  const categories = await listTopLevelCategories();

  let products: ProductCardData[] = [];
  try {
    if (params.q) {
      const rows = await searchProducts({
        queryText: params.q,
        category: params.category,
        maxPriceMinor: params.max ? toMinor(Number(params.max), "KWD") : null,
        minQty: params.qty ? Number(params.qty) : null,
      });
      products = await getProductCardsByIds((rows ?? []).map((r) => r.id));
    } else {
      products = await listActiveProducts({
        categorySlug: params.category,
        maxPriceMinor: params.max ? toMinor(Number(params.max), "KWD") : null,
        minQty: params.qty ? Number(params.qty) : null,
      });
    }
  } catch (error) {
    console.error("search page", error);
    products = [];
  }

  const buildHref = (overrides: Partial<SearchPageParams>) => {
    const next = new URLSearchParams({ ...params, ...overrides } as Record<string, string>);
    for (const [key, value] of [...next.entries()]) if (!value) next.delete(key);
    const qs = next.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="label mb-2">Search</p>
      <h1 className="font-display text-display-lg text-ink">
        {params.q ? `Results for "${params.q}"` : "All products"}
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[200px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="label mb-3">Category</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={buildHref({ category: undefined })}
                  className={cn("text-smoke hover:text-ink", !params.category && "text-ink")}
                >
                  All
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={buildHref({ category: category.slug })}
                    className={cn("text-smoke hover:text-ink", params.category === category.slug && "text-ink")}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <ResultGrid products={products} />
        </div>
      </div>
    </div>
  );
}
