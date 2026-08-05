import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Saved</p>
      <h1 className="font-display text-display-lg text-ink">Saved</h1>
      <p className="mt-4 text-sm text-smoke">Saved products land in Build order step 8.</p>
    </div>
  );
}
