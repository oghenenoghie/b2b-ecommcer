"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function approveVendor(formData: FormData) {
  const vendorId = String(formData.get("vendorId") ?? "");
  const supabase = await createClient();

  await supabase.from("vendors").update({ approved_at: new Date().toISOString() }).eq("id", vendorId);

  revalidatePath("/admin/vendors");
}
