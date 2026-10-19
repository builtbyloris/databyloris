-- Compare only explicitly published Explorer fields. Existing RLS and SELECT grants stay unchanged.
create function public.get_published_dataset_compare_options(
  p_slug text,
  p_dimension_field text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset_id uuid;
  v_page jsonb;
  v_type text;
  v_values jsonb;
begin
  if p_slug is null or p_dimension_field is null then return null; end if;

  v_dataset_id := public.get_published_explorer_dataset_id(p_slug);
  if v_dataset_id is null then return null; end if;
  v_page := public.get_published_explorer_page(p_slug, v_dataset_id, 0, 1);
  if v_page is null then return null; end if;

  select col.value ->> 'type' into v_type
  from pg_catalog.jsonb_array_elements(v_page -> 'columns') as col(value)
  where col.value ->> 'name' = p_dimension_field;
  if v_type not in ('string', 'boolean') or v_type is null then return null; end if;

  select coalesce(pg_catalog.jsonb_agg(approved.value order by approved.value), '[]'::jsonb)
    into v_values
  from (
    select distinct r.data ->> p_dimension_field as value
    from public.dataset_rows r
    where r.dataset_id = v_dataset_id
      and pg_catalog.jsonb_typeof(r.data -> p_dimension_field) = v_type
      and nullif(pg_catalog.btrim(r.data ->> p_dimension_field), '') is not null
      and pg_catalog.length(r.data ->> p_dimension_field) <= 200
    order by value
    limit 100
  ) approved;

  return pg_catalog.jsonb_build_object('values', v_values);
end;
$$;

revoke all on function public.get_published_dataset_compare_options(text, text)
  from public, anon, authenticated;
grant execute on function public.get_published_dataset_compare_options(text, text)
  to anon, authenticated;

create function public.get_published_dataset_compare(
  p_slug text,
  p_dimension_field text,
  p_value_a text,
  p_value_b text,
  p_metric_field text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset_id uuid;
  v_page jsonb;
  v_dimension_type text;
  v_metric_type text;
  v_segments jsonb;
  v_average_a numeric;
  v_average_b numeric;
begin
  if p_slug is null or p_dimension_field is null or p_metric_field is null
    or p_value_a is null or p_value_b is null
    or nullif(pg_catalog.btrim(p_value_a), '') is null
    or nullif(pg_catalog.btrim(p_value_b), '') is null
    or p_value_a = p_value_b
    or pg_catalog.length(p_value_a) > 200
    or pg_catalog.length(p_value_b) > 200 then return null; end if;

  v_dataset_id := public.get_published_explorer_dataset_id(p_slug);
  if v_dataset_id is null then return null; end if;
  v_page := public.get_published_explorer_page(p_slug, v_dataset_id, 0, 1);
  if v_page is null then return null; end if;

  select col.value ->> 'type' into v_dimension_type
  from pg_catalog.jsonb_array_elements(v_page -> 'columns') as col(value)
  where col.value ->> 'name' = p_dimension_field;
  select col.value ->> 'type' into v_metric_type
  from pg_catalog.jsonb_array_elements(v_page -> 'columns') as col(value)
  where col.value ->> 'name' = p_metric_field;
  if v_dimension_type not in ('string', 'boolean') or v_dimension_type is null
    or v_metric_type is distinct from 'number' then return null; end if;

  with segments(segment, segment_value) as (
    values ('a'::text, p_value_a), ('b'::text, p_value_b)
  ), aggregates as (
    select s.segment,
      pg_catalog.count(r.id) as record_count,
      pg_catalog.count(r.id) filter (
        where not (r.data ? p_metric_field)
          or r.data -> p_metric_field = 'null'::jsonb
      ) as missing_metric_count,
      pg_catalog.avg(case when pg_catalog.jsonb_typeof(r.data -> p_metric_field) = 'number'
        then (r.data ->> p_metric_field)::numeric end) as average_value,
      pg_catalog.min(case when pg_catalog.jsonb_typeof(r.data -> p_metric_field) = 'number'
        then (r.data ->> p_metric_field)::numeric end) as minimum_value,
      pg_catalog.max(case when pg_catalog.jsonb_typeof(r.data -> p_metric_field) = 'number'
        then (r.data ->> p_metric_field)::numeric end) as maximum_value
    from segments s
    left join public.dataset_rows r on r.dataset_id = v_dataset_id
      and pg_catalog.jsonb_typeof(r.data -> p_dimension_field) = v_dimension_type
      and r.data ->> p_dimension_field = s.segment_value
    group by s.segment
  )
  select pg_catalog.jsonb_object_agg(segment, pg_catalog.jsonb_build_object(
    'recordCount', record_count,
    'average', average_value,
    'min', minimum_value,
    'max', maximum_value,
    'missingMetricCount', missing_metric_count
  )) into v_segments
  from aggregates;

  v_average_a := (v_segments -> 'a' ->> 'average')::numeric;
  v_average_b := (v_segments -> 'b' ->> 'average')::numeric;

  return pg_catalog.jsonb_build_object(
    'segments', v_segments,
    'deltaAbsolute', case when v_average_a is not null and v_average_b is not null
      then v_average_b - v_average_a else null end,
    'deltaPercent', case when v_average_a > 0 and v_average_b is not null
      then (v_average_b - v_average_a) / v_average_a * 100 else null end
  );
end;
$$;

revoke all on function public.get_published_dataset_compare(text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.get_published_dataset_compare(text, text, text, text, text)
  to anon, authenticated;
