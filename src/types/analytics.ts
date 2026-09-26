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

export type DashboardModuleId =
  | "streaming-trend"
  | "top-artists"
  | "genre-distribution"
  | "genre-growth"
  | "artist-comparison"
  | "track-table";

export interface InsightExploreState {
  filters?: Partial<DashboardFilterState>;
  target?: DashboardModuleId;
}

export interface InsightStoryData {
  id: string;
  label: string;
  question: string;
  explanation: string;
  takeaway: string;
  layout: "text-left" | "text-right" | "full";
  visualization: StoryVisualizationData;
  exploreState: InsightExploreState;
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

export interface DashboardRow {
  date: string;
  month: string;
  year: number;
  trackId: string;
  trackName: string;
  artistId: string;
  artistName: string;
  genre: string;
  country: string;
  streams: number;
  listeners: number;
  popularity: number;
  playlistReach: number;
}

export type DashboardFilterKey = "period" | "country" | "genre" | "artist";

export type DashboardFilterState = Record<DashboardFilterKey, string | null>;

export interface FilterOption {
  label: string;
  value: string;
}

export type DashboardFilterOptions = Record<
  DashboardFilterKey,
  readonly FilterOption[]
>;

export interface DashboardKPIResult {
  totalStreams: number;
  uniqueListeners: number;
  topArtist: string | null;
  topGenre: string | null;
}

export interface MonthlyStreamsPoint {
  period: string;
  streams: number;
}

export interface ArtistRankingItem {
  artistName: string;
  streams: number;
}

export interface GenreDistributionItem {
  genre: string;
  streams: number;
  percentage: number;
}

export interface GenreGrowthItem {
  genre: string;
  growthPercent: number;
  earliestStreams: number;
  latestStreams: number;
  totalStreams: number;
}

export type GenreGrowthResult =
  | {
      status: "ready";
      earliestPeriod: string;
      latestPeriod: string;
      items: readonly GenreGrowthItem[];
    }
  | {
      status: "insufficient";
      reason: "period" | "comparison";
      items: readonly [];
    };

export interface ArtistComparisonMetric {
  artistName: string;
  totalStreams: number;
  uniqueListeners: number;
  averagePopularity: number;
  playlistReach: number;
}

export interface TrackAggregate {
  trackId: string;
  trackName: string;
  artistName: string;
  genre: string;
  streams: number;
  listeners: number;
  popularity: number;
}

export interface DashboardConfiguration {
  datasetLabel: string;
  datasetDescription: string;
  synthetic: boolean;
  rows: readonly DashboardRow[];
}
