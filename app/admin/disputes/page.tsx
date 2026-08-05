import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disputes",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Disputes</p>
      <h1 className="font-display text-display-lg text-ink">Disputes</h1>
      <p className="mt-4 text-sm text-smoke">Order/review dispute handling lands in Build order step 7.</p>
    </div>
  );
}
