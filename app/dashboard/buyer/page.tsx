import type { Metadata } from "next";

import { getCurrentMembership } from "@/lib/data/org";
import { listOrdersForCurrentOrg } from "@/lib/data/orders";
import { listInvoicesForCurrentOrg } from "@/lib/data/invoices";
import { listRfqsForCurrentOrg } from "@/lib/data/rfq";

export const metadata: Metadata = {
  title: "Buyer overview",
};

export default async function BuyerOverviewPage() {
  const membership = await getCurrentMembership();

  if (!membership) {
    return (
      <div>
        <p className="label mb-2">Buyer overview</p>
        <h1 className="font-display text-display-lg text-ink">Buyer overview</h1>
        <p className="mt-4 text-sm text-smoke">
          Sign in to a buyer org to see your dashboard — no auth UI exists in this scaffold yet.
        </p>
      </div>
    );
  }

  const [orders, invoices, rfqs] = await Promise.all([
    listOrdersForCurrentOrg("buyer"),
    listInvoicesForCurrentOrg("buyer"),
    listRfqsForCurrentOrg(),
  ]);

  const stats = [
    { label: "Orders", value: orders?.length ?? 0 },
    { label: "Open invoices", value: invoices?.filter((i) => i.status !== "paid").length ?? 0 },
    { label: "Open RFQs", value: rfqs?.filter((r) => r.status === "open" || r.status === "quoted").length ?? 0 },
  ];

  return (
    <div>
      <p className="label mb-2">{membership.orgName}</p>
      <h1 className="font-display text-display-lg text-ink">Buyer overview</h1>
      <div className="mt-8 grid grid-cols-3 gap-px bg-line">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-paper p-6">
            <p className="data text-2xl">{stat.value}</p>
            <p className="label mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
