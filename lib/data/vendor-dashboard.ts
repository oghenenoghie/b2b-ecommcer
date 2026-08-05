import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/data/org";
import type { Money } from "@/lib/money";
import type { ProductStatus } from "@/types";

export type VendorProductRow = {
  id: string;
  slug: string;
  title: string;
  status: ProductStatus;
  price: Money | null;
  moq: number;
};

export async function listCurrentVendorProducts(): Promise<VendorProductRow[] | null> {
  const vendor = await getCurrentVendor();
  if (!vendor) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, status, base_price, currency, moq")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listCurrentVendorProducts", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    price: row.base_price != null ? { amount: row.base_price, currency: row.currency } : null,
    moq: row.moq,
  }));
}

export type VendorQuoteRow = {
  id: string;
  rfqId: string;
  status: string;
  total: Money;
  validUntil: string;
  buyerOrgName: string;
};

export async function listCurrentVendorQuotes(): Promise<VendorQuoteRow[] | null> {
  const vendor = await getCurrentVendor();
  if (!vendor) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("id, rfq_id, status, total, currency, valid_until, rfqs ( organizations ( name ) )")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listCurrentVendorQuotes", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      rfq_id: string;
      status: string;
      total: number;
      currency: string;
      valid_until: string;
      rfqs: { organizations: { name: string } | { name: string }[] } | { organizations: { name: string } | { name: string }[] }[];
    }[]
  ).map((row) => {
    const rfq = Array.isArray(row.rfqs) ? row.rfqs[0] : row.rfqs;
    const buyer = Array.isArray(rfq?.organizations) ? rfq.organizations[0] : rfq?.organizations;
    return {
      id: row.id,
      rfqId: row.rfq_id,
      status: row.status,
      total: { amount: row.total, currency: row.currency },
      validUntil: row.valid_until,
      buyerOrgName: buyer?.name ?? "Buyer",
    };
  });
}
