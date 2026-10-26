-- Existing public modes are grandfathered, but every new distribution mode is deny-by-default.
-- Apply before deploying code that calls the new functions. No raw file bucket is made public.
alter table public.datasets
  add column rights_metadata jsonb not null default '{}'::jsonb,
  add column rights_review_status text not null default 'unverified'
    check (rights_review_status in ('unverified', 'verified', 'needs-review')),
  add column rights_confirmed_at timestamptz,
  add column rights_legacy boolean not null default false,
  add column dashboard_public_enabled boolean not null default false,
  add column dashboard_fields text[] not null default '{}'::text[],
  add column csv_export_enabled boolean not null default false;

-- Preserve *only* fields already sent by valid public dashboards; no new fields are authorized.
with current_dashboards as (
  select d.id, public.get_published_dashboard_page(p.slug, -1, 1) as payload
  from public.datasets d
  join public.projects p on p.id = d.project_id
  join public.dashboard_configs c on c.project_id = p.id and c.config ->> 'datasetId' = d.id::text
  where p.status = 'published' and p.dashboard_available
), approved as (
  select id, array(select distinct value from jsonb_array_elements_text(payload -> 'fields') as value) as fields
  from current_dashboards
  where jsonb_typeof(payload -> 'fields') = 'array'
)
update public.datasets d
set dashboard_public_enabled = true, dashboard_fields = approved.fields
from approved where d.id = approved.id;

update public.datasets d set rights_legacy = true
from public.projects p where p.id = d.project_id and p.status = 'published';

create function public.dataset_rights_verified(p_metadata jsonb, p_status text, p_confirmed_at timestamptz)
returns boolean language sql immutable set search_path = '' as $$
  select p_status = 'verified' and p_confirmed_at is not null
    and nullif(pg_catalog.btrim(p_metadata ->> 'sourceAuthor'), '') is not null
    and (p_metadata ->> 'sourceUrl') ~ '^https?://[^[:space:]]+$'
    and nullif(pg_catalog.btrim(p_metadata ->> 'dataPeriod'), '') is not null
    and (p_metadata ->> 'licenseUrl') ~ '^https?://[^[:space:]]+$'
    and nullif(pg_catalog.btrim(p_metadata ->> 'licenseVersion'), '') is not null
    and (p_metadata ->> 'licenseCheckedAt') ~ '^\d{4}-\d{2}-\d{2}$'
    and p_metadata -> 'privacy' ->> 'personalData' = 'true'
    and p_metadata -> 'privacy' ->> 'directIdentifiers' = 'true'
    and p_metadata -> 'privacy' ->> 'quasiIdentifiers' = 'true'
    and p_metadata -> 'privacy' ->> 'fieldReview' = 'true'
    and (p_metadata ->> 'licenseType') in ('cc0','cc-by','cc-by-sa','cc-by-nc','cc-by-nd','odbl','custom','competition-rules','unknown')
    and ((p_metadata ->> 'licenseType') = 'cc0'
      or nullif(pg_catalog.btrim(p_metadata ->> 'reviewNotes'), '') is not null);
$$;
revoke all on function public.dataset_rights_verified(jsonb, text, timestamptz) from public, anon, authenticated;

create function public.validate_dataset_rights_update() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_schema_fields text[]; v_new_exposure boolean;
begin
  if pg_catalog.jsonb_typeof(new.schema -> 'columns') is distinct from 'array' then
    raise exception 'Invalid dataset schema';
  end if;
  select pg_catalog.array_agg(col ->> 'name') into v_schema_fields
  from pg_catalog.jsonb_array_elements(new.schema -> 'columns') col;
  if exists (select 1 from pg_catalog.unnest(new.dashboard_fields || new.explorer_fields) field
    where field is null or pg_catalog.array_position(v_schema_fields, field) is null) then
    raise exception 'Published fields must exist in dataset schema';
  end if;
  if tg_op = 'INSERT' then
    v_new_exposure := new.explorer_enabled or new.dashboard_public_enabled or new.csv_export_enabled;
  else
    v_new_exposure := (new.explorer_enabled and (not old.explorer_enabled or exists (
        select 1 from pg_catalog.unnest(new.explorer_fields) field
        where pg_catalog.array_position(old.explorer_fields, field) is null)))
      or (new.dashboard_public_enabled and (not old.dashboard_public_enabled or exists (
        select 1 from pg_catalog.unnest(new.dashboard_fields) field
        where pg_catalog.array_position(old.dashboard_fields, field) is null)))
      or (new.csv_export_enabled and not old.csv_export_enabled);
    if (new.rights_metadata is distinct from old.rights_metadata
        or new.rights_review_status is distinct from old.rights_review_status
        or v_new_exposure)
      and new.rights_confirmed_at is not distinct from old.rights_confirmed_at then
      new.rights_confirmed_at := null;
    end if;
  end if;
  if v_new_exposure then
    if not public.dataset_rights_verified(new.rights_metadata, new.rights_review_status, new.rights_confirmed_at) then
      raise exception 'Dataset rights review required before enabling a new public mode';
    end if;
  end if;
  if new.csv_export_enabled and (not new.explorer_enabled or cardinality(new.explorer_fields) = 0) then
    raise exception 'CSV export requires a published Explorer field allowlist';
  end if;
  if not new.rights_legacy and (new.dashboard_public_enabled or new.explorer_enabled or new.csv_export_enabled)
    and not public.dataset_rights_verified(new.rights_metadata, new.rights_review_status, new.rights_confirmed_at) then
    raise exception 'Public dataset modes require a current rights review';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_dataset_rights_update() from public, anon, authenticated;
create trigger datasets_validate_rights before insert or update on public.datasets
for each row execute function public.validate_dataset_rights_update();

-- The original RPC is now internal. The public signature remains unchanged for deployed clients.
alter function public.get_published_dashboard_page(text, integer, integer)
  rename to get_published_dashboard_page_core;
revoke all on function public.get_published_dashboard_page_core(text, integer, integer) from public, anon, authenticated;

create function public.get_published_dashboard_page(
  p_slug text, p_after_row_index integer default -1, p_page_size integer default 1000
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_dataset public.datasets%rowtype; v_page jsonb; v_field text;
begin
  select d.* into v_dataset from public.projects p
  join public.dashboard_configs c on c.project_id = p.id
  join public.datasets d on d.project_id = p.id and d.id::text = c.config ->> 'datasetId'
  where p.slug = p_slug and p.status = 'published' and p.dashboard_available;
  if v_dataset.id is null or not v_dataset.dashboard_public_enabled then return null; end if;
  v_page := public.get_published_dashboard_page_core(p_slug, p_after_row_index, p_page_size);
  if pg_catalog.jsonb_typeof(v_page -> 'fields') is distinct from 'array' then return null; end if;
  for v_field in select value from pg_catalog.jsonb_array_elements_text(v_page -> 'fields') loop
    if pg_catalog.array_position(v_dataset.dashboard_fields, v_field) is null then return null; end if;
  end loop;
  return v_page;
end;
$$;
revoke all on function public.get_published_dashboard_page(text, integer, integer) from public, anon, authenticated;
grant execute on function public.get_published_dashboard_page(text, integer, integer) to anon, authenticated;

create function public.can_export_published_explorer(p_slug text, p_dataset_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p join public.datasets d on d.project_id = p.id
    where p.slug = p_slug and p.status = 'published' and d.id = p_dataset_id
      and d.explorer_enabled and cardinality(d.explorer_fields) > 0
      and d.csv_export_enabled
      and public.dataset_rights_verified(d.rights_metadata, d.rights_review_status, d.rights_confirmed_at)
  );
$$;
revoke all on function public.can_export_published_explorer(text, uuid) from public, anon, authenticated;
grant execute on function public.can_export_published_explorer(text, uuid) to anon, authenticated;

create function public.get_published_explorer_export_page(
  p_slug text, p_dataset_id uuid, p_offset integer default 0, p_page_size integer default 100,
  p_sort_field text default null, p_sort_direction text default 'asc', p_search text default null,
  p_filter_field text default null, p_filter_value text default null
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_export_published_explorer(p_slug, p_dataset_id) then return null; end if;
  return public.get_published_explorer_page(p_slug, p_dataset_id, p_offset, p_page_size,
    p_sort_field, p_sort_direction, p_search, p_filter_field, p_filter_value);
end;
$$;
revoke all on function public.get_published_explorer_export_page(text, uuid, integer, integer, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.get_published_explorer_export_page(text, uuid, integer, integer, text, text, text, text, text) to anon, authenticated;

-- Factual provenance may be shown before the separate privacy/distribution review.
-- Review notes, privacy answers and private field names are never returned.
create function public.get_published_dataset_rights(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_dataset public.datasets%rowtype;
begin
  select d.* into v_dataset from public.projects p
  join public.datasets d on d.project_id = p.id
  left join public.dashboard_configs c on c.project_id = p.id
  where p.slug = p_slug and p.status = 'published'
    and (d.rights_metadata ->> 'sourceUrl') ~ '^https?://[^[:space:]]+$'
  order by (d.id::text = c.config ->> 'datasetId') desc, d.explorer_enabled desc, d.updated_at desc
  limit 1;
  if v_dataset.id is null then return null; end if;
  return pg_catalog.jsonb_build_object(
    'name', v_dataset.name, 'recordCount', v_dataset.record_count,
    'reviewed', public.dataset_rights_verified(v_dataset.rights_metadata, v_dataset.rights_review_status, v_dataset.rights_confirmed_at),
    'sourceAuthor', v_dataset.rights_metadata ->> 'sourceAuthor',
    'sourceUrl', v_dataset.rights_metadata ->> 'sourceUrl',
    'platform', v_dataset.rights_metadata ->> 'platform',
    'dataPeriod', v_dataset.rights_metadata ->> 'dataPeriod',
    'snapshotDate', v_dataset.rights_metadata ->> 'snapshotDate',
    'transformations', v_dataset.rights_metadata -> 'transformations',
    'licenseType', v_dataset.rights_metadata ->> 'licenseType',
    'licenseUrl', v_dataset.rights_metadata ->> 'licenseUrl',
    'licenseVersion', v_dataset.rights_metadata ->> 'licenseVersion',
    'restrictions', v_dataset.rights_metadata -> 'restrictions');
end;
$$;
revoke all on function public.get_published_dataset_rights(text) from public, anon, authenticated;
grant execute on function public.get_published_dataset_rights(text) to anon, authenticated;
