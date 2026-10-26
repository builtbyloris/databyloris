-- Documentary staging only: never marks privacy/rights as verified and never changes public modes.
-- Skip if the linked database does not match the documented processed Boston file.
update public.datasets d
set rights_metadata = jsonb_build_object(
  'sourceAuthor', 'Airbnb',
  'sourceUrl', 'https://www.kaggle.com/datasets/airbnb/boston',
  'platform', 'kaggle',
  'dataPeriod', '2016',
  'snapshotDate', '2016-09-07',
  'transformations', jsonb_build_object(
    'it', 'Pulizia riproducibile del file listings.csv: 43 colonne di analisi, conversioni deterministiche di valuta, percentuali e valori booleani; nessuna riga rimossa o imputazione dei valori mancanti.',
    'en', 'Reproducible cleaning of listings.csv: 43 analysis columns, deterministic currency, percentage and boolean conversions; no rows removed or missing values imputed.'),
  'licenseType', 'cc0',
  'licenseUrl', 'https://creativecommons.org/publicdomain/zero/1.0/',
  'licenseVersion', '1.0',
  'licenseCheckedAt', '2026-10-24',
  'restrictions', jsonb_build_object('it', '', 'en', ''),
  'reviewNotes', 'Kaggle lists CC0 for this dataset version. Human privacy and publication review remains pending.',
  'privacy', jsonb_build_object('personalData', false, 'directIdentifiers', false, 'quasiIdentifiers', false, 'fieldReview', false),
  'confirmed', false)
from public.projects p
where d.project_id = p.id
  and p.slug = 'boston-airbnb-listings-analysis'
  and d.name = 'Boston Airbnb Listings'
  and d.record_count = 3585
  and d.schema ->> 'originalFilename' = 'boston_airbnb_cleaned.csv'
  and jsonb_typeof(d.schema -> 'columns') = 'array'
  and jsonb_array_length(d.schema -> 'columns') = 43
  and d.rights_review_status = 'unverified'
  and d.rights_metadata = '{}'::jsonb;

-- Boston's three count aggregations do not use their configured field: the engine
-- counts rows. Remove the unnecessary listing identifier from the public RPC
-- projection without changing KPI/chart/ranking formulas or numeric results.
do $$
declare
  v_config_id uuid;
  v_dataset_id uuid;
  v_config jsonb;
  v_kpis jsonb := '[]'::jsonb;
  v_charts jsonb := '[]'::jsonb;
  v_rankings jsonb := '[]'::jsonb;
  v_item jsonb;
  v_count_references integer := 0;
begin
  select c.id, d.id, c.config into v_config_id, v_dataset_id, v_config
  from public.projects p
  join public.dashboard_configs c on c.project_id = p.id
  join public.datasets d on d.project_id = p.id and c.config ->> 'datasetId' = d.id::text
  where p.slug = 'boston-airbnb-listings-analysis'
    and p.status = 'published' and p.dashboard_available
    and d.name = 'Boston Airbnb Listings' and d.record_count = 3585
    and d.schema ->> 'originalFilename' = 'boston_airbnb_cleaned.csv'
    and jsonb_typeof(d.schema -> 'columns') = 'array'
    and jsonb_array_length(d.schema -> 'columns') = 43
    and d.dashboard_public_enabled and 'id' = any(d.dashboard_fields);
  if not found then return; end if;
  if jsonb_typeof(v_config -> 'filters') is distinct from 'array'
    or jsonb_typeof(v_config -> 'kpis') is distinct from 'array'
    or jsonb_typeof(v_config -> 'charts') is distinct from 'array'
    or jsonb_typeof(v_config -> 'rankings') is distinct from 'array'
    or exists (select 1 from jsonb_array_elements(v_config -> 'filters') item where item ->> 'field' = 'id') then
    raise exception 'Boston Dashboard identifier references need manual review';
  end if;

  for v_item in select value from jsonb_array_elements(v_config -> 'kpis') loop
    if v_item ->> 'field' = 'id' then
      if v_item ->> 'aggregation' is distinct from 'count' then
        raise exception 'Boston KPI identifier is not count-only';
      end if;
      v_item := jsonb_set(v_item, '{field}', '""'::jsonb);
      v_count_references := v_count_references + 1;
    end if;
    v_kpis := v_kpis || jsonb_build_array(v_item);
  end loop;
  for v_item in select value from jsonb_array_elements(v_config -> 'charts') loop
    if v_item ->> 'categoryField' = 'id' or v_item ->> 'seriesField' = 'id' or v_item ->> 'xField' = 'id' then
      raise exception 'Boston chart uses identifier outside count';
    end if;
    if v_item ->> 'valueField' = 'id' then
      if v_item ->> 'aggregation' is distinct from 'count' then
        raise exception 'Boston chart identifier is not count-only';
      end if;
      v_item := jsonb_set(v_item, '{valueField}', '""'::jsonb);
      v_count_references := v_count_references + 1;
    end if;
    v_charts := v_charts || jsonb_build_array(v_item);
  end loop;
  for v_item in select value from jsonb_array_elements(v_config -> 'rankings') loop
    if v_item ->> 'dimension' = 'id'
      or exists (select 1 from jsonb_array_elements(v_item -> 'detailColumns') col where col ->> 'field' = 'id') then
      raise exception 'Boston ranking uses identifier outside count';
    end if;
    if v_item ->> 'metric' = 'id' then
      if v_item ->> 'aggregation' is distinct from 'count' then
        raise exception 'Boston ranking identifier is not count-only';
      end if;
      v_item := jsonb_set(v_item, '{metric}', '""'::jsonb);
      v_count_references := v_count_references + 1;
    end if;
    v_rankings := v_rankings || jsonb_build_array(v_item);
  end loop;
  if v_count_references <> 3 then
    raise exception 'Boston Dashboard count references changed; review before migration';
  end if;

  update public.dashboard_configs
  set config = jsonb_set(jsonb_set(jsonb_set(v_config, '{kpis}', v_kpis), '{charts}', v_charts), '{rankings}', v_rankings)
  where id = v_config_id;
  update public.datasets set dashboard_fields = array_remove(dashboard_fields, 'id') where id = v_dataset_id;
end;
$$;
