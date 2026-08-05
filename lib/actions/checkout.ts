"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import type { InvoiceTerms } from "@/types";

/**
 * Instant checkout: splits the current cart into one Order per vendor
 * (references/commerce.md "Two checkout paths" — "never one order across
 * vendors"), snapshots line items, and generates an invoice per order via
 * `next_invoice_number`. Actual payment capture (Tap/MyFatoorah/Stripe) is
 * Build order step 6's external-provider work — this creates the order +
 * invoice in `sent` status, awaiting payment or Net terms.
 */
export async function placeOrder(formData: FormData) {
  const terms = (formData.get("terms") as InvoiceTerms) || "prepaid";

  const membership = await getCurrentMembership();
  if (!membership) redirect("/cart");

  const supabase = await createClient();

  const { data: cart } = await supabase.from("carts").select("id").eq("org_id", membership.orgId).maybeSingle();
  if (!cart) redirect("/cart");

  const { data: items, error: itemsError } = await supabase
    .from("cart_items")
    .select("id, product_id, variant_id, qty, unit_price_snapshot, products ( currency, vendor_id )")
    .eq("cart_id", cart.id);

  if (itemsError || !items || items.length === 0) redirect("/cart");

  const byVendor = new Map<
    string,
    { currency: string; lines: { productId: string; variantId: string | null; qty: number; unitPrice: number }[] }
  >();

  for (const item of items as unknown as {
    id: string;
    product_id: string;
    variant_id: string | null;
    qty: number;
    unit_price_snapshot: number;
    products: { currency: string; vendor_id: string } | { currency: string; vendor_id: string }[];
  }[]) {
    const product = Array.isArray(item.products) ? item.products[0] : item.products;
    if (!product) continue;

    const entry = byVendor.get(product.vendor_id) ?? { currency: product.currency, lines: [] };
    entry.lines.push({
      productId: item.product_id,
      variantId: item.variant_id,
      qty: item.qty,
      unitPrice: item.unit_price_snapshot,
    });
    byVendor.set(product.vendor_id, entry);
  }

  const orderIds: string[] = [];

  for (const [vendorId, { currency, lines }] of byVendor) {
    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_org_id: membership.orgId,
        vendor_id: vendorId,
        status: "confirmed",
        subtotal,
        tax: 0,
        total: subtotal,
        currency,
      })
      .select("id")
      .single();

    if (orderError || !order) continue;
    orderIds.push(order.id);

    await supabase.from("order_items").insert(
      lines.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        variant_id: line.variantId,
        qty: line.qty,
        unit_price: line.unitPrice,
      })),
    );

    const { data: invoiceNumber } = await supabase.rpc("next_invoice_number", { target_vendor: vendorId });

    const dueInDays = terms === "net_30" ? 30 : terms === "net_15" ? 15 : 0;
    const dueAt = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000).toISOString();

    await supabase.from("invoices").insert({
      order_id: order.id,
      number: invoiceNumber ?? `INV-${order.id.slice(0, 8)}`,
      terms,
      due_at: dueAt,
      amount: subtotal,
      currency,
      status: "sent",
    });
  }

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  redirect(orderIds.length > 0 ? `/dashboard/buyer/orders` : "/cart");
}
