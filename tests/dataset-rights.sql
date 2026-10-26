-- Run only against a disposable PostgreSQL database with existing migrations applied.
-- All fixture data is rolled back. Use psql -v ON_ERROR_STOP=1 -f tests/dataset-rights.sql.
begin;

create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

insert into public.projects (id, slug, title, description, category, status, dashboard_available)
values ('11111111-1111-4111-8111-111111111111', 'rights-fixture', '{"it":"Test","en":"Test"}', '{"it":"Test","en":"Test"}', 'Test', 'draft', true);
do $$ declare v_rejected boolean := false; begin
  begin
    insert into public.datasets (project_id, name, schema, explorer_enabled, explorer_fields)
    values ('11111111-1111-4111-8111-111111111111', 'Unreviewed',
      '{"columns":[{"name":"metric","type":"number","nullable":false}]}', true, array['metric']);
  exception when others then v_rejected := true;
  end;
  if not v_rejected then raise exception 'Unreviewed public INSERT was accepted'; end if;
end $$;
insert into public.datasets (id, project_id, name, schema, record_count)
values ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'Fixture',
  '{"columns":[{"name":"metric","type":"number","nullable":false},{"name":"host_id","type":"string","nullable":false}]}', 1);
insert into public.dataset_rows (dataset_id, row_index, data)
values ('22222222-2222-4222-8222-222222222222', 0, '{"metric":10,"host_id":"private"}');
insert into public.dashboard_configs (project_id, config)
values ('11111111-1111-4111-8111-111111111111',
  '{"id":"fixture","title":"Fixture","datasetId":"22222222-2222-4222-8222-222222222222","layout":{"featuredChartId":""},"filters":[],"kpis":[{"id":"average","label":"Average","field":"metric","aggregation":"average","format":"number"}],"charts":[],"rankings":[]}');

do $$ begin
  if public.get_published_dashboard_page('rights-fixture') is not null then raise exception 'Draft dashboard leaked'; end if;
  if public.can_export_published_explorer('rights-fixture', '22222222-2222-4222-8222-222222222222') then raise exception 'Draft export leaked'; end if;
end $$;

update public.datasets set
  rights_metadata = '{"sourceAuthor":"Test","sourceUrl":"https://example.org/data","dataPeriod":"2020","licenseType":"cc0","licenseUrl":"https://creativecommons.org/publicdomain/zero/1.0/","licenseVersion":"1.0","licenseCheckedAt":"2026-10-24","privacy":{"personalData":true,"directIdentifiers":true,"quasiIdentifiers":true,"fieldReview":true},"reviewNotes":"Reviewed"}',
  rights_review_status = 'verified', rights_confirmed_at = now(),
  dashboard_public_enabled = true, dashboard_fields = array['metric'],
  explorer_enabled = true, explorer_fields = array['metric']
where id = '22222222-2222-4222-8222-222222222222';
update public.projects set status = 'published' where slug = 'rights-fixture';
do $$ declare v_rejected boolean := false; begin
  begin
    update public.datasets set rights_metadata = jsonb_set(rights_metadata, '{dataPeriod}', '"2021"'::jsonb)
    where id = '22222222-2222-4222-8222-222222222222';
  exception when others then v_rejected := true;
  end;
  if not v_rejected then raise exception 'Old confirmation was reused after a rights change'; end if;
end $$;
do $$ declare v_metadata jsonb; begin
  select rights_metadata into v_metadata from public.datasets
  where id = '22222222-2222-4222-8222-222222222222';
  if public.dataset_rights_verified((v_metadata - 'reviewNotes') || '{"licenseType":"cc-by"}'::jsonb,
    'verified', now()) then
    raise exception 'Non-CC0 licence passed without documented review';
  end if;
end $$;
do $$ declare v_explorer_rejected boolean := false; v_dashboard_rejected boolean := false; begin
  begin
    update public.datasets set explorer_fields = array['metric', 'host_id']
    where id = '22222222-2222-4222-8222-222222222222';
  exception when others then v_explorer_rejected := true;
  end;
  begin
    update public.datasets set dashboard_fields = array['metric', 'host_id']
    where id = '22222222-2222-4222-8222-222222222222';
  exception when others then v_dashboard_rejected := true;
  end;
  if not v_explorer_rejected or not v_dashboard_rejected then
    raise exception 'Field expansion bypassed explicit confirmation';
  end if;
end $$;

do $$ declare v_page jsonb; begin
  v_page := public.get_published_dashboard_page('rights-fixture');
  if v_page is null or v_page -> 'rows' -> 0 -> 'data' ? 'host_id' then raise exception 'Dashboard field projection failed'; end if;
  if public.can_export_published_explorer('rights-fixture', '22222222-2222-4222-8222-222222222222') then raise exception 'CSV default must deny'; end if;
  if public.get_published_explorer_export_page('rights-fixture', '22222222-2222-4222-8222-222222222222') is not null then raise exception 'CSV page bypassed permission'; end if;
  if public.get_published_explorer_page('rights-fixture', '22222222-2222-4222-8222-222222222222') -> 'rows' -> 0 -> 'data' ? 'host_id' then raise exception 'Explorer field projection failed'; end if;
  if public.get_published_dataset_rights('rights-fixture') ? 'privacy'
    or public.get_published_dataset_rights('rights-fixture') ? 'reviewNotes'
    or public.get_published_dataset_rights('rights-fixture') ? 'dashboardFields' then raise exception 'Private review metadata leaked'; end if;
end $$;

do $$ declare v_rejected boolean := false; begin
  begin
    update public.datasets set csv_export_enabled = true
    where id = '22222222-2222-4222-8222-222222222222';
  exception when others then v_rejected := true;
  end;
  if not v_rejected then raise exception 'CSV was enabled using an old confirmation'; end if;
end $$;
update public.datasets set csv_export_enabled = true, rights_confirmed_at = clock_timestamp()
where id = '22222222-2222-4222-8222-222222222222';
do $$ begin
  if not public.can_export_published_explorer('rights-fixture', '22222222-2222-4222-8222-222222222222') then raise exception 'Approved CSV denied'; end if;
  if public.get_published_explorer_export_page('rights-fixture', '22222222-2222-4222-8222-222222222222') -> 'rows' -> 0 -> 'data' ? 'host_id' then raise exception 'Private field exported'; end if;
end $$;

set local role anon;
do $$ begin
  if has_table_privilege(current_user, 'public.datasets', 'SELECT')
    or has_table_privilege(current_user, 'public.dataset_rows', 'SELECT') then raise exception 'Direct anon SELECT reopened'; end if;
  if has_function_privilege(current_user, 'public.get_published_dashboard_page_core(text,integer,integer)', 'EXECUTE') then raise exception 'Core dashboard RPC exposed'; end if;
  if public.get_published_dashboard_page('rights-fixture') is null then raise exception 'Public dashboard denied'; end if;
end $$;
reset role;

insert into auth.users (id) values ('33333333-3333-4333-8333-333333333333');
insert into public.admin_users (user_id) values ('33333333-3333-4333-8333-333333333333');
set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-8444-444444444444';
do $$ declare v_updated integer; begin
  if (select count(*) from public.dataset_rows where dataset_id = '22222222-2222-4222-8222-222222222222') <> 0 then raise exception 'Non-admin authenticated SELECT succeeded'; end if;
  update public.datasets set name = name where id = '22222222-2222-4222-8222-222222222222';
  get diagnostics v_updated = row_count;
  if v_updated <> 0 then raise exception 'Non-admin authenticated UPDATE succeeded'; end if;
end $$;
set local request.jwt.claim.sub = '33333333-3333-4333-8333-333333333333';
do $$ declare v_updated integer; begin
  if (select count(*) from public.dataset_rows where dataset_id = '22222222-2222-4222-8222-222222222222') <> 1 then raise exception 'Admin SELECT denied'; end if;
  update public.datasets set name = name where id = '22222222-2222-4222-8222-222222222222';
  get diagnostics v_updated = row_count;
  if v_updated <> 1 then raise exception 'Admin UPDATE or rights trigger denied'; end if;
end $$;
reset role;

rollback;
