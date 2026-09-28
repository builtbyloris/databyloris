export type ProjectStatus = "draft" | "published" | "archived";

export interface LocalizedText {
  it: string;
  en: string;
}

export interface DatasetSummary {
  name: string;
  source: LocalizedText;
  sourceUrl?: string;
  records?: number;
  period?: LocalizedText;
  description: LocalizedText;
}

export interface MethodologyStep {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface ProjectInsight {
  id: string;
  title?: LocalizedText;
  description: LocalizedText;
}

export interface ProjectDetail {
  context: LocalizedText;
  objective: LocalizedText;
  methodology: MethodologyStep[];
  dataset: DatasetSummary;
  insights: ProjectInsight[];
  updatedAt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  featured: boolean;
  status: ProjectStatus;
  publishedAt: string | null;
  repositoryUrl?: string;
  dashboardAvailable?: boolean;
  detail?: ProjectDetail;
}
