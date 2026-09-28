insert into public.projects (
  slug,
  title,
  description,
  category,
  technologies,
  image_path,
  featured,
  status,
  published_at,
  repository_url,
  dashboard_available
)
values
  (
    'video-game-sales',
    '{"it":"Video Game Sales","en":"Video Game Sales"}'::jsonb,
    '{"it":"Tendenze di vendita globali tra piattaforme, generi ed epoche editoriali.","en":"Global sales patterns across platforms, genres and publishing eras."}'::jsonb,
    'Entertainment',
    '["Python","Pandas","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    true,
    'published',
    '2026-08-20T00:00:00Z'::timestamptz,
    null,
    true
  ),
  (
    'flight-analysis',
    '{"it":"Flight Analysis","en":"Flight Analysis"}'::jsonb,
    '{"it":"Performance del traffico aereo, rotte e principali cause dei ritardi.","en":"Air traffic performance, routes and delay drivers at a glance."}'::jsonb,
    'Mobility',
    '["SQL","Python","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    true,
    'published',
    '2026-07-12T00:00:00Z'::timestamptz,
    null,
    false
  ),
  (
    'listening-insights',
    '{"it":"Listening Insights","en":"Listening Insights"}'::jsonb,
    '{"it":"Abitudini di ascolto trasformate in segnali utili per comprendere il pubblico.","en":"Listening habits translated into meaningful audience signals."}'::jsonb,
    'Media',
    '["TypeScript","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    true,
    'published',
    '2026-06-05T00:00:00Z'::timestamptz,
    null,
    true
  ),
  (
    'stock-market-analysis',
    '{"it":"Stock Market Analysis","en":"Stock Market Analysis"}'::jsonb,
    '{"it":"Movimenti di mercato, volatilità e confronti tra settori.","en":"Market movements, volatility and sector-level comparisons."}'::jsonb,
    'Finance',
    '["Python","SQL","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    false,
    'published',
    '2026-04-18T00:00:00Z'::timestamptz,
    null,
    false
  ),
  (
    'city-data-analysis',
    '{"it":"City Data Analysis","en":"City Data Analysis"}'::jsonb,
    '{"it":"Indicatori urbani su mobilità, servizi e qualità della vita.","en":"Urban indicators for mobility, services and quality of life."}'::jsonb,
    'Public Data',
    '["PostgreSQL","GeoJSON","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    false,
    'draft',
    null,
    null,
    false
  ),
  (
    'sports-performance',
    '{"it":"Sports Performance","en":"Sports Performance"}'::jsonb,
    '{"it":"Performance di atleti e squadre attraverso metriche confrontabili.","en":"Player and team performance through comparable metrics."}'::jsonb,
    'Sports',
    '["Python","Pandas","ECharts"]'::jsonb,
    '/images/projects/project-cover.svg',
    false,
    'draft',
    null,
    null,
    false
  )
on conflict (slug) do nothing;

insert into public.dashboard_configs (project_id, config)
select projects.id, seed.config
from (
  values
    (
      'video-game-sales',
      $config$
      {
        "id": "video-game-sales-dashboard",
        "title": "videoGameSales.title",
        "description": "videoGameSales.description",
        "datasetId": "video-game-sales",
        "filters": [
          {"id":"year","label":"filters.year","field":"year","type":"select"},
          {"id":"platform","label":"filters.platform","field":"platform","type":"select"},
          {"id":"genre","label":"filters.genre","field":"genre","type":"select"},
          {"id":"region","label":"filters.region","field":"region","type":"select"}
        ],
        "kpis": [
          {"id":"sales","label":"kpis.sales","aggregation":"sum","field":"sales","format":"sales"},
          {"id":"games","label":"kpis.games","aggregation":"distinctCount","field":"name","format":"number"},
          {"id":"platforms","label":"kpis.platforms","aggregation":"distinctCount","field":"platform","format":"number"},
          {"id":"genres","label":"kpis.genres","aggregation":"distinctCount","field":"genre","format":"number"}
        ],
        "charts": [
          {"id":"sales-over-time","title":"charts.salesOverTime","type":"line","categoryField":"year","valueField":"sales","aggregation":"sum","sort":"category-asc","valueFormat":"sales"},
          {"id":"sales-by-platform","title":"charts.salesByPlatform","type":"bar","categoryField":"platform","valueField":"sales","aggregation":"sum","limit":5,"sort":"value-desc","valueFormat":"sales"},
          {"id":"sales-by-genre","title":"charts.salesByGenre","type":"donut","categoryField":"genre","valueField":"sales","aggregation":"sum","sort":"value-desc","valueFormat":"sales"}
        ],
        "rankings": [
          {
            "id":"top-games",
            "title":"ranking.videoGames.title",
            "dimension":"name",
            "dimensionLabel":"ranking.videoGames.game",
            "detailColumns":[
              {"field":"platform","label":"ranking.videoGames.platform"},
              {"field":"genre","label":"ranking.videoGames.genre"}
            ],
            "metric":"sales",
            "metricLabel":"ranking.videoGames.sales",
            "aggregation":"sum",
            "limit":10,
            "sortDirection":"desc",
            "valueFormat":"sales"
          }
        ],
        "layout": {"featuredChartId":"sales-over-time"}
      }
      $config$::jsonb
    ),
    (
      'listening-insights',
      $config$
      {
        "id": "listening-insights-dashboard",
        "title": "listeningInsights.title",
        "description": "listeningInsights.description",
        "datasetId": "listening-insights",
        "filters": [
          {"id":"month","label":"filters.month","field":"month","type":"select"},
          {"id":"genre","label":"filters.genre","field":"genre","type":"select"},
          {"id":"artist","label":"filters.artist","field":"artist","type":"select"},
          {"id":"device","label":"filters.device","field":"device","type":"select"}
        ],
        "kpis": [
          {"id":"minutes","label":"kpis.minutes","aggregation":"sum","field":"minutesListened","format":"number"},
          {"id":"streams","label":"kpis.streams","aggregation":"sum","field":"streams","format":"number"},
          {"id":"artists","label":"kpis.artists","aggregation":"distinctCount","field":"artist","format":"number"},
          {"id":"genres","label":"kpis.genres","aggregation":"distinctCount","field":"genre","format":"number"}
        ],
        "charts": [
          {"id":"listening-over-time","title":"charts.listeningOverTime","type":"line","categoryField":"month","valueField":"minutesListened","aggregation":"sum","sort":"category-asc","valueFormat":"number"},
          {"id":"top-artists","title":"charts.topArtists","type":"bar","categoryField":"artist","valueField":"minutesListened","aggregation":"sum","limit":5,"sort":"value-desc","valueFormat":"number"},
          {"id":"listening-by-genre","title":"charts.listeningByGenre","type":"donut","categoryField":"genre","valueField":"minutesListened","aggregation":"sum","sort":"value-desc","valueFormat":"number"}
        ],
        "rankings": [
          {
            "id":"top-tracks",
            "title":"ranking.listening.title",
            "dimension":"track",
            "dimensionLabel":"ranking.listening.track",
            "detailColumns":[
              {"field":"artist","label":"ranking.listening.artist"},
              {"field":"genre","label":"ranking.listening.genre"}
            ],
            "metric":"minutesListened",
            "metricLabel":"ranking.listening.minutes",
            "aggregation":"sum",
            "limit":10,
            "sortDirection":"desc",
            "valueFormat":"number"
          }
        ],
        "layout": {"featuredChartId":"listening-over-time"}
      }
      $config$::jsonb
    )
) as seed(slug, config)
join public.projects on projects.slug = seed.slug
on conflict (project_id) do nothing;
