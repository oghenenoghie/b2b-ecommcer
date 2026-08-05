import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export async function isCurrentUserPlatformAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase.from("platform_admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return Boolean(data);
}

export type VendorApprovalRow = {
  id: string;
  displayName: string;
  slug: string;
  orgName: string;
  approvedAt: string | null;
  createdAt: string;
};

export async function listVendorsPendingApproval(): Promise<VendorApprovalRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("id, display_name, slug, approved_at, created_at, organizations ( name )")
    .is("approved_at", null)
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) console.error("listVendorsPendingApproval", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      display_name: string;
      slug: string;
      approved_at: string | null;
      created_at: string;
      organizations: { name: string } | { name: string }[];
    }[]
  ).map((row) => {
    const org = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
    return {
      id: row.id,
      displayName: row.display_name,
      slug: row.slug,
      orgName: org?.name ?? "—",
      approvedAt: row.approved_at,
      createdAt: row.created_at,
    };
  });
}

export type CategoryRow = Category & { productCount: number };

export async function listAllCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, path, products(count)")
    .order("path");

  if (error || !data) {
    if (error) console.error("listAllCategories", error.message);
    return [];
  }

  return (data as unknown as (Category & { products: { count: number }[] })[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    parent_id: row.parent_id,
    path: row.path,
    productCount: row.products[0]?.count ?? 0,
  }));
}
