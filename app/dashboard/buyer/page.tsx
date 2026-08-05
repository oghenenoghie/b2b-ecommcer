import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer overview",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Buyer overview</p>
      <h1 className="font-display text-display-lg text-ink">Buyer overview</h1>
      <p className="mt-4 text-sm text-smoke">Org orders, invoices, and RFQ summary land in Build order step 7.</p>
    </div>
  );
}
