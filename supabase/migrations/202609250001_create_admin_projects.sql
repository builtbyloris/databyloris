create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text not null,
  category text not null,
  question text,
  period text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  demo boolean not null default false,
  status text not null default 'draft',
  dataset_records text,
  dataset_grain text,
  dataset_source text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint projects_status_check check (status in ('draft', 'published'))
);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function private.set_projects_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_projects_updated_at() from public;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function private.set_projects_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.projects from anon, authenticated;

grant select on table public.projects to anon;
grant select, insert, update, delete on table public.projects to authenticated;

create policy "Published projects are publicly readable"
on public.projects
for select
to anon, authenticated
using (status = 'published');

create policy "Administrators can read all projects"
on public.projects
for select
to authenticated
using ((select private.is_admin()));

create policy "Administrators can create projects"
on public.projects
for insert
to authenticated
with check (
  (select private.is_admin())
  and created_by = (select auth.uid())
);

create policy "Administrators can update projects"
on public.projects
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Administrators can delete projects"
on public.projects
for delete
to authenticated
using ((select private.is_admin()));
