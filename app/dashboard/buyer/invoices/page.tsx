import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Invoices</p>
      <h1 className="font-display text-display-lg text-ink">Invoices</h1>
      <p className="mt-4 text-sm text-smoke">Invoice list + overdue status lands in Build order step 6.</p>
    </div>
  );
}
