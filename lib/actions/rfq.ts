"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentMembership } from "@/lib/data/org";
import { toMinor } from "@/lib/money";

export async function submitRfq(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");
  const qty = Math.max(1, Number(formData.get("qty") ?? 1));
  const targetPriceMajor = formData.get("targetPrice");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const membership = await getCurrentMembership();
  if (!membership) {
    redirect(`/p/${productSlug}?error=sign-in-required`);
  }

  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("currency").eq("id", productId).maybeSingle();

  const targetPrice =
    targetPriceMajor && String(targetPriceMajor).trim() !== ""
      ? toMinor(Number(targetPriceMajor), product?.currency ?? "KWD")
      : null;

  const { data: rfq, error: rfqError } = await supabase
    .from("rfqs")
    .insert({ buyer_org_id: membership.orgId })
    .select("id")
    .single();

  if (rfqError) {
    redirect(`/p/${productSlug}?error=rfq-failed`);
  }

  await supabase.from("rfq_items").insert({
    rfq_id: rfq.id,
    product_id: productId,
    qty,
    target_price: targetPrice,
    notes,
  });

  redirect(`/rfq/${rfq.id}`);
}
