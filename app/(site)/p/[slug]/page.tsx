import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

// Product detail — gallery, tiers, MOQ, RFQ or add-to-cart, reviews. Quote-only
// (POA) products show "Request quote" instead of "Add to cart" (commerce.md).
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-square bg-bone" />
        <div>
          <p className="label mb-2">Vendor</p>
          <h1 className="font-display text-display-lg capitalize text-ink">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="mt-4 text-sm text-smoke">
            Gallery, price tiers, MOQ, and RFQ/add-to-cart land in Build order step 3.
          </p>
          <div className="mt-8">
            <Button>Request quote</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
