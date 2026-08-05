import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { Money } from "@/lib/money";
import type { OrderStatus } from "@/types";

export type OrderRow = {
  id: string;
  poNumber: string | null;
  status: OrderStatus;
  total: Money;
  counterpartyName: string;
  createdAt: string;
};

/**
 * Orders for the current org, as either buyer or vendor (whichever side
 * `as` selects). `counterpartyName` is the other party — the vendor's name
 * when viewed as buyer, and vice versa.
 */
export async function listOrdersForCurrentOrg(as: "buyer" | "vendor"): Promise<OrderRow[] | null> {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();

  if (as === "buyer") {
    const { data, error } = await supabase
      .from("orders")
      .select("id, po_number, status, total, currency, created_at, vendors ( display_name )")
      .eq("buyer_org_id", membership.orgId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("listOrdersForCurrentOrg(buyer)", error.message);
      return [];
    }

    return (
      data as unknown as {
        id: string;
        po_number: string | null;
        status: OrderStatus;
        total: number;
        currency: string;
        created_at: string;
        vendors: { display_name: string } | { display_name: string }[];
      }[]
    ).map((row) => {
      const vendor = Array.isArray(row.vendors) ? row.vendors[0] : row.vendors;
      return {
        id: row.id,
        poNumber: row.po_number,
        status: row.status,
        total: { amount: row.total, currency: row.currency },
        counterpartyName: vendor?.display_name ?? "Vendor",
        createdAt: row.created_at,
      };
    });
  }

  const { data: vendor } = await supabase.from("vendors").select("id").eq("org_id", membership.orgId).maybeSingle();
  if (!vendor) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, po_number, status, total, currency, created_at, organizations!orders_buyer_org_id_fkey ( name )")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listOrdersForCurrentOrg(vendor)", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      po_number: string | null;
      status: OrderStatus;
      total: number;
      currency: string;
      created_at: string;
      organizations: { name: string } | { name: string }[];
    }[]
  ).map((row) => {
    const buyer = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
    return {
      id: row.id,
      poNumber: row.po_number,
      status: row.status,
      total: { amount: row.total, currency: row.currency },
      counterpartyName: buyer?.name ?? "Buyer",
      createdAt: row.created_at,
    };
  });
}
