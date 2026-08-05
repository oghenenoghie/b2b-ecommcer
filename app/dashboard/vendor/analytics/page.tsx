import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Analytics</p>
      <h1 className="font-display text-display-lg text-ink">Analytics</h1>
      <p className="mt-4 text-sm text-smoke">Revenue + top products (recharts) land in Build order step 7.</p>
    </div>
  );
}
