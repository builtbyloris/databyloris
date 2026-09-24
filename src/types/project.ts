import type { ProjectOverviewData } from "@/types/analytics";

export type ProjectCategory =
  | "Music"
  | "Entertainment"
  | "Gaming"
  | "Travel"
  | "Business";

export type ProjectCoverType =
  | "listening"
  | "catalog"
  | "market"
  | "geography"
  | "economy";

export type ProjectStatus = "draft" | "published" | "upcoming";

export interface DatasetMetadata {
  name: string;
  summary: string;
  period?: string;
  records?: string;
  entities?: string;
  categories?: string;
  markets?: string;
  grain: string;
  source: string;
  illustrative: boolean;
}

export interface ProjectSummary {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  question: string;
  coverType: ProjectCoverType;
  period: string;
  tags: string[];
  featured: boolean;
  demo: boolean;
  status: ProjectStatus;
  href?: string;
}

export interface ProjectDetail extends ProjectSummary {
  subtitle: string;
  dataset: DatasetMetadata;
  overview: ProjectOverviewData;
  content: {
    methodology: string;
    limitations: string;
  };
}
