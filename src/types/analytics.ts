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

export interface RankingVisualizationData {
  type: "ranking";
  title: string;
  context: string;
  summary: string;
  items: readonly {
    label: string;
    value: number;
    displayValue: string;
  }[];
}

export interface GrowthVisualizationData {
  type: "growth";
  title: string;
  context: string;
  summary: string;
  items: readonly {
    label: string;
    growth: number;
    displayGrowth: string;
    popularityIndex: number;
  }[];
}

export interface MarketComparisonData {
  type: "market-comparison";
  title: string;
  context: string;
  summary: string;
  categories: readonly string[];
  markets: readonly {
    label: string;
    highlight: string;
    values: readonly {
      category: string;
      value: number;
    }[];
  }[];
}

export interface LifecycleVisualizationData {
  type: "lifecycle";
  title: string;
  context: string;
  summary: string;
  labels: readonly string[];
  series: readonly {
    label: string;
    description: string;
    values: readonly number[];
  }[];
}

export type StoryVisualizationData =
  | RankingVisualizationData
  | GrowthVisualizationData
  | MarketComparisonData
  | LifecycleVisualizationData;

export interface InsightStoryData {
  id: string;
  label: string;
  question: string;
  explanation: string;
  takeaway: string;
  ctaHref: string;
  layout: "text-left" | "text-right" | "full";
  visualization: StoryVisualizationData;
  exploreHint?: string;
}

export interface ProjectInsightsData {
  introduction: string;
  disclaimer: string;
  stories: readonly InsightStoryData[];
  curiosity: {
    title: string;
    text: string;
  };
}
