import type {AggregationType} from "./kpi";

export type ChartType = "bar" | "line" | "pie" | "donut";
export type ChartSort = "category-asc" | "category-desc" | "value-asc" | "value-desc";

export interface ChartConfig {
  id: string;
  title: string;
  description?: string;
  type: ChartType;
  categoryField: string;
  valueField?: string;
  seriesField?: string;
  aggregation: AggregationType;
  limit?: number;
  sort?: ChartSort;
  valueFormat?: "number" | "sales";
  xField?: string;
}
