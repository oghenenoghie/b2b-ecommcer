# Supabase

The full Build order step 2 schema is written (`migrations/0001`-`0008`):
orgs/memberships + RLS helpers, the vendor/category/product catalog with
pgvector + FTS, cart + RFQ/quote, tax/orders/invoices/payments, shipments/
reviews/notifications, and the `search_products` hybrid search RPC. Sample
data is in `seed.sql`.

## Local development

```bash
npx supabase init        # first time only, if supabase/config.toml is missing
npx supabase start       # spins up local Postgres + Studio via Docker
npx supabase db reset    # applies migrations, then runs seed.sql
```

Local Studio (URL printed by `supabase start`) lets you create a test auth
user; then uncomment the `memberships`/`carts` block at the bottom of
`seed.sql` with that user's id.

## Linking a hosted project

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
npx supabase gen types typescript --project-id <project-ref> > ../types/supabase.ts
```

`types/supabase.ts` is currently hand-authored to match these migrations —
regenerate it from the real project once one exists, and diff against the
hand-authored version to catch drift.

## Conventions

- One migration per cohesive group of tables; RLS policies live in the same
  migration as the tables they govern, not a separate catch-all file.
- Money is integer minor units (`bigint`) + a `currency` column — see
  `lib/money.ts` and `references/commerce.md`.
- `search_products` (0008) depends on the `products.embedding` /
  `products.fts` columns from 0004 — keep it last.
