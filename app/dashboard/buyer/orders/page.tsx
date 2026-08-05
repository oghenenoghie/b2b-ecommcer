import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Orders</p>
      <h1 className="font-display text-display-lg text-ink">Orders</h1>
      <p className="mt-4 text-sm text-smoke">Per-vendor order list (RLS-scoped to this org) lands in Build order step 6.</p>
    </div>
  );
}
