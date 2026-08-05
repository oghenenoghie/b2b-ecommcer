-- Cart is per buyer-org (teammates share it), and RFQ -> Quote is the
-- quote-to-order path parallel to instant checkout (references/commerce.md).

create table carts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger carts_set_updated_at
  before update on carts
  for each row execute function set_updated_at();

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts (id) on delete cascade,
  product_id uuid not null references products (id),
  variant_id uuid references product_variants (id),
  qty int not null check (qty > 0),
  unit_price_snapshot bigint not null,
  created_at timestamptz not null default now(),
  unique (cart_id, product_id, variant_id)
);

create index cart_items_cart_id_idx on cart_items (cart_id);

create table rfqs (
  id uuid primary key default gen_random_uuid(),
  buyer_org_id uuid not null references organizations (id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'quoted', 'accepted', 'declined', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger rfqs_set_updated_at
  before update on rfqs
  for each row execute function set_updated_at();

create index rfqs_buyer_org_id_idx on rfqs (buyer_org_id);

create table rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references rfqs (id) on delete cascade,
  product_id uuid not null references products (id),
  qty int not null check (qty > 0),
  target_price bigint,
  notes text
);

create index rfq_items_rfq_id_idx on rfq_items (rfq_id);
create index rfq_items_product_id_idx on rfq_items (product_id);

-- Vendor's priced response to an RFQ. `lines` is a compact jsonb array
-- ([{product_id, qty, unit_price}]) rather than a child table — quotes are
-- versioned snapshots, not live-editable line items.
create table quotes (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references rfqs (id) on delete cascade,
  vendor_id uuid not null references vendors (id) on delete cascade,
  valid_until timestamptz not null,
  lines jsonb not null default '[]'::jsonb,
  total bigint not null,
  currency text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger quotes_set_updated_at
  before update on quotes
  for each row execute function set_updated_at();

create index quotes_rfq_id_idx on quotes (rfq_id);
create index quotes_vendor_id_idx on quotes (vendor_id);

alter table carts enable row level security;
alter table cart_items enable row level security;
alter table rfqs enable row level security;
alter table rfq_items enable row level security;
alter table quotes enable row level security;

create policy "carts_org_scoped"
  on carts for all
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

create policy "cart_items_org_scoped"
  on cart_items for all
  using (exists (select 1 from carts c where c.id = cart_items.cart_id and is_org_member(c.org_id)))
  with check (exists (select 1 from carts c where c.id = cart_items.cart_id and is_org_member(c.org_id)));

-- Buyer org sees/manages its own RFQs. Any vendor with a product referenced
-- in the RFQ can also see it (they need it to quote), but only the buyer org
-- can create/edit it.
create policy "rfqs_select_buyer_or_quoting_vendor"
  on rfqs for select
  using (
    is_org_member(buyer_org_id)
    or exists (
      select 1 from rfq_items ri
      join products p on p.id = ri.product_id
      join vendors v on v.id = p.vendor_id
      where ri.rfq_id = rfqs.id and is_org_member(v.org_id)
    )
    or is_platform_admin()
  );

create policy "rfqs_write_buyer_org"
  on rfqs for all
  using (has_org_role(buyer_org_id, array['owner', 'admin', 'buyer', 'manager']))
  with check (has_org_role(buyer_org_id, array['owner', 'admin', 'buyer', 'manager']));

create policy "rfq_items_select_buyer_or_quoting_vendor"
  on rfq_items for select
  using (
    exists (
      select 1 from rfqs r
      where r.id = rfq_items.rfq_id and is_org_member(r.buyer_org_id)
    )
    or exists (
      select 1 from products p
      join vendors v on v.id = p.vendor_id
      where p.id = rfq_items.product_id and is_org_member(v.org_id)
    )
    or is_platform_admin()
  );

create policy "rfq_items_write_buyer_org"
  on rfq_items for all
  using (
    exists (
      select 1 from rfqs r
      where r.id = rfq_items.rfq_id
        and has_org_role(r.buyer_org_id, array['owner', 'admin', 'buyer', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from rfqs r
      where r.id = rfq_items.rfq_id
        and has_org_role(r.buyer_org_id, array['owner', 'admin', 'buyer', 'manager'])
    )
  );

-- Quotes: the buyer org (via the parent RFQ) and the quoting vendor org can
-- both read; only the vendor org can write.
create policy "quotes_select_buyer_or_vendor"
  on quotes for select
  using (
    exists (select 1 from rfqs r where r.id = quotes.rfq_id and is_org_member(r.buyer_org_id))
    or exists (select 1 from vendors v where v.id = quotes.vendor_id and is_org_member(v.org_id))
    or is_platform_admin()
  );

create policy "quotes_write_own_vendor"
  on quotes for all
  using (exists (select 1 from vendors v where v.id = quotes.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])))
  with check (exists (select 1 from vendors v where v.id = quotes.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])));
