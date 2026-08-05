import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { Money } from "@/lib/money";
import type { RfqStatus, QuoteLine } from "@/types";

export type RfqSummary = {
  id: string;
  status: RfqStatus;
  createdAt: string;
  itemCount: number;
};

export async function listRfqsForCurrentOrg(): Promise<RfqSummary[] | null> {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rfqs")
    .select("id, status, created_at, rfq_items(count)")
    .eq("buyer_org_id", membership.orgId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listRfqsForCurrentOrg", error.message);
    return [];
  }

  return (data as unknown as { id: string; status: RfqStatus; created_at: string; rfq_items: { count: number }[] }[]).map(
    (row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      itemCount: row.rfq_items[0]?.count ?? 0,
    }),
  );
}

export type RfqThread = {
  id: string;
  status: RfqStatus;
  createdAt: string;
  items: { id: string; productTitle: string; qty: number; targetPrice: Money | null; notes: string | null }[];
  quotes: {
    id: string;
    vendorName: string;
    validUntil: string;
    total: Money;
    status: string;
    lines: QuoteLine[];
  }[];
};

export async function getRfqThread(id: string): Promise<RfqThread | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rfqs")
    .select(
      `
      id, status, created_at,
      rfq_items ( id, qty, target_price, notes, products ( title, currency ) ),
      quotes ( id, valid_until, total, currency, status, lines, vendors ( display_name ) )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getRfqThread", error.message);
    return null;
  }

  const row = data as unknown as {
    id: string;
    status: RfqStatus;
    created_at: string;
    rfq_items: {
      id: string;
      qty: number;
      target_price: number | null;
      notes: string | null;
      products: { title: string; currency: string };
    }[];
    quotes: {
      id: string;
      valid_until: string;
      total: number;
      currency: string;
      status: string;
      lines: QuoteLine[];
      vendors: { display_name: string } | { display_name: string }[];
    }[];
  };

  return {
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    items: row.rfq_items.map((item) => ({
      id: item.id,
      productTitle: item.products.title,
      qty: item.qty,
      targetPrice: item.target_price != null ? { amount: item.target_price, currency: item.products.currency } : null,
      notes: item.notes,
    })),
    quotes: row.quotes.map((quote) => {
      const vendor = Array.isArray(quote.vendors) ? quote.vendors[0] : quote.vendors;
      return {
        id: quote.id,
        vendorName: vendor?.display_name ?? "Vendor",
        validUntil: quote.valid_until,
        total: { amount: quote.total, currency: quote.currency },
        status: quote.status,
        lines: quote.lines,
      };
    }),
  };
}
