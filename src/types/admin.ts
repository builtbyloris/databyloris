import type {DashboardConfig} from "./dashboard-config";
import type {DashboardRecord} from "./dataset";
import type {LocalizedText, Project, ProjectDetail} from "./project";
import type {PublishingIssue} from "@/lib/admin/publishing-quality-gate";

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
  explorerEnabled: boolean;
  explorerFields: string[];
  dictionary: DatasetDictionary;
  rights: DatasetRights;
  dashboardFields: string[];
  dashboardPublicEnabled: boolean;
  csvExportEnabled: boolean;
  rightsLegacy: boolean;
  source: "database" | "registry";
  updatedAt: string | null;
}

export interface DatasetRights {
  sourceAuthor: string;
  sourceUrl: string;
  platform: "kaggle" | "open-data" | "other";
  dataPeriod: string;
  snapshotDate: string;
  transformations: LocalizedText;
  licenseType: "cc0" | "cc-by" | "cc-by-sa" | "cc-by-nc" | "cc-by-nd" | "odbl" | "custom" | "competition-rules" | "unknown";
  licenseUrl: string;
  licenseVersion: string;
  licenseCheckedAt: string;
  reviewStatus: "unverified" | "verified" | "needs-review";
  restrictions: LocalizedText;
  reviewNotes: string;
  privacy: {personalData: boolean; directIdentifiers: boolean; quasiIdentifiers: boolean; fieldReview: boolean};
  confirmed: boolean;
}

export type DatasetColumnType = "string" | "number" | "boolean" | "date";

export interface DatasetColumn {
  name: string;
  type: DatasetColumnType;
  nullable: boolean;
}

export interface DatasetFieldMetadata {
  label: LocalizedText;
  description: LocalizedText;
  dataType?: DatasetColumnType;
  unit?: string;
  format?: string;
}

export type DatasetDictionary = Record<string, DatasetFieldMetadata>;

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
  | "publishingBlocked"
  | "projectNotFound"
  | "unknown";

export type AdminActionResult<T> =
  | {ok: true; data: T}
  | {ok: false; error: AdminActionError; issues?: PublishingIssue[]};

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
