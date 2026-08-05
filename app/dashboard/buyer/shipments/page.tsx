import type { Metadata } from "next";

import { ShipmentTimeline } from "@/components/commerce/ShipmentTimeline";
import { listShipmentsForCurrentOrg } from "@/lib/data/shipments";

export const metadata: Metadata = {
  title: "Shipments",
};

export default async function BuyerShipmentsPage() {
  const shipments = await listShipmentsForCurrentOrg("buyer");

  return (
    <div>
      <p className="label mb-2">Shipments</p>
      <h1 className="font-display text-display-lg text-ink">Shipments</h1>

      {shipments === null ? (
        <p className="mt-6 text-sm text-smoke">Sign in to a buyer org to see your shipments.</p>
      ) : shipments.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">No shipments yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="border border-line bg-paper p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="label">{shipment.carrier ?? "Carrier TBD"}</span>
                {shipment.trackingNumber ? (
                  <span className="font-mono text-xs tabular-nums text-smoke">{shipment.trackingNumber}</span>
                ) : null}
              </div>
              <ShipmentTimeline events={shipment.events} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
