export type KPIFormat = "number" | "currency" | "percentage" | "duration";

export interface KPI {
  id: string;
  label: string;
  valueField: string;
  format: KPIFormat;
  trendField?: string;
  description?: string;
}
