import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFQs",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">RFQs</p>
      <h1 className="font-display text-display-lg text-ink">RFQs</h1>
      <p className="mt-4 text-sm text-smoke">RFQ + quote thread list lands in Build order step 6.</p>
    </div>
  );
}
