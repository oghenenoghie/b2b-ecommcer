-- Hybrid search: fuses pgvector cosine similarity (meaning) with Postgres
-- FTS + trigram (exact/fuzzy SKUs and part numbers) via reciprocal-rank
-- fusion. Called from lib/search.ts after the query is embedded server-side
-- (references/ai-search.md "Hybrid search RPC").
create or replace function search_products(
  query_text text,
  query_embedding vector(1536),
  filter_category uuid default null,
  max_price_minor bigint default null,
  min_qty int default null,
  match_limit int default 24
)
returns setof products
language sql
stable
as $$
  with vec as (
    select id, row_number() over (order by embedding <=> query_embedding) as rank
    from products
    where status = 'active'
      and (filter_category is null or category_id = filter_category)
      and (max_price_minor is null or base_price <= max_price_minor)
    order by embedding <=> query_embedding
    limit 60
  ),
  lex as (
    select id, row_number() over (
      order by ts_rank(fts, websearch_to_tsquery('simple', query_text)) desc
    ) as rank
    from products
    where status = 'active'
      and (filter_category is null or category_id = filter_category)
      and (max_price_minor is null or base_price <= max_price_minor)
      and (
        fts @@ websearch_to_tsquery('simple', query_text)
        or title % query_text
      )
    limit 60
  ),
  fused as (
    select
      coalesce(vec.id, lex.id) as id,
      (1.0 / (60 + coalesce(vec.rank, 60))) + (1.0 / (60 + coalesce(lex.rank, 60))) as score
    from vec
    full outer join lex using (id)
  )
  select p.*
  from fused
  join products p on p.id = fused.id
  where (min_qty is null or coalesce(p.moq, 1) <= min_qty)
  order by fused.score desc
  limit match_limit;
$$;

-- Anyone (including anon buyers browsing without an account) can search the
-- public catalog — the function itself only ever touches `active` products.
grant execute on function search_products(text, vector, uuid, bigint, int, int) to anon, authenticated;
