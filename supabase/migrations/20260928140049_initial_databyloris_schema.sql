create table public.admin_users (
  user_id uuid primary key references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null,
  description jsonb not null,
  category text not null,
  technologies jsonb not null default '[]'::jsonb,
  image_path text,
  featured boolean not null default false,
  status text not null default 'draft',
  published_at timestamptz,
  repository_url text,
  dashboard_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (status in ('draft', 'published'))
);

create table public.project_details (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.projects (id) on delete cascade,
  context jsonb,
  objective jsonb,
  methodology jsonb not null default '[]'::jsonb,
  dataset_summary jsonb,
  insights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dashboard_configs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid unique not null references public.projects (id) on delete cascade,
  config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.datasets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  storage_path text,
  grain text,
  record_count integer not null default 0,
  schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint datasets_record_count_check check (record_count >= 0)
);

create table public.dataset_rows (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.datasets (id) on delete cascade,
  row_index integer not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  constraint dataset_rows_dataset_id_row_index_key unique (dataset_id, row_index),
  constraint dataset_rows_row_index_check check (row_index >= 0)
);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger project_details_set_updated_at
before update on public.project_details
for each row execute function public.set_updated_at();

create trigger dashboard_configs_set_updated_at
before update on public.dashboard_configs
for each row execute function public.set_updated_at();

create trigger datasets_set_updated_at
before update on public.datasets
for each row execute function public.set_updated_at();

create index projects_status_idx on public.projects (status);
create index datasets_project_id_idx on public.datasets (project_id);
create index dataset_rows_dataset_id_idx on public.dataset_rows (dataset_id);
