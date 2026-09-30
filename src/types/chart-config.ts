import type {AggregationType, KPIFormat} from "./kpi";
import type {DashboardText} from "./project";

export type ChartType = "bar" | "line" | "pie" | "donut";
export type ChartSort = "category-asc" | "category-desc" | "value-asc" | "value-desc";

export interface ChartConfig {
  id: string;
  title: DashboardText;
  description?: DashboardText;
  type: ChartType;
  categoryField: string;
  valueField?: string;
  seriesField?: string;
  aggregation: AggregationType;
  limit?: number;
  sort?: ChartSort;
  valueFormat?: KPIFormat;
  xField?: string;
}
