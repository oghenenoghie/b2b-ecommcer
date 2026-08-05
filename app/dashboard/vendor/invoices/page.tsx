import type { Metadata } from "next";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listInvoicesForCurrentOrg } from "@/lib/data/invoices";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function VendorInvoicesPage() {
  const invoices = await listInvoicesForCurrentOrg("vendor");

  return (
    <div>
      <p className="label mb-2">Invoices</p>
      <h1 className="font-display text-display-lg text-ink">Invoices issued</h1>

      {invoices === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a vendor org to see issued invoices.</p>
      ) : invoices.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No invoices yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "number", label: "Number" },
              { key: "terms", label: "Terms" },
              { key: "due", label: "Due" },
              { key: "status", label: "Status" },
              { key: "amount", label: "Amount", align: "right" },
            ]}
            rows={invoices.map((invoice) => ({
              number: <span className="data">{invoice.number}</span>,
              terms: invoice.terms.replace("_", " "),
              due: new Date(invoice.dueAt).toLocaleDateString(),
              status: <Badge variant={invoice.status === "overdue" ? "error" : invoice.status === "paid" ? "stock" : "neutral"}>{invoice.status}</Badge>,
              amount: format(invoice.amount),
            }))}
          />
        </div>
      )}
    </div>
  );
}
