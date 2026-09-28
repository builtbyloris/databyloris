import type {DashboardConfig} from "@/types";

export const videoGameSalesDashboard: DashboardConfig = {
  id: "video-game-sales-dashboard",
  title: "videoGameSales.title",
  description: "videoGameSales.description",
  datasetId: "video-game-sales",
  filters: [
    {id: "year", label: "filters.year", field: "year", type: "select"},
    {id: "platform", label: "filters.platform", field: "platform", type: "select"},
    {id: "genre", label: "filters.genre", field: "genre", type: "select"},
    {id: "region", label: "filters.region", field: "region", type: "select"},
  ],
  kpis: [
    {id: "sales", label: "kpis.sales", aggregation: "sum", field: "sales", format: "sales"},
    {id: "games", label: "kpis.games", aggregation: "distinctCount", field: "name", format: "number"},
    {id: "platforms", label: "kpis.platforms", aggregation: "distinctCount", field: "platform", format: "number"},
    {id: "genres", label: "kpis.genres", aggregation: "distinctCount", field: "genre", format: "number"},
  ],
  charts: [
    {id: "sales-over-time", title: "charts.salesOverTime", type: "line", categoryField: "year", valueField: "sales", aggregation: "sum", sort: "category-asc", valueFormat: "sales"},
    {id: "sales-by-platform", title: "charts.salesByPlatform", type: "bar", categoryField: "platform", valueField: "sales", aggregation: "sum", limit: 5, sort: "value-desc", valueFormat: "sales"},
    {id: "sales-by-genre", title: "charts.salesByGenre", type: "donut", categoryField: "genre", valueField: "sales", aggregation: "sum", sort: "value-desc", valueFormat: "sales"},
  ],
  rankings: [
    {
      id: "top-games",
      title: "ranking.videoGames.title",
      dimension: "name",
      dimensionLabel: "ranking.videoGames.game",
      detailColumns: [
        {field: "platform", label: "ranking.videoGames.platform"},
        {field: "genre", label: "ranking.videoGames.genre"},
      ],
      metric: "sales",
      metricLabel: "ranking.videoGames.sales",
      aggregation: "sum",
      limit: 10,
      sortDirection: "desc",
      valueFormat: "sales",
    },
  ],
  layout: {featuredChartId: "sales-over-time"},
};
