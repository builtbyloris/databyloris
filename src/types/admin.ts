import type {DashboardConfig} from "./dashboard-config";
import type {DashboardRecord} from "./dataset";
import type {LocalizedText, Project, ProjectDetail} from "./project";

export interface AdminDatasetDraft {
  id: string;
  projectId: string;
  name: string;
  originalFilename: string | null;
  storagePath: string | null;
  grain: string;
  recordCount: number;
  columns: DatasetColumn[];
  records: DashboardRecord[];
  fields: string[];
  source: "database" | "registry";
  updatedAt: string | null;
}

export type DatasetColumnType = "string" | "number" | "boolean" | "date";

export interface DatasetColumn {
  name: string;
  type: DatasetColumnType;
  nullable: boolean;
}

export interface RegisterDatasetInput {
  projectId: string;
  storagePath: string;
  originalFilename: string;
  name: string;
  grain: string;
  replaceExisting: boolean;
}

export interface ProjectDraft {
  project: Project;
  imagePath: string | null;
  localizedTitle: LocalizedText;
  localizedDescription: LocalizedText;
  projectDetail: ProjectDetail;
  dashboardConfig: DashboardConfig;
  dataset: AdminDatasetDraft | null;
}

export interface AdminProjectRecord {
  project: Project;
  imagePath: string | null;
  localizedTitle: LocalizedText;
  localizedDescription: LocalizedText;
}

export interface AdminProjectInput {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  technologies: string[];
  featured: boolean;
  status: "draft" | "published";
  dashboardAvailable: boolean;
  repositoryUrl?: string;
}

export type AdminActionError =
  | "databaseUnavailable"
  | "duplicateSlug"
  | "invalidConfig"
  | "invalidDetail"
  | "invalidDataset"
  | "invalidCover"
  | "coverUpdateFailed"
  | "datasetExists"
  | "datasetTooLarge"
  | "tooManyRows"
  | "datasetUploadFailed"
  | "datasetProcessingFailed"
  | "invalidProject"
  | "projectNotFound"
  | "unknown";

export type AdminActionResult<T> =
  | {ok: true; data: T}
  | {ok: false; error: AdminActionError};

export interface ProjectCoverResult {
  imagePath: string | null;
  imageUrl: string;
  cleanupIncomplete: boolean;
}

export type AdminView = "overview" | "projects" | "editor" | "builder" | "media";

export type AdminValidationCode =
  | "required"
  | "invalidSlug"
  | "duplicateSlug"
  | "unsupportedValue"
  | "unknownField"
  | "fieldRequired"
  | "duplicateId"
  | "positiveLimit";

export interface AdminValidationIssue {
  path: string;
  code: AdminValidationCode;
}
