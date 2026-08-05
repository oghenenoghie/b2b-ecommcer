import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendor: string }>;
}): Promise<Metadata> {
  const { vendor } = await params;
  return { title: vendor.replace(/-/g, " ") };
}

export default async function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const { vendor } = await params;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="label mb-2">Vendor storefront</p>
      <h1 className="font-display text-display-lg capitalize text-ink">
        {vendor.replace(/-/g, " ")}
      </h1>
      <p className="mt-4 text-sm text-smoke">
        Vendor profile + product grid land in Build order step 3.
      </p>
    </div>
  );
}
