import type {ChartConfig} from "./chart-config";
import type {FilterConfig} from "./filter-config";
import type {AggregationType, KPIConfig} from "./kpi";

export interface RankingConfig {
  id: string;
  title: string;
  dimension: string;
  detailFields: string[];
  metric: string;
  aggregation: AggregationType;
  limit: number;
  sortDirection: "asc" | "desc";
  valueFormat?: "number" | "sales";
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
