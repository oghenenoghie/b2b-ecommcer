-- Shipment tracking, product reviews, and in-app notifications.

create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders (id) on delete cascade,
  carrier text,
  tracking_number text,
  status text not null default 'pending',
  events jsonb not null default '[]'::jsonb, -- [{ at, status, location?, note? }]
  shipped_at timestamptz,
  delivered_at timestamptz
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  buyer_org_id uuid not null references organizations (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now(),
  unique (product_id, buyer_org_id)
);

create index reviews_product_id_idx on reviews (product_id);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on notifications (user_id, read_at);

alter table shipments enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;

-- Buyer sees a live timeline (Realtime); vendor updates status.
create policy "shipments_select_buyer_or_vendor"
  on shipments for select
  using (
    exists (
      select 1 from orders o
      where o.id = shipments.order_id
        and (
          is_org_member(o.buyer_org_id)
          or exists (select 1 from vendors v where v.id = o.vendor_id and is_org_member(v.org_id))
          or is_platform_admin()
        )
    )
  );

create policy "shipments_write_vendor"
  on shipments for all
  using (
    exists (
      select 1 from orders o
      join vendors v on v.id = o.vendor_id
      where o.id = shipments.order_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  )
  with check (
    exists (
      select 1 from orders o
      join vendors v on v.id = o.vendor_id
      where o.id = shipments.order_id and has_org_role(v.org_id, array['owner', 'admin', 'manager'])
    )
  );

-- Published reviews are public read; only a member of the reviewing buyer
-- org can write/update their own org's review.
create policy "reviews_select_public"
  on reviews for select
  using (true);

create policy "reviews_write_own_buyer_org"
  on reviews for all
  using (is_org_member(buyer_org_id))
  with check (is_org_member(buyer_org_id));

-- Notifications are strictly per-user.
create policy "notifications_select_own"
  on notifications for select
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
