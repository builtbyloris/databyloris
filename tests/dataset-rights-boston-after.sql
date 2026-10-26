-- Disposable PostgreSQL only; run after both new rights migrations.
do $$
declare v_dataset public.datasets%rowtype; v_config jsonb; v_page jsonb;
  v_cursor integer := -1; v_rows integer := 0; v_pages integer := 0;
begin
  if (select rights_legacy from public.datasets where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd') then
    raise exception 'Existing draft was incorrectly grandfathered';
  end if;
  select * into v_dataset from public.datasets where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  select config into v_config from public.dashboard_configs where project_id = v_dataset.project_id;
  if not v_dataset.dashboard_public_enabled or not v_dataset.rights_legacy
    or v_dataset.rights_review_status <> 'unverified' or v_dataset.csv_export_enabled
    or v_dataset.explorer_enabled or cardinality(v_dataset.explorer_fields) <> 7 then
    raise exception 'Boston public modes or backfill are incorrect';
  end if;
  if 'id' = any(v_dataset.dashboard_fields)
    or v_config -> 'kpis' -> 0 ->> 'field' <> ''
    or v_config -> 'charts' -> 0 ->> 'valueField' <> ''
    or v_config -> 'rankings' -> 0 ->> 'metric' <> ''
    or v_config -> 'filters' -> 0 ->> 'field' <> 'room_type' then
    raise exception 'Count-only identifier was not removed';
  end if;
  loop
    v_page := public.get_published_dashboard_page('boston-airbnb-listings-analysis', v_cursor, 1000);
    if v_page is null or v_page -> 'fields' ? 'id'
      or v_page -> 'rows' -> 0 -> 'data' ? 'id'
      or not (v_page -> 'rows' -> 0 -> 'data' ? 'room_type') then
      raise exception 'Dashboard projection leaked ID or lost required fields';
    end if;
    v_rows := v_rows + jsonb_array_length(v_page -> 'rows');
    v_pages := v_pages + 1;
    exit when v_page -> 'nextCursor' = 'null'::jsonb;
    v_cursor := (v_page ->> 'nextCursor')::integer;
  end loop;
  if v_rows <> 3585 or v_pages <> 4 then
    raise exception 'Dashboard pagination or count changed';
  end if;
  if public.get_published_explorer_page('boston-airbnb-listings-analysis', v_dataset.id, 0, 1) is not null
    or public.can_export_published_explorer('boston-airbnb-listings-analysis', v_dataset.id) then
    raise exception 'Boston Explorer or CSV is still public';
  end if;
  if public.get_published_dataset_rights('boston-airbnb-listings-analysis') ->> 'reviewed' <> 'false'
    or public.get_published_dataset_rights('boston-airbnb-listings-analysis') ->> 'snapshotDate' <> '2016-09-07' then
    raise exception 'Unverified Boston provenance was not staged correctly';
  end if;
end $$;

begin;
update public.datasets set explorer_fields = array_remove(explorer_fields, 'price_usd')
where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
do $$ begin
  if (select cardinality(explorer_fields) from public.datasets
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') <> 6 then
    raise exception 'Legacy field removal was blocked';
  end if;
end $$;
rollback;
do $$ declare v_rejected boolean := false; begin
  begin
    update public.datasets set explorer_enabled = true,
      explorer_fields = array_append(explorer_fields, 'id')
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  exception when others then v_rejected := true;
  end;
  if not v_rejected then raise exception 'Legacy field expansion bypassed review'; end if;
end $$;

set role anon;
do $$ begin
  if has_table_privilege(current_user, 'public.datasets', 'SELECT')
    or has_table_privilege(current_user, 'public.dataset_rows', 'SELECT')
    or has_function_privilege(current_user, 'public.get_published_dashboard_page_core(text,integer,integer)', 'EXECUTE') then
    raise exception 'Direct anon access was reopened';
  end if;
end $$;
reset role;
