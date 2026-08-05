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
 * Hybrid search: embeds the query, then calls the `search_products` RPC,
 * which fuses pgvector cosine similarity with Postgres FTS/pg_trgm
 * (reciprocal-rank fusion). See references/ai-search.md for the RPC SQL —
 * it ships with the Build order step 2 schema migration, not this scaffold.
 */
export async function searchProducts(filters: SearchFilters) {
  const supabase = await createClient();
  const queryEmbedding = await embed(filters.queryText);

  // Cast: the placeholder Database type (types/supabase.ts) can't give
  // supabase-js's generic `rpc()` overloads a literal function name to key
  // off. Drop the cast once `search_products` exists in generated types.
  const rpc = supabase.rpc.bind(supabase) as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;

  const { data, error } = await rpc("search_products", {
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
