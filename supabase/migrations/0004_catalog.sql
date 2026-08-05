-- Vendor storefronts, category tree, and the product catalog — including
-- the pgvector + FTS columns hybrid search reads from
-- (references/ai-search.md "Vector schema").

create table vendors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references organizations (id) on delete cascade,
  display_name text not null,
  slug text not null unique,
  bio text,
  logo_url text,
  banner_url text,
  rating_avg numeric(3, 2),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger vendors_set_updated_at
  before update on vendors
  for each row execute function set_updated_at();

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories (id) on delete set null,
  path text not null default '',
  created_at timestamptz not null default now()
);

create index categories_parent_id_idx on categories (parent_id);

create table products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors (id) on delete cascade,
  category_id uuid references categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  moq int not null default 1 check (moq > 0),
  lead_time_days int,
  -- null = quote-only / POA — cannot be added to cart, only RFQ'd
  base_price bigint,
  currency text not null,
  -- OpenAI text-embedding-3-small (1536-dim). If switching to Supabase's
  -- gte-small Edge Function instead, use vector(384) everywhere, consistently.
  embedding vector(1536),
  fts tsvector generated always as (
    to_tsvector(
      'simple',
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(specs::text, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create index products_vendor_id_idx on products (vendor_id);
create index products_category_id_idx on products (category_id);
create index products_status_idx on products (status);
create index products_embedding_idx on products using hnsw (embedding vector_cosine_ops);
create index products_fts_idx on products using gin (fts);
create index products_title_trgm_idx on products using gin (title gin_trgm_ops);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  sku text not null,
  attrs jsonb not null default '{}'::jsonb,
  price bigint not null,
  stock_qty int not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, sku)
);

create index product_variants_product_id_idx on product_variants (product_id);
create index product_variants_sku_trgm_idx on product_variants using gin (sku gin_trgm_ops);

create table price_tiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  variant_id uuid references product_variants (id) on delete cascade,
  min_qty int not null check (min_qty > 0),
  unit_price bigint not null
);

create index price_tiers_product_id_idx on price_tiers (product_id);

create table media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  alt text,
  is_primary boolean not null default false,
  sort int not null default 0
);

create index media_product_id_idx on media (product_id);

-- Enqueued on product create/update; a worker (Edge Function or Realtime
-- listener) drains this, builds the compact document, embeds it, and writes
-- `products.embedding` back (references/ai-search.md "Embeddings pipeline").
create table embed_queue (
  id bigint generated always as identity primary key,
  product_id uuid not null references products (id) on delete cascade,
  enqueued_at timestamptz not null default now(),
  processed_at timestamptz
);

create index embed_queue_unprocessed_idx on embed_queue (product_id) where processed_at is null;

create or replace function enqueue_product_embedding()
returns trigger
language plpgsql
as $$
begin
  insert into embed_queue (product_id) values (new.id);
  return new;
end;
$$;

create trigger products_enqueue_embedding
  after insert or update of title, description, specs, category_id on products
  for each row execute function enqueue_product_embedding();

alter table vendors enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table price_tiers enable row level security;
alter table media enable row level security;
alter table embed_queue enable row level security;

-- Public read: approved vendor storefronts; the owning org can always see
-- its own vendor row (including pre-approval).
create policy "vendors_select_public_or_own"
  on vendors for select
  using (approved_at is not null or is_org_member(org_id) or is_platform_admin());

create policy "vendors_update_own_org"
  on vendors for update
  using (has_org_role(org_id, array['owner', 'admin']))
  with check (has_org_role(org_id, array['owner', 'admin']));

create policy "vendors_insert_own_org"
  on vendors for insert
  with check (has_org_role(org_id, array['owner', 'admin']));

-- Category tree is public read; writes are platform-admin only.
create policy "categories_select_public"
  on categories for select
  using (true);

create policy "categories_write_platform_admin"
  on categories for all
  using (is_platform_admin())
  with check (is_platform_admin());

-- Public read: active products. Vendor org members (any role able to manage
-- the catalog) can also see + manage their own products regardless of status
-- (drafts included).
create policy "products_select_active_or_own_vendor"
  on products for select
  using (
    status = 'active'
    or exists (
      select 1 from vendors v
      where v.id = products.vendor_id and is_org_member(v.org_id)
    )
    or is_platform_admin()
  );

create policy "products_write_own_vendor"
  on products for all
  using (
    exists (
      select 1 from vendors v
      where v.id = products.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from vendors v
      where v.id = products.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  );

-- Variants/price tiers/media inherit the parent product's visibility and
-- vendor-scoped write access.
create policy "product_variants_select"
  on product_variants for select
  using (
    exists (
      select 1 from products p
      where p.id = product_variants.product_id
        and (
          p.status = 'active'
          or exists (select 1 from vendors v where v.id = p.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

create policy "product_variants_write_own_vendor"
  on product_variants for all
  using (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = product_variants.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = product_variants.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  );

create policy "price_tiers_select"
  on price_tiers for select
  using (
    exists (
      select 1 from products p
      where p.id = price_tiers.product_id
        and (
          p.status = 'active'
          or exists (select 1 from vendors v where v.id = p.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

create policy "price_tiers_write_own_vendor"
  on price_tiers for all
  using (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = price_tiers.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = price_tiers.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  );

create policy "media_select"
  on media for select
  using (
    exists (
      select 1 from products p
      where p.id = media.product_id
        and (
          p.status = 'active'
          or exists (select 1 from vendors v where v.id = p.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

create policy "media_write_own_vendor"
  on media for all
  using (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = media.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = media.product_id
        and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  );

-- embed_queue is written by the trigger and drained by the worker
-- (service role) — no end-user access at all.
create policy "embed_queue_no_direct_access"
  on embed_queue for all
  using (is_platform_admin())
  with check (is_platform_admin());
