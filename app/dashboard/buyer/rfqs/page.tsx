import type { Metadata } from "next";
import Link from "next/link";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listRfqsForCurrentOrg } from "@/lib/data/rfq";

export const metadata: Metadata = {
  title: "RFQs",
};

export default async function BuyerRfqsPage() {
  const rfqs = await listRfqsForCurrentOrg();

  return (
    <div>
      <p className="label mb-2">RFQs</p>
      <h1 className="font-display text-display-lg text-ink">RFQs</h1>

      {rfqs === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a buyer org to see your RFQs.</p>
      ) : rfqs.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No RFQs yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "id", label: "RFQ" },
              { key: "items", label: "Items", align: "right" },
              { key: "status", label: "Status" },
              { key: "created", label: "Created" },
            ]}
            rows={rfqs.map((rfq) => ({
              id: (
                <Link href={`/rfq/${rfq.id}`} className="data hover:underline">
                  {rfq.id.slice(0, 8)}
                </Link>
              ),
              items: rfq.itemCount,
              status: <Badge variant={rfq.status === "accepted" ? "stock" : "neutral"}>{rfq.status}</Badge>,
              created: new Date(rfq.createdAt).toLocaleDateString(),
            }))}
          />
        </div>
      )}
    </div>
  );
}
