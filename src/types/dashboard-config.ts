import type {ChartConfig} from "./chart-config";
import type {FilterConfig} from "./filter-config";
import type {AggregationType, KPIConfig, KPIFormat} from "./kpi";

export interface RankingConfig {
  id: string;
  title: string;
  dimension: string;
  dimensionLabel: string;
  detailColumns: {
    field: string;
    label: string;
  }[];
  metric: string;
  metricLabel: string;
  aggregation: AggregationType;
  limit: number;
  sortDirection: "asc" | "desc";
  valueFormat?: KPIFormat;
}

export interface DashboardLayoutConfig {
  featuredChartId: string;
}

export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  datasetId: string;
  kpis: KPIConfig[];
  charts: ChartConfig[];
  filters: FilterConfig[];
  rankings: RankingConfig[];
  layout: DashboardLayoutConfig;
}
