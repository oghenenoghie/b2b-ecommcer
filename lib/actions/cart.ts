"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";

async function getOrCreateCartId(orgId: string, userId: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("carts").select("id").eq("org_id", orgId).maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ org_id: orgId, user_id: userId })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");
  const qty = Math.max(1, Number(formData.get("qty") ?? 1));

  const membership = await getCurrentMembership();
  if (!membership) {
    redirect(`/p/${productSlug}?error=sign-in-required`);
  }

  const supabase = await createClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("base_price")
    .eq("id", productId)
    .single();

  if (productError || product.base_price == null) {
    redirect(`/p/${productSlug}?error=quote-only`);
  }

  const cartId = await getOrCreateCartId(membership.orgId, membership.userId);

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, qty")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .is("variant_id", null)
    .maybeSingle();

  if (existingItem) {
    await supabase.from("cart_items").update({ qty: existingItem.qty + qty }).eq("id", existingItem.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, qty, unit_price_snapshot: product.base_price });
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemQty(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const qty = Math.max(1, Number(formData.get("qty") ?? 1));

  const supabase = await createClient();
  await supabase.from("cart_items").update({ qty }).eq("id", itemId);

  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");

  const supabase = await createClient();
  await supabase.from("cart_items").delete().eq("id", itemId);

  revalidatePath("/cart");
}
