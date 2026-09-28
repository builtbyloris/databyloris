export type AggregationType = "sum" | "count" | "distinctCount" | "average";
export type KPIFormat = "number" | "sales" | "currency" | "percentage" | "duration";

export interface KPIConfig {
  id: string;
  label: string;
  aggregation: AggregationType;
  field?: string;
  format: KPIFormat;
  description?: string;
}

export type KPI = KPIConfig;
