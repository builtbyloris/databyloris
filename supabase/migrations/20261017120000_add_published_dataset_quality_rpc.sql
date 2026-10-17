-- Aggregate only the explicitly approved Explorer fields. The existing discovery
-- and page RPCs enforce the published-project, opt-in, and schema gates.
create function public.get_published_dataset_quality(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_dataset_id uuid;
  v_page jsonb;
  v_total_rows bigint;
  v_fields jsonb;
begin
  if p_slug is null then return null; end if;

  v_dataset_id := public.get_published_explorer_dataset_id(p_slug);
  if v_dataset_id is null then return null; end if;

  v_page := public.get_published_explorer_page(p_slug, v_dataset_id, 0, 1);
  if v_page is null then return null; end if;

  select pg_catalog.count(*) into v_total_rows
  from public.dataset_rows r
  where r.dataset_id = v_dataset_id;

  with approved as (
    select col.value ->> 'name' as name,
      col.value ->> 'type' as data_type,
      col.position
    from pg_catalog.jsonb_array_elements(v_page -> 'columns')
      with ordinality as col(value, position)
  ), counts as (
    select a.name, a.data_type, a.position,
      pg_catalog.count(r.id) filter (
        where r.data ? a.name and r.data -> a.name <> 'null'::jsonb
      ) as non_null_count,
      pg_catalog.count(r.id) filter (
        where r.data ? a.name and r.data -> a.name <> 'null'::jsonb
          and pg_catalog.jsonb_typeof(r.data -> a.name) <> a.data_type
      ) as invalid_type_count
    from approved a
    left join public.dataset_rows r on r.dataset_id = v_dataset_id
    group by a.name, a.data_type, a.position
  )
  select coalesce(pg_catalog.jsonb_agg(
    pg_catalog.jsonb_build_object(
      'name', name,
      'type', data_type,
      'missingCount', v_total_rows - non_null_count,
      'nonNullCount', non_null_count,
      'completenessPercent', case when v_total_rows > 0
        then pg_catalog.round(100.0 * non_null_count / v_total_rows, 2)
        else null end,
      'invalidTypeCount', case when data_type in ('string', 'number', 'boolean')
        then invalid_type_count else null end,
      'validityPercent', case when data_type in ('string', 'number', 'boolean')
          and non_null_count > 0
        then pg_catalog.round(100.0 * (non_null_count - invalid_type_count) / non_null_count, 2)
        else null end
    ) order by position
  ), '[]'::jsonb) into v_fields
  from counts;

  return pg_catalog.jsonb_build_object(
    'totalRows', v_total_rows,
    'publicFieldCount', pg_catalog.jsonb_array_length(v_fields),
    'fields', v_fields
  );
end;
$$;

revoke all on function public.get_published_dataset_quality(text) from public, anon, authenticated;
grant execute on function public.get_published_dataset_quality(text) to anon, authenticated;
