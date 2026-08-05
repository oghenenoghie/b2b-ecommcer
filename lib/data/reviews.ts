import { createClient } from "@/lib/supabase/server";

export type ReviewRow = {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  buyerOrgName: string;
};

export async function listReviewsForProduct(productId: string): Promise<ReviewRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, organizations ( name )")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("listReviewsForProduct", error.message);
    return [];
  }

  return (
    data as unknown as {
      id: string;
      rating: number;
      body: string;
      created_at: string;
      organizations: { name: string } | { name: string }[];
    }[]
  ).map((row) => {
    const org = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
    return {
      id: row.id,
      rating: row.rating,
      body: row.body,
      createdAt: row.created_at,
      buyerOrgName: org?.name ?? "Verified buyer",
    };
  });
}
