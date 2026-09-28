export type ChartType = "bar" | "line" | "area" | "pie" | "scatter" | "map";

export interface ChartConfig {
  id: string;
  title: string;
  description?: string;
  type: ChartType;
  datasetId: string;
  xField?: string;
  yFields: string[];
  groupBy?: string;
  height?: number;
}
