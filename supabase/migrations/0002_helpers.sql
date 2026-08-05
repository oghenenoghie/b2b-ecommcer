-- Shared helpers used by every later migration's RLS policies.

-- Auto-maintain `updated_at` on any table that has the column.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Platform admin: a separate role from org roles for marketplace ops
-- (vendor approval, disputes, category management) — never conflate with
-- org membership roles (SKILL.md "RLS & org-role model").
create table platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table platform_admins enable row level security;

-- Security-definer so it can be called from other tables' RLS policies
-- without those policies needing direct select access to platform_admins.
create or replace function is_platform_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from platform_admins where user_id = auth.uid()
  );
$$;

-- Only platform admins can see the admin list; membership is granted out of
-- band (service role / SQL), there is no self-service insert path.
create policy "platform_admins_select_self_or_admin"
  on platform_admins for select
  using (user_id = auth.uid() or is_platform_admin());
