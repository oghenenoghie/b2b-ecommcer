-- Organizations are the backbone — both buyers and vendors are orgs. Users
-- belong to orgs with roles (SKILL.md "Data model").

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('buyer', 'vendor', 'both')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  country text not null,
  currency text not null,
  tax_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
  before update on organizations
  for each row execute function set_updated_at();

create table memberships (
  user_id uuid not null references auth.users (id) on delete cascade,
  org_id uuid not null references organizations (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'buyer', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, org_id)
);

create index memberships_org_id_idx on memberships (org_id);
create index memberships_user_id_idx on memberships (user_id);

-- Multi-tenant isolation is enforced here, not in the app. Security-definer
-- so every other table's RLS policy can call these without needing direct
-- select access to `memberships` (which would otherwise recurse).
create or replace function is_org_member(target_org uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where org_id = target_org and user_id = auth.uid()
  );
$$;

create or replace function has_org_role(target_org uuid, roles text[])
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where org_id = target_org and user_id = auth.uid() and role = any(roles)
  );
$$;

alter table organizations enable row level security;
alter table memberships enable row level security;

-- Members can see their own org; platform admins see all.
create policy "organizations_select_member_or_admin"
  on organizations for select
  using (is_org_member(id) or is_platform_admin());

-- Org owners/admins can update their own org's profile fields.
create policy "organizations_update_owner_or_admin"
  on organizations for update
  using (has_org_role(id, array['owner', 'admin']))
  with check (has_org_role(id, array['owner', 'admin']));

-- Org creation happens via a signup RPC/service role in practice (it has to
-- create the first owner membership in the same transaction), so there is
-- no direct public insert policy here.

-- A member can see their own membership rows; org owners/admins can see and
-- manage the whole roster.
create policy "memberships_select_self_or_org_admin"
  on memberships for select
  using (user_id = auth.uid() or has_org_role(org_id, array['owner', 'admin']));

create policy "memberships_insert_org_admin"
  on memberships for insert
  with check (has_org_role(org_id, array['owner', 'admin']));

create policy "memberships_update_org_admin"
  on memberships for update
  using (has_org_role(org_id, array['owner', 'admin']))
  with check (has_org_role(org_id, array['owner', 'admin']));

create policy "memberships_delete_org_admin"
  on memberships for delete
  using (has_org_role(org_id, array['owner', 'admin']));
