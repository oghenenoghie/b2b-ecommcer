import type { Metadata } from "next";

import { DataTable } from "@/components/dashboard/DataTable";
import { Badge } from "@/components/ui/badge";
import { listOrdersForCurrentOrg } from "@/lib/data/orders";
import { format } from "@/lib/money";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function BuyerOrdersPage() {
  const orders = await listOrdersForCurrentOrg("buyer");

  return (
    <div>
      <p className="label mb-2">Orders</p>
      <h1 className="font-display text-display-lg text-ink">Orders</h1>

      {orders === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a buyer org to see your orders.</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No orders yet.</p>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={[
              { key: "vendor", label: "Vendor" },
              { key: "po", label: "PO number" },
              { key: "status", label: "Status" },
              { key: "total", label: "Total", align: "right" },
            ]}
            rows={orders.map((order) => ({
              vendor: order.counterpartyName,
              po: order.poNumber ?? "—",
              status: <Badge>{order.status}</Badge>,
              total: format(order.total),
            }))}
          />
        </div>
      )}
    </div>
  );
}
