import { createClient } from "@/lib/supabase/server";
import { embed } from "@/lib/embeddings";

export type SearchFilters = {
  queryText: string;
  category?: string | null;
  maxPriceMinor?: number | null;
  minQty?: number | null;
  limit?: number;
};

/**
 * Hybrid search: embeds the query, then calls the `search_products` RPC
 * (supabase/migrations/0008_search_products_rpc.sql), which fuses pgvector
 * cosine similarity with Postgres FTS/pg_trgm (reciprocal-rank fusion).
 */
export async function searchProducts(filters: SearchFilters) {
  const supabase = await createClient();
  const queryEmbedding = await embed(filters.queryText);

  const { data, error } = await supabase.rpc("search_products", {
    query_text: filters.queryText,
    query_embedding: queryEmbedding,
    filter_category: filters.category ?? null,
    max_price_minor: filters.maxPriceMinor ?? null,
    min_qty: filters.minQty ?? null,
    match_limit: filters.limit ?? 24,
  });

  if (error) throw error;
  return data;
}
