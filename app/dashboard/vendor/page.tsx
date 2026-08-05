import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor overview",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Vendor overview</p>
      <h1 className="font-display text-display-lg text-ink">Vendor overview</h1>
      <p className="mt-4 text-sm text-smoke">Incoming orders, quotes, and revenue summary land in Build order step 7.</p>
    </div>
  );
}
