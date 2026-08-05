import type { Metadata } from "next";
import Link from "next/link";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listCurrentVendorQuotes } from "@/lib/data/vendor-dashboard";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Quotes",
};

export default async function VendorQuotesPage() {
  const quotes = await listCurrentVendorQuotes();

  return (
    <div>
      <p className="label mb-2">Quotes</p>
      <h1 className="font-display text-display-lg text-ink">Quotes</h1>

      {quotes === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a vendor org to see RFQs to quote.</p>
      ) : quotes.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No quotes yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "rfq", label: "RFQ" },
              { key: "buyer", label: "Buyer" },
              { key: "status", label: "Status" },
              { key: "total", label: "Total", align: "right" },
            ]}
            rows={quotes.map((quote) => ({
              rfq: (
                <Link href={`/rfq/${quote.rfqId}`} className="data hover:underline">
                  {quote.rfqId.slice(0, 8)}
                </Link>
              ),
              buyer: quote.buyerOrgName,
              status: <Badge variant={quote.status === "accepted" ? "stock" : "neutral"}>{quote.status}</Badge>,
              total: format(quote.total),
            }))}
          />
        </div>
      )}
    </div>
  );
}
