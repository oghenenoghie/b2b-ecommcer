import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { ShipmentEvent } from "@/types";

export type ShipmentRow = {
  id: string;
  orderId: string;
  carrier: string | null;
  trackingNumber: string | null;
  status: string;
  events: ShipmentEvent[];
};

export async function listShipmentsForCurrentOrg(as: "buyer" | "vendor"): Promise<ShipmentRow[] | null> {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();

  let orderFilterColumn: "buyer_org_id" | "vendor_id" = "buyer_org_id";
  let orderFilterValue = membership.orgId;

  if (as === "vendor") {
    const { data: vendor } = await supabase.from("vendors").select("id").eq("org_id", membership.orgId).maybeSingle();
    if (!vendor) return [];
    orderFilterColumn = "vendor_id";
    orderFilterValue = vendor.id;
  }

  const { data, error } = await supabase
    .from("shipments")
    .select("id, carrier, tracking_number, status, events, orders!inner ( id, buyer_org_id, vendor_id )")
    .eq(`orders.${orderFilterColumn}`, orderFilterValue);

  if (error || !data) {
    if (error) console.error("listShipmentsForCurrentOrg", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      carrier: string | null;
      tracking_number: string | null;
      status: string;
      events: ShipmentEvent[];
      orders: { id: string } | { id: string }[];
    }[]
  ).map((row) => {
    const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
    return {
      id: row.id,
      orderId: order.id,
      carrier: row.carrier,
      trackingNumber: row.tracking_number,
      status: row.status,
      events: row.events,
    };
  });
}
