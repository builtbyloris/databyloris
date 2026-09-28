import type {DashboardConfig} from "@/types";

export const listeningInsightsDashboard: DashboardConfig = {
  id: "listening-insights-dashboard",
  title: "listeningInsights.title",
  description: "listeningInsights.description",
  datasetId: "listening-insights",
  filters: [
    {id: "month", label: "filters.month", field: "month", type: "select"},
    {id: "genre", label: "filters.genre", field: "genre", type: "select"},
    {id: "artist", label: "filters.artist", field: "artist", type: "select"},
    {id: "device", label: "filters.device", field: "device", type: "select"},
  ],
  kpis: [
    {id: "minutes", label: "kpis.minutes", aggregation: "sum", field: "minutesListened", format: "number"},
    {id: "streams", label: "kpis.streams", aggregation: "sum", field: "streams", format: "number"},
    {id: "artists", label: "kpis.artists", aggregation: "distinctCount", field: "artist", format: "number"},
    {id: "genres", label: "kpis.genres", aggregation: "distinctCount", field: "genre", format: "number"},
  ],
  charts: [
    {id: "listening-over-time", title: "charts.listeningOverTime", type: "line", categoryField: "month", valueField: "minutesListened", aggregation: "sum", sort: "category-asc", valueFormat: "number"},
    {id: "top-artists", title: "charts.topArtists", type: "bar", categoryField: "artist", valueField: "minutesListened", aggregation: "sum", limit: 5, sort: "value-desc", valueFormat: "number"},
    {id: "listening-by-genre", title: "charts.listeningByGenre", type: "donut", categoryField: "genre", valueField: "minutesListened", aggregation: "sum", sort: "value-desc", valueFormat: "number"},
  ],
  rankings: [
    {
      id: "top-tracks",
      title: "ranking.listening.title",
      dimension: "track",
      dimensionLabel: "ranking.listening.track",
      detailColumns: [
        {field: "artist", label: "ranking.listening.artist"},
        {field: "genre", label: "ranking.listening.genre"},
      ],
      metric: "minutesListened",
      metricLabel: "ranking.listening.minutes",
      aggregation: "sum",
      limit: 10,
      sortDirection: "desc",
      valueFormat: "number",
    },
  ],
  layout: {featuredChartId: "listening-over-time"},
};
