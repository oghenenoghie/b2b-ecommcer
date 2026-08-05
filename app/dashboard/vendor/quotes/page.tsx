import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quotes",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Quotes</p>
      <h1 className="font-display text-display-lg text-ink">Quotes</h1>
      <p className="mt-4 text-sm text-smoke">RFQs to respond to with priced quotes land in Build order step 6.</p>
    </div>
  );
}
