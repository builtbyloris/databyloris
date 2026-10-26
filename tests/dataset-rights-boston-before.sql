-- Disposable PostgreSQL only. Run after the existing Explorer/RLS migrations and
-- before the new rights migrations; all values here are synthetic.
insert into public.projects (id, slug, title, description, category, status, dashboard_available)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'boston-airbnb-listings-analysis',
  '{"it":"Boston","en":"Boston"}', '{"it":"Test","en":"Test"}', 'Data Analytics', 'published', true);

insert into public.datasets (id, project_id, name, record_count, schema, explorer_enabled, explorer_fields)
select 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Boston Airbnb Listings', 3585,
  jsonb_build_object('originalFilename', 'boston_airbnb_cleaned.csv', 'columns',
    (select jsonb_agg(jsonb_build_object('name', name, 'type',
      case when name in ('room_type', 'neighbourhood_cleansed', 'property_type', 'cancellation_policy')
        then 'string' else 'number' end, 'nullable', false))
     from unnest(array['id', 'room_type', 'neighbourhood_cleansed', 'property_type',
       'cancellation_policy', 'price_usd', 'review_scores_rating', 'availability_365', 'accommodates']
       || array(select 'private_' || generate_series from generate_series(1, 34))) as name)),
  true, array['neighbourhood_cleansed', 'property_type', 'room_type', 'price_usd',
    'availability_365', 'review_scores_rating', 'cancellation_policy'];

insert into public.dataset_rows (dataset_id, row_index, data)
select 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', n - 1,
  jsonb_build_object('id', n, 'room_type', case when n % 2 = 0 then 'Entire home/apt' else 'Private room' end,
    'neighbourhood_cleansed', 'Test', 'property_type', 'Apartment', 'cancellation_policy', 'flexible',
    'price_usd', n % 300, 'review_scores_rating', 90, 'availability_365', 200, 'accommodates', 2,
    'private_1', 'not public')
from generate_series(1, 3585) as n;

insert into public.dashboard_configs (project_id, config)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ('{"id":"boston-test","title":"Boston","datasetId":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",' ||
  '"layout":{"featuredChartId":"chart"},' ||
  '"filters":[{"id":"room","label":"Room","type":"select","field":"room_type"}],' ||
  '"kpis":[{"id":"total","label":"Total","field":"id","aggregation":"count","format":"number"}],' ||
  '"charts":[{"id":"chart","title":"Listings","type":"bar","categoryField":"room_type","valueField":"id","aggregation":"count"}],' ||
  '"rankings":[{"id":"rank","title":"Ranking","dimensionLabel":"Area","metricLabel":"Listings",' ||
  '"dimension":"neighbourhood_cleansed","metric":"id","aggregation":"count","detailColumns":[]}]}')::jsonb);

-- An existing draft must not inherit the published-project compatibility exemption.
insert into public.projects (id, slug, title, description, category, status, dashboard_available)
values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'existing-draft',
  '{"it":"Draft","en":"Draft"}', '{"it":"Test","en":"Test"}', 'Data Analytics', 'draft', false);
insert into public.datasets (id, project_id, name, record_count, schema)
values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  'Draft Dataset', 0, '{"columns":[{"name":"metric","type":"number","nullable":true}]}');
