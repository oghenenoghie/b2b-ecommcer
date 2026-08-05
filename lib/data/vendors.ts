import { createClient } from "@/lib/supabase/server";

export type VendorProfile = {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  bannerUrl: string | null;
  ratingAvg: number | null;
};

export async function listApprovedVendors(limit = 6): Promise<VendorProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("id, slug, display_name, bio, banner_url, rating_avg")
    .not("approved_at", "is", null)
    .order("approved_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.error("listApprovedVendors", error.message);
    return [];
  }

  return data.map((v) => ({
    id: v.id,
    slug: v.slug,
    displayName: v.display_name,
    bio: v.bio,
    bannerUrl: v.banner_url,
    ratingAvg: v.rating_avg,
  }));
}

export async function getVendorBySlug(slug: string): Promise<VendorProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vendors")
    .select("id, slug, display_name, bio, banner_url, rating_avg")
    .eq("slug", slug)
    .not("approved_at", "is", null)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getVendorBySlug", error.message);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    displayName: data.display_name,
    bio: data.bio,
    bannerUrl: data.banner_url,
    ratingAvg: data.rating_avg,
  };
}
