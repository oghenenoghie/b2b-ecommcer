import type { Metadata } from "next";

import { RfqForm } from "@/components/commerce/RfqForm";

export const metadata: Metadata = {
  title: "Request a quote",
};

export default function RfqPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <p className="label mb-2">RFQ</p>
      <h1 className="font-display text-display-lg text-ink">Request for quote</h1>
      <p className="mt-4 text-sm text-smoke">
        Submit products + quantities; vendors respond with priced quotes.
      </p>
      <div className="mt-8">
        <RfqForm />
      </div>
    </div>
  );
}
