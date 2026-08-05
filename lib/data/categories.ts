import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export async function listTopLevelCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, path")
    .is("parent_id", null)
    .order("name");

  if (error) {
    console.error("listTopLevelCategories", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, path")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getCategoryBySlug", error.message);
    return null;
  }
  return data;
}
