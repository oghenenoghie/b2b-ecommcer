-- Tax rules, orders (one per vendor — a cart splits into N orders),
-- gap-free sequential invoice numbering, invoices, and payments
-- (references/commerce.md "Order lifecycle", "Invoices", "Payments", "Tax").

-- Configurable, versioned, server-side — never hardcoded. A rate change is a
-- data edit, not a deploy. `effective_to` null = currently in effect.
create table tax_rules (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  rate_bps int not null check (rate_bps >= 0),
  effective_from date not null,
  effective_to date,
  created_at timestamptz not null default now()
);

create index tax_rules_country_idx on tax_rules (country, effective_from);

create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_org_id uuid not null references organizations (id),
  vendor_id uuid not null references vendors (id),
  po_number text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'fulfilling', 'shipped', 'completed', 'cancelled')),
  subtotal bigint not null,
  tax bigint not null default 0,
  total bigint not null,
  currency text not null,
  -- Pinned at order time so a later tax_rules edit never rewrites history.
  tax_rule_id uuid references tax_rules (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create index orders_buyer_org_id_idx on orders (buyer_org_id);
create index orders_vendor_id_idx on orders (vendor_id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  variant_id uuid references product_variants (id),
  qty int not null check (qty > 0),
  unit_price bigint not null
);

create index order_items_order_id_idx on order_items (order_id);

-- One counter row per vendor; `next_invoice_number` locks it with
-- `for update` so numbers are sequential and gap-free under concurrency.
create table invoice_counters (
  vendor_id uuid primary key references vendors (id) on delete cascade,
  last_number int not null default 0
);

create or replace function next_invoice_number(target_vendor uuid)
returns text
language plpgsql
as $$
declare
  next_n int;
begin
  insert into invoice_counters (vendor_id, last_number)
  values (target_vendor, 1)
  on conflict (vendor_id) do update set last_number = invoice_counters.last_number + 1
  returning last_number into next_n;

  return 'INV-' || to_char(next_n, 'FM000000');
end;
$$;

create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id),
  number text not null unique,
  terms text not null check (terms in ('prepaid', 'net_15', 'net_30')),
  issued_at timestamptz not null default now(),
  due_at timestamptz not null,
  amount bigint not null,
  currency text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue'))
);

create index invoices_order_id_idx on invoices (order_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id),
  provider text not null check (provider in ('tap', 'myfatoorah', 'stripe')),
  provider_ref text not null,
  amount bigint not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

create index payments_invoice_id_idx on payments (invoice_id);

alter table tax_rules enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table invoice_counters enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;

-- Tax rules are public read (checkout needs to resolve a rate client-side
-- for display) and platform-admin write.
create policy "tax_rules_select_public"
  on tax_rules for select
  using (true);

create policy "tax_rules_write_platform_admin"
  on tax_rules for all
  using (is_platform_admin())
  with check (is_platform_admin());

-- Orders: both the buyer org and the fulfilling vendor org can read; status
-- transitions happen via role-checked, server-side RPCs, not direct client
-- writes, so the write policy stays intentionally narrow.
create policy "orders_select_buyer_or_vendor"
  on orders for select
  using (
    is_org_member(buyer_org_id)
    or exists (select 1 from vendors v where v.id = orders.vendor_id and is_org_member(v.org_id))
    or is_platform_admin()
  );

create policy "orders_update_vendor_status"
  on orders for update
  using (exists (select 1 from vendors v where v.id = orders.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])))
  with check (exists (select 1 from vendors v where v.id = orders.vendor_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])));

create policy "order_items_select_buyer_or_vendor"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (
          is_org_member(o.buyer_org_id)
          or exists (select 1 from vendors v where v.id = o.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

create policy "invoice_counters_vendor_admin"
  on invoice_counters for select
  using (has_org_role((select org_id from vendors where id = invoice_counters.vendor_id), array['owner', 'admin']));

create policy "invoices_select_buyer_or_vendor"
  on invoices for select
  using (
    exists (
      select 1 from orders o
      where o.id = invoices.order_id
        and (
          is_org_member(o.buyer_org_id)
          or exists (select 1 from vendors v where v.id = o.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

-- Payments carry financial truth and are written only by the webhook
-- handler (service role, bypasses RLS) — never from the client. Buyer/vendor
-- can read their own.
create policy "payments_select_buyer_or_vendor"
  on payments for select
  using (
    exists (
      select 1 from invoices i
      join orders o on o.id = i.order_id
      where i.id = payments.invoice_id
        and (
          is_org_member(o.buyer_org_id)
          or exists (select 1 from vendors v where v.id = o.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );
