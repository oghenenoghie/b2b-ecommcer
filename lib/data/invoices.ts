import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { Money } from "@/lib/money";
import type { InvoiceStatus, InvoiceTerms } from "@/types";

export type InvoiceRow = {
  id: string;
  number: string;
  terms: InvoiceTerms;
  status: InvoiceStatus;
  dueAt: string;
  amount: Money;
  orderId: string;
};

export async function listInvoicesForCurrentOrg(as: "buyer" | "vendor"): Promise<InvoiceRow[] | null> {
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
    .from("invoices")
    .select("id, number, terms, status, due_at, amount, currency, orders!inner ( id, buyer_org_id, vendor_id )")
    .eq(`orders.${orderFilterColumn}`, orderFilterValue)
    .order("issued_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listInvoicesForCurrentOrg", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      number: string;
      terms: InvoiceTerms;
      status: InvoiceStatus;
      due_at: string;
      amount: number;
      currency: string;
      orders: { id: string } | { id: string }[];
    }[]
  ).map((row) => {
    const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
    return {
      id: row.id,
      number: row.number,
      terms: row.terms,
      status: row.status,
      dueAt: row.due_at,
      amount: { amount: row.amount, currency: row.currency },
      orderId: order.id,
    };
  });
}
