export interface KPIData {
  label: string;
  value: string;
  context?: string;
  trend?: {
    value: string;
    context: string;
  };
}

export interface TrendPoint {
  label: string;
  value: number;
  displayValue: string;
}

export interface TrendVisualizationData {
  id: string;
  eyebrow: string;
  title: string;
  context: string;
  summary: string;
  points: readonly TrendPoint[];
  yAxis: {
    minimum: number;
    maximum: number;
    ticks: readonly {
      value: number;
      label: string;
    }[];
  };
}

export interface InsightPreviewData {
  label: string;
  value: string;
  title: string;
  interpretation: string;
  href: string;
}

export interface ProjectOverviewData {
  context: string;
  kpis: readonly KPIData[];
  trend: TrendVisualizationData;
  takeaway: string;
  insights: readonly InsightPreviewData[];
}
