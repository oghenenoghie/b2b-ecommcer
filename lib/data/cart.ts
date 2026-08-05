import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { Money } from "@/lib/money";

export type CartLineItem = {
  id: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  qty: number;
  unitPrice: Money;
};

export type CartByVendor = {
  vendorId: string;
  vendorSlug: string;
  vendorName: string;
  items: CartLineItem[];
  subtotal: Money;
};

/**
 * The current org's cart, grouped by vendor (a cart splits into one Order
 * per vendor at checkout — references/commerce.md). Null when there's no
 * session/org membership yet.
 */
export async function getCurrentCart(): Promise<CartByVendor[] | null> {
  const membership = await getCurrentMembership();
  if (!membership) return null;

  const supabase = await createClient();
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("org_id", membership.orgId)
    .maybeSingle();

  if (!cart) return [];

  const { data: items, error } = await supabase
    .from("cart_items")
    .select(
      `
      id, qty, unit_price_snapshot,
      products ( id, slug, title, currency, vendors ( id, slug, display_name ) )
    `,
    )
    .eq("cart_id", cart.id);

  if (error || !items) {
    if (error) console.error("getCurrentCart", error.message);
    return [];
  }

  const byVendor = new Map<string, CartByVendor>();

  for (const item of items as unknown as {
    id: string;
    qty: number;
    unit_price_snapshot: number;
    products: {
      id: string;
      slug: string;
      title: string;
      currency: string;
      vendors: { id: string; slug: string; display_name: string } | { id: string; slug: string; display_name: string }[];
    };
  }[]) {
    const vendor = Array.isArray(item.products.vendors) ? item.products.vendors[0] : item.products.vendors;
    if (!vendor) continue;

    const line: CartLineItem = {
      id: item.id,
      productId: item.products.id,
      productSlug: item.products.slug,
      productTitle: item.products.title,
      qty: item.qty,
      unitPrice: { amount: item.unit_price_snapshot, currency: item.products.currency },
    };

    const existing = byVendor.get(vendor.id);
    if (existing) {
      existing.items.push(line);
      existing.subtotal.amount += line.unitPrice.amount * line.qty;
    } else {
      byVendor.set(vendor.id, {
        vendorId: vendor.id,
        vendorSlug: vendor.slug,
        vendorName: vendor.display_name,
        items: [line],
        subtotal: { amount: line.unitPrice.amount * line.qty, currency: line.unitPrice.currency },
      });
    }
  }

  return [...byVendor.values()];
}
