import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultGrid } from "@/components/ai/ResultGrid";
import { getVendorBySlug } from "@/lib/data/vendors";
import { listActiveProducts } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string }>;
}): Promise<Metadata> {
  const vendor = await getVendorBySlug((await params).vendor);
  return { title: vendor?.displayName ?? "Vendor" };
}

export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor: slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) notFound();

  const products = await listActiveProducts({ vendorSlug: slug, limit: 48 });

  return (
    <div>
      <div className="border-b border-line bg-bone px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="label mb-2">Vendor storefront</p>
          <h1 className="font-display text-display-lg text-ink">{vendor.displayName}</h1>
          {vendor.bio ? <p className="mt-4 max-w-2xl text-sm text-smoke">{vendor.bio}</p> : null}
          {vendor.ratingAvg ? (
            <p className="mt-2 font-mono text-sm tabular-nums text-smoke">{vendor.ratingAvg.toFixed(1)} / 5</p>
          ) : null}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <ResultGrid products={products} />
      </div>
    </div>
  );
}
