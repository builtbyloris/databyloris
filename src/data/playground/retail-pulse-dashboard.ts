import type {DashboardConfig} from "@/types";

export const retailPulseDashboard: DashboardConfig = {
  id: "retail-pulse-playground",
  title: "playground.title",
  description: "playground.description",
  datasetId: "retail-pulse-demo",
  filters: [
    {id: "month", label: "filters.month", field: "month", type: "select"},
    {id: "city", label: "filters.city", field: "city", type: "select"},
    {id: "category", label: "filters.category", field: "category", type: "select"},
    {id: "channel", label: "filters.channel", field: "channel", type: "select"},
  ],
  kpis: [
    {id: "revenue", label: "kpis.revenue", aggregation: "sum", field: "revenue", format: "currency"},
    {id: "orders", label: "kpis.orders", aggregation: "sum", field: "orders", format: "number"},
    {id: "customers", label: "kpis.customers", aggregation: "sum", field: "customers", format: "number"},
    {id: "units", label: "kpis.units", aggregation: "sum", field: "units", format: "number"},
  ],
  charts: [
    {id: "revenue-over-time", title: "charts.revenueOverTime", type: "line", categoryField: "month", valueField: "revenue", aggregation: "sum", sort: "category-asc", valueFormat: "currency"},
    {id: "revenue-by-city", title: "charts.revenueByCity", type: "bar", categoryField: "city", valueField: "revenue", aggregation: "sum", limit: 5, sort: "value-desc", valueFormat: "currency"},
    {id: "revenue-by-category", title: "charts.revenueByCategory", type: "donut", categoryField: "category", valueField: "revenue", aggregation: "sum", sort: "value-desc", valueFormat: "currency"},
  ],
  rankings: [
    {
      id: "top-cities",
      title: "ranking.playground.title",
      dimension: "city",
      dimensionLabel: "ranking.playground.city",
      detailColumns: [],
      metric: "revenue",
      metricLabel: "ranking.playground.revenue",
      aggregation: "sum",
      limit: 5,
      sortDirection: "desc",
      valueFormat: "currency",
    },
  ],
  layout: {featuredChartId: "revenue-over-time"},
};
