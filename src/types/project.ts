import type {
  DashboardConfiguration,
  ProjectInsightsData,
  ProjectOverviewData,
} from "@/types/analytics";
import type { GuidedTourStep } from "@/types/onboarding";

export type ProjectCategory = string;

export type ProjectCoverType =
  | "listening"
  | "catalog"
  | "market"
  | "geography"
  | "economy"
  | "generic";

export type ProjectStatus = "published";

export interface DatasetMetadata {
  name: string;
  summary: string;
  period?: string;
  records?: string;
  entities?: string;
  categories?: string;
  markets?: string;
  grain?: string;
  source?: string;
  illustrative: boolean;
}

export interface ProjectMethodologyData {
  title: string;
  introduction: string;
  objective: string;
  dataset: {
    description: string;
    grain: string;
    period: string;
    dimensions: readonly string[];
    metrics: readonly string[];
  };
  preparation: readonly string[];
  techniques: readonly {
    label: string;
    description: string;
  }[];
  metricDefinitions: readonly {
    label: string;
    description: string;
  }[];
  tools: readonly {
    label: string;
    description: string;
  }[];
  limitations: readonly string[];
  takeaways: readonly string[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  question?: string;
  coverType: ProjectCoverType;
  period?: string;
  tags: string[];
  featured: boolean;
  demo: boolean;
  status: ProjectStatus;
  href?: string;
}

export interface PublicProjectMetadata extends ProjectSummary {
  id?: string;
  subtitle?: string;
  dataset?: {
    records?: string;
    grain?: string;
    source?: string;
  };
}

export interface ProjectDetail extends ProjectSummary {
  subtitle?: string;
  dataset: DatasetMetadata;
  dashboard: DashboardConfiguration;
  overview: ProjectOverviewData;
  insights: ProjectInsightsData;
  methodology: ProjectMethodologyData;
}

export interface ProjectAnalyticsImplementation {
  dataset: Pick<
    DatasetMetadata,
    "name" | "summary" | "entities" | "categories" | "markets" | "illustrative"
  >;
  dashboard: DashboardConfiguration;
  overview: ProjectOverviewData;
  insights: ProjectInsightsData;
  methodology: ProjectMethodologyData;
  tour?: {
    sessionKey: string;
    steps: readonly GuidedTourStep[];
    storageKey: string;
  };
}
