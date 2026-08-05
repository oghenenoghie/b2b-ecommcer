import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/data/org";
import type { Money } from "@/lib/money";

export type VendorAnalytics = {
  totalRevenue: Money;
  orderCount: number;
  topProducts: { title: string; unitsSold: number }[];
};

export async function getCurrentVendorAnalytics(): Promise<VendorAnalytics | null> {
  const vendor = await getCurrentVendor();
  if (!vendor) return null;

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, currency")
    .eq("vendor_id", vendor.id)
    .neq("status", "cancelled");

  const totalRevenue = (orders ?? []).reduce((sum, o) => sum + o.total, 0);
  const currency = orders?.[0]?.currency ?? "KWD";

  const { data: items } = await supabase
    .from("order_items")
    .select("qty, products ( title ), orders!inner ( vendor_id )")
    .eq("orders.vendor_id", vendor.id);

  const unitsByProduct = new Map<string, number>();
  for (const row of (items ?? []) as unknown as {
    qty: number;
    products: { title: string } | { title: string }[];
  }[]) {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;
    if (!product) continue;
    unitsByProduct.set(product.title, (unitsByProduct.get(product.title) ?? 0) + row.qty);
  }

  const topProducts = [...unitsByProduct.entries()]
    .map(([title, unitsSold]) => ({ title, unitsSold }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return {
    totalRevenue: { amount: totalRevenue, currency },
    orderCount: orders?.length ?? 0,
    topProducts,
  };
}
