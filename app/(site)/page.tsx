import type { Metadata } from "next";
import Link from "next/link";

import { ProcurementBar } from "@/components/common/ProcurementBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { ResultGrid } from "@/components/ai/ResultGrid";
import { listTopLevelCategories } from "@/lib/data/categories";
import { listActiveProducts } from "@/lib/data/products";
import { listApprovedVendors } from "@/lib/data/vendors";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const [categories, featured, vendors] = await Promise.all([
    listTopLevelCategories(),
    listActiveProducts({ limit: 8 }),
    listApprovedVendors(4),
  ]);

  return (
    <div>
      <section className="border-b border-line bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label mb-6">AI procurement</p>
          <h1 className="font-display text-display-xl italic leading-tight text-ink">
            Describe what you need to source.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body text-smoke">
            Aswaq turns plain language into a ranked search over real, in-stock
            industrial inventory — no dropdown maze.
          </p>
          <div className="mt-10">
            <ProcurementBar />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="bg-bone px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="label mb-8">Browse by category</p>
            <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
              {categories.map((category) => (
                <FadeIn key={category.slug}>
                  <Link
                    href={`/c/${category.slug}`}
                    className="group flex aspect-[4/3] flex-col justify-end bg-paper p-6 transition-colors hover:bg-ink"
                  >
                    <span className="font-display text-lg text-ink group-hover:text-paper">
                      {category.name}
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-baseline justify-between">
            <p className="label">Featured products</p>
            <Link href="/search" className="text-sm text-smoke hover:text-ink">
              View all
            </Link>
          </div>
          {featured.length > 0 ? (
            <ResultGrid products={featured} />
          ) : (
            <p className="text-sm text-smoke">
              No products yet — seed the catalog (supabase/seed.sql) or add some from a vendor dashboard.
            </p>
          )}
        </div>
      </section>

      {vendors.length > 0 && (
        <section className="bg-bone px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <p className="label mb-8">Featured vendors</p>
            <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
              {vendors.map((vendor) => (
                <Link
                  key={vendor.id}
                  href={`/v/${vendor.slug}`}
                  className="border border-line bg-paper p-6 transition-colors hover:border-ink"
                >
                  <p className="font-display text-base text-ink">{vendor.displayName}</p>
                  {vendor.bio ? <p className="mt-2 line-clamp-2 text-sm text-smoke">{vendor.bio}</p> : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
