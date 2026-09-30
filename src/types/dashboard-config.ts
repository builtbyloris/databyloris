import type {ChartConfig} from "./chart-config";
import type {FilterConfig} from "./filter-config";
import type {AggregationType, KPIConfig, KPIFormat} from "./kpi";
import type {DashboardText} from "./project";

export interface RankingConfig {
  id: string;
  title: DashboardText;
  dimension: string;
  dimensionLabel: DashboardText;
  detailColumns: {
    field: string;
    label: DashboardText;
  }[];
  metric: string;
  metricLabel: DashboardText;
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
  title: DashboardText;
  description?: DashboardText;
  datasetId: string;
  kpis: KPIConfig[];
  charts: ChartConfig[];
  filters: FilterConfig[];
  rankings: RankingConfig[];
  layout: DashboardLayoutConfig;
}
