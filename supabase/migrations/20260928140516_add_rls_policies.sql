alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_details enable row level security;
alter table public.dashboard_configs enable row level security;
alter table public.datasets enable row level security;
alter table public.dataset_rows enable row level security;

revoke all privileges on table public.admin_users from anon, authenticated;
revoke all privileges on table public.projects from anon, authenticated;
revoke all privileges on table public.project_details from anon, authenticated;
revoke all privileges on table public.dashboard_configs from anon, authenticated;
revoke all privileges on table public.datasets from anon, authenticated;
revoke all privileges on table public.dataset_rows from anon, authenticated;

grant select on table public.admin_users to authenticated;

grant select on table
  public.projects,
  public.project_details,
  public.dashboard_configs,
  public.datasets,
  public.dataset_rows
to anon;

grant select, insert, update, delete on table
  public.projects,
  public.project_details,
  public.dashboard_configs,
  public.datasets,
  public.dataset_rows
to authenticated;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    );
$$;

revoke all privileges on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

create policy "Authenticated users can read their admin membership"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all projects"
on public.projects
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert projects"
on public.projects
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins can update projects"
on public.projects
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read details of published projects"
on public.project_details
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = public.project_details.project_id
      and public.projects.status = 'published'
  )
);

create policy "Admins can read all project details"
on public.project_details
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert project details"
on public.project_details
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins can update project details"
on public.project_details
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete project details"
on public.project_details
for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read configs of published projects"
on public.dashboard_configs
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = public.dashboard_configs.project_id
      and public.projects.status = 'published'
  )
);

create policy "Admins can read all dashboard configs"
on public.dashboard_configs
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert dashboard configs"
on public.dashboard_configs
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins can update dashboard configs"
on public.dashboard_configs
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete dashboard configs"
on public.dashboard_configs
for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read datasets of published projects"
on public.datasets
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where public.projects.id = public.datasets.project_id
      and public.projects.status = 'published'
  )
);

create policy "Admins can read all datasets"
on public.datasets
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert datasets"
on public.datasets
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins can update datasets"
on public.datasets
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete datasets"
on public.datasets
for delete
to authenticated
using ((select public.is_admin()));

create policy "Public can read rows of published project datasets"
on public.dataset_rows
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.datasets
    join public.projects
      on public.projects.id = public.datasets.project_id
    where public.datasets.id = public.dataset_rows.dataset_id
      and public.projects.status = 'published'
  )
);

create policy "Admins can read all dataset rows"
on public.dataset_rows
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert dataset rows"
on public.dataset_rows
for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admins can update dataset rows"
on public.dataset_rows
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete dataset rows"
on public.dataset_rows
for delete
to authenticated
using ((select public.is_admin()));
