import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform admin",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Platform admin</p>
      <h1 className="font-display text-display-lg text-ink">Platform admin</h1>
      <p className="mt-4 text-sm text-smoke">Marketplace-level metrics land in Build order step 7.</p>
    </div>
  );
}
