import type { Metadata } from "next";
import Link from "next/link";

import { listRfqsForCurrentOrg } from "@/lib/data/rfq";

export const metadata: Metadata = {
  title: "Request a quote",
};

export default async function RfqPage() {
  const rfqs = await listRfqsForCurrentOrg();

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <p className="label mb-2">RFQ</p>
      <h1 className="font-display text-display-lg text-ink">Request for quote</h1>
      <p className="mt-4 text-sm text-smoke">
        RFQs are submitted from a quote-only product&rsquo;s page — browse the catalog and use{" "}
        <span className="text-ink">Request quote</span> on any POA item.
      </p>
      <Link href="/search" className="mt-4 inline-block text-sm text-ink underline underline-offset-4">
        Browse products
      </Link>

      {rfqs === null ? (
        <p className="mt-10 border-t border-line pt-6 text-sm text-smoke">
          Sign in to a buyer org to see your RFQs — no auth UI exists in this scaffold yet.
        </p>
      ) : rfqs.length > 0 ? (
        <div className="mt-10 border-t border-line pt-6">
          <p className="label mb-4">Your RFQs</p>
          <ul className="space-y-3">
            {rfqs.map((rfq) => (
              <li key={rfq.id}>
                <Link
                  href={`/rfq/${rfq.id}`}
                  className="flex items-center justify-between border border-line px-4 py-3 text-sm hover:border-ink"
                >
                  <span className="font-mono tabular-nums text-ink">
                    RFQ {rfq.id.slice(0, 8)} &middot; {rfq.itemCount} item{rfq.itemCount === 1 ? "" : "s"}
                  </span>
                  <span className="label">{rfq.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-10 border-t border-line pt-6 text-sm text-smoke">No RFQs yet.</p>
      )}
    </div>
  );
}
