-- Additive phase only. Existing public SELECT grants and policies remain in place.
alter table public.datasets
  add column explorer_enabled boolean not null default false,
  add column explorer_fields text[] not null default '{}'::text[];

create function public.get_published_dashboard_page(
  p_slug text,
  p_after_row_index integer default -1,
  p_page_size integer default 1000
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset_id uuid;
  v_config jsonb;
  v_schema jsonb;
  v_schema_fields text[] := '{}'::text[];
  v_fields text[] := '{}'::text[];
  v_item jsonb;
  v_column jsonb;
  v_field text;
  v_rows jsonb;
  v_last_index integer;
  v_has_more boolean;
begin
  if p_slug is null or p_after_row_index is null or p_after_row_index < -1
    or p_page_size is null or p_page_size < 1 or p_page_size > 1000 then
    return null;
  end if;

  select d.id, c.config, d.schema
    into v_dataset_id, v_config, v_schema
  from public.projects p
  join public.dashboard_configs c on c.project_id = p.id
  join public.datasets d on d.project_id = p.id
    and d.id::text = c.config ->> 'datasetId'
  where p.slug = p_slug
    and p.status = 'published'
    and p.dashboard_available = true;

  if v_dataset_id is null
    or pg_catalog.jsonb_typeof(v_config) is distinct from 'object'
    or nullif(pg_catalog.btrim(v_config ->> 'id'), '') is null
    or not (v_config ? 'title')
    or pg_catalog.jsonb_typeof(v_config -> 'layout') is distinct from 'object'
    or pg_catalog.jsonb_typeof(v_config -> 'layout' -> 'featuredChartId') is distinct from 'string'
    or pg_catalog.jsonb_typeof(v_config -> 'filters') is distinct from 'array'
    or pg_catalog.jsonb_typeof(v_config -> 'kpis') is distinct from 'array'
    or pg_catalog.jsonb_typeof(v_config -> 'charts') is distinct from 'array'
    or pg_catalog.jsonb_typeof(v_config -> 'rankings') is distinct from 'array'
    or pg_catalog.jsonb_typeof(v_schema -> 'columns') is distinct from 'array' then
    return null;
  end if;

  for v_column in select value from pg_catalog.jsonb_array_elements(v_schema -> 'columns') loop
    if pg_catalog.jsonb_typeof(v_column) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_column ->> 'name'), '') is null then
      return null;
    end if;
    v_schema_fields := pg_catalog.array_append(v_schema_fields, v_column ->> 'name');
  end loop;
  if coalesce(pg_catalog.array_length(v_schema_fields, 1), 0) = 0 then return null; end if;

  for v_item in select value from pg_catalog.jsonb_array_elements(v_config -> 'filters') loop
    if pg_catalog.jsonb_typeof(v_item) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_item ->> 'id'), '') is null
      or not (v_item ? 'label')
      or v_item ->> 'type' is null
      or v_item ->> 'type' not in ('select', 'multi-select') then return null; end if;
    v_fields := pg_catalog.array_append(v_fields, v_item ->> 'field');
  end loop;
  for v_item in select value from pg_catalog.jsonb_array_elements(v_config -> 'kpis') loop
    if pg_catalog.jsonb_typeof(v_item) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_item ->> 'id'), '') is null
      or not (v_item ? 'label')
      or v_item ->> 'aggregation' is null
      or v_item ->> 'aggregation' not in ('sum', 'count', 'distinctCount', 'average')
      or v_item ->> 'format' is null
      or v_item ->> 'format' not in ('number', 'sales', 'currency', 'percentage', 'duration') then return null; end if;
    v_field := v_item ->> 'field';
    if nullif(pg_catalog.btrim(v_field), '') is null and v_item ->> 'aggregation' is distinct from 'count' then return null; end if;
    if nullif(pg_catalog.btrim(v_field), '') is not null then
      v_fields := pg_catalog.array_append(v_fields, v_field);
    end if;
  end loop;
  for v_item in select value from pg_catalog.jsonb_array_elements(v_config -> 'charts') loop
    if pg_catalog.jsonb_typeof(v_item) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_item ->> 'id'), '') is null
      or not (v_item ? 'title')
      or v_item ->> 'type' is null
      or v_item ->> 'type' not in ('line', 'bar', 'pie', 'donut')
      or v_item ->> 'aggregation' is null
      or v_item ->> 'aggregation' not in ('sum', 'count', 'distinctCount', 'average') then return null; end if;
    v_fields := pg_catalog.array_append(v_fields, v_item ->> 'categoryField');
    v_field := v_item ->> 'valueField';
    if nullif(pg_catalog.btrim(v_field), '') is null and v_item ->> 'aggregation' is distinct from 'count' then return null; end if;
    if nullif(pg_catalog.btrim(v_field), '') is not null then
      v_fields := pg_catalog.array_append(v_fields, v_field);
    end if;
  end loop;
  for v_item in select value from pg_catalog.jsonb_array_elements(v_config -> 'rankings') loop
    if pg_catalog.jsonb_typeof(v_item) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_item ->> 'id'), '') is null
      or not (v_item ? 'title') or not (v_item ? 'dimensionLabel') or not (v_item ? 'metricLabel')
      or v_item ->> 'aggregation' is null
      or v_item ->> 'aggregation' not in ('sum', 'count', 'distinctCount', 'average')
      or pg_catalog.jsonb_typeof(v_item -> 'detailColumns') is distinct from 'array' then return null; end if;
    v_fields := pg_catalog.array_append(v_fields, v_item ->> 'dimension');
    v_field := v_item ->> 'metric';
    if nullif(pg_catalog.btrim(v_field), '') is null and v_item ->> 'aggregation' is distinct from 'count' then return null; end if;
    if nullif(pg_catalog.btrim(v_field), '') is not null then
      v_fields := pg_catalog.array_append(v_fields, v_field);
    end if;
    for v_column in select value from pg_catalog.jsonb_array_elements(v_item -> 'detailColumns') loop
      if pg_catalog.jsonb_typeof(v_column) is distinct from 'object' then return null; end if;
      v_fields := pg_catalog.array_append(v_fields, v_column ->> 'field');
    end loop;
  end loop;

  if pg_catalog.jsonb_array_length(v_config -> 'kpis')
    + pg_catalog.jsonb_array_length(v_config -> 'charts')
    + pg_catalog.jsonb_array_length(v_config -> 'rankings') = 0 then return null; end if;

  for v_field in select distinct field from pg_catalog.unnest(v_fields) as field loop
    if nullif(pg_catalog.btrim(v_field), '') is null
      or pg_catalog.array_position(v_schema_fields, v_field) is null then return null; end if;
  end loop;

  if pg_catalog.array_length(v_schema_fields, 1) <> (
    select pg_catalog.count(distinct field) from pg_catalog.unnest(v_schema_fields) as field
  ) then return null; end if;

  select coalesce(pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object('rowIndex', page.row_index, 'data', page.projected)
      order by page.row_index
    ), '[]'::jsonb), pg_catalog.max(page.row_index)
    into v_rows, v_last_index
  from (
    select r.row_index,
      coalesce((
        select pg_catalog.jsonb_object_agg(field, r.data -> field)
        from pg_catalog.unnest(v_fields) as field
        where r.data ? field
      ), '{}'::jsonb) as projected
    from public.dataset_rows r
    where r.dataset_id = v_dataset_id and r.row_index > p_after_row_index
    order by r.row_index
    limit p_page_size
  ) page;

  v_has_more := v_last_index is not null and exists (
    select 1 from public.dataset_rows r
    where r.dataset_id = v_dataset_id and r.row_index > v_last_index
  );

  return pg_catalog.jsonb_build_object(
    'fields', pg_catalog.to_jsonb(v_fields),
    'rows', v_rows,
    'nextCursor', case when v_has_more then v_last_index else null end
  );
end;
$$;

revoke all on function public.get_published_dashboard_page(text, integer, integer) from public, anon, authenticated;
grant execute on function public.get_published_dashboard_page(text, integer, integer) to anon, authenticated;

create function public.get_published_explorer_page(
  p_slug text,
  p_dataset_id uuid,
  p_offset integer default 0,
  p_page_size integer default 25,
  p_sort_field text default null,
  p_sort_direction text default 'asc',
  p_search text default null,
  p_filter_field text default null,
  p_filter_value text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset public.datasets%rowtype;
  v_columns jsonb := '[]'::jsonb;
  v_fields text[];
  v_schema_fields text[] := '{}'::text[];
  v_column jsonb;
  v_field text;
  v_sort_type text;
  v_search text := nullif(pg_catalog.btrim(p_search), '');
  v_total bigint;
  v_rows jsonb;
begin
  if p_slug is null or p_dataset_id is null
    or p_offset is null or p_offset < 0 or p_offset > 10000
    or p_page_size is null or p_page_size < 1 or p_page_size > 100
    or p_sort_direction is null or p_sort_direction not in ('asc', 'desc')
    or pg_catalog.length(coalesce(p_search, '')) > 100
    or pg_catalog.length(coalesce(p_filter_value, '')) > 200 then
    return null;
  end if;

  select d.* into v_dataset
  from public.datasets d
  join public.projects p on p.id = d.project_id
  where p.slug = p_slug and p.status = 'published'
    and d.id = p_dataset_id and d.explorer_enabled = true;

  if not found or coalesce(pg_catalog.array_length(v_dataset.explorer_fields, 1), 0) = 0
    or pg_catalog.jsonb_typeof(v_dataset.schema -> 'columns') is distinct from 'array' then
    return null;
  end if;

  for v_column in select value from pg_catalog.jsonb_array_elements(v_dataset.schema -> 'columns') loop
    if pg_catalog.jsonb_typeof(v_column) is distinct from 'object'
      or nullif(pg_catalog.btrim(v_column ->> 'name'), '') is null
      or v_column ->> 'type' is null
      or v_column ->> 'type' not in ('string', 'number', 'boolean', 'date')
      or pg_catalog.jsonb_typeof(v_column -> 'nullable') is distinct from 'boolean' then return null; end if;
    v_schema_fields := pg_catalog.array_append(v_schema_fields, v_column ->> 'name');
  end loop;

  if pg_catalog.array_length(v_dataset.explorer_fields, 1) <> (
    select pg_catalog.count(distinct field) from pg_catalog.unnest(v_dataset.explorer_fields) as field
  ) then return null; end if;
  foreach v_field in array v_dataset.explorer_fields loop
    if nullif(pg_catalog.btrim(v_field), '') is null
      or pg_catalog.array_position(v_schema_fields, v_field) is null then return null; end if;
  end loop;
  if pg_catalog.array_length(v_schema_fields, 1) <> (
    select pg_catalog.count(distinct field) from pg_catalog.unnest(v_schema_fields) as field
  ) then return null; end if;
  v_fields := v_dataset.explorer_fields;

  select coalesce(pg_catalog.jsonb_agg(col order by position), '[]'::jsonb)
    into v_columns
  from (
    select pg_catalog.jsonb_build_object(
      'name', column_item.value ->> 'name',
      'type', column_item.value ->> 'type',
      'nullable', column_item.value -> 'nullable'
    ) as col, pg_catalog.array_position(v_fields, column_item.value ->> 'name') as position
    from pg_catalog.jsonb_array_elements(v_dataset.schema -> 'columns') as column_item(value)
    where column_item.value ->> 'name' = any(v_fields)
  ) approved;

  if nullif(p_sort_field, '') is not null then
    if pg_catalog.array_position(v_fields, p_sort_field) is null then return null; end if;
    select col ->> 'type' into v_sort_type
    from pg_catalog.jsonb_array_elements(v_columns) as col
    where col ->> 'name' = p_sort_field;
  end if;
  if nullif(p_filter_field, '') is not null
    and pg_catalog.array_position(v_fields, p_filter_field) is null then return null; end if;
  if p_filter_value is not null and nullif(p_filter_field, '') is null then return null; end if;

  with filtered as materialized (
    select r.row_index, r.data
    from public.dataset_rows r
    where r.dataset_id = v_dataset.id
      and (v_search is null or exists (
        select 1 from pg_catalog.unnest(v_fields) as field
        where pg_catalog.strpos(pg_catalog.lower(coalesce(r.data ->> field, '')),
          pg_catalog.lower(v_search)) > 0
      ))
      and (p_filter_value is null or r.data ->> p_filter_field = p_filter_value)
  ), ordered as (
    select f.row_index, f.data,
      pg_catalog.row_number() over (order by
        case when v_sort_type = 'number' and p_sort_direction = 'asc'
          and pg_catalog.jsonb_typeof(f.data -> p_sort_field) = 'number'
          then (f.data ->> p_sort_field)::numeric end asc nulls last,
        case when v_sort_type = 'number' and p_sort_direction = 'desc'
          and pg_catalog.jsonb_typeof(f.data -> p_sort_field) = 'number'
          then (f.data ->> p_sort_field)::numeric end desc nulls last,
        case when v_sort_type = 'boolean' and p_sort_direction = 'asc'
          and pg_catalog.jsonb_typeof(f.data -> p_sort_field) = 'boolean'
          then (f.data ->> p_sort_field)::boolean end asc nulls last,
        case when v_sort_type = 'boolean' and p_sort_direction = 'desc'
          and pg_catalog.jsonb_typeof(f.data -> p_sort_field) = 'boolean'
          then (f.data ->> p_sort_field)::boolean end desc nulls last,
        case when v_sort_type in ('string', 'date') and p_sort_direction = 'asc'
          then f.data ->> p_sort_field end asc nulls last,
        case when v_sort_type in ('string', 'date') and p_sort_direction = 'desc'
          then f.data ->> p_sort_field end desc nulls last,
        f.row_index
      ) as position
    from filtered f
  ), page as (
    select o.position, o.row_index,
      coalesce((
        select pg_catalog.jsonb_object_agg(field, o.data -> field)
        from pg_catalog.unnest(v_fields) as field
        where o.data ? field
      ), '{}'::jsonb) as projected
    from ordered o
    where o.position > p_offset and o.position <= p_offset + p_page_size
  )
  select (select pg_catalog.count(*) from filtered),
    coalesce(pg_catalog.jsonb_agg(
      pg_catalog.jsonb_build_object('rowIndex', page.row_index, 'data', page.projected)
      order by page.position
    ), '[]'::jsonb)
  into v_total, v_rows
  from page;

  return pg_catalog.jsonb_build_object(
    'columns', v_columns,
    'rows', v_rows,
    'totalCount', v_total,
    'hasMore', p_offset + pg_catalog.jsonb_array_length(v_rows) < v_total
  );
end;
$$;

revoke all on function public.get_published_explorer_page(text, uuid, integer, integer, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.get_published_explorer_page(text, uuid, integer, integer, text, text, text, text, text)
  to anon, authenticated;
