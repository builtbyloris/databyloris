export type StoredProjectStatus = "draft" | "published";

export interface ProjectDatabaseRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  question: string | null;
  period: string | null;
  tags: string[];
  featured: boolean;
  demo: boolean;
  status: StoredProjectStatus;
  dataset_records: string | null;
  dataset_grain: string | null;
  dataset_source: string | null;
  cover_path: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ProjectWriteInput {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  question: string | null;
  period: string | null;
  tags: string[];
  featured: boolean;
  demo: boolean;
  status: StoredProjectStatus;
  dataset_records: string | null;
  dataset_grain: string | null;
  dataset_source: string | null;
}

export interface AdminProjectCounts {
  projects: number;
  published: number;
  drafts: number;
}

export type ProjectFormField =
  | "title"
  | "slug"
  | "subtitle"
  | "description"
  | "category"
  | "question"
  | "period"
  | "tags"
  | "datasetRecords"
  | "datasetGrain"
  | "datasetSource"
  | "status";

export interface ProjectFormState {
  error: string | null;
  fieldErrors: Partial<Record<ProjectFormField, string>>;
}

export interface DeleteProjectState {
  error: string | null;
}

export interface ProjectCoverActionState {
  message: string | null;
  status: "idle" | "success" | "warning" | "error";
}
