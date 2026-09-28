import type {ChartConfig} from "./chart-config";
import type {FilterConfig} from "./filter-config";
import type {KPI} from "./kpi";

export interface DashboardConfig {
  id: string;
  title: string;
  description?: string;
  datasetIds: string[];
  kpis: KPI[];
  charts: ChartConfig[];
  filters: FilterConfig[];
}
