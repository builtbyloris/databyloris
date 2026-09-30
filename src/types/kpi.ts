import type {DashboardText} from "./project";

export type AggregationType = "sum" | "count" | "distinctCount" | "average";
export type KPIFormat = "number" | "sales" | "currency" | "percentage" | "duration";

export interface KPIConfig {
  id: string;
  label: DashboardText;
  aggregation: AggregationType;
  field?: string;
  format: KPIFormat;
  description?: DashboardText;
}

export type KPI = KPIConfig;
