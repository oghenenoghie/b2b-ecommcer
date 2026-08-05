import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Products</p>
      <h1 className="font-display text-display-lg text-ink">Products</h1>
      <p className="mt-4 text-sm text-smoke">Catalog CRUD (categories, media, price tiers) lands in Build order step 3.</p>
    </div>
  );
}
