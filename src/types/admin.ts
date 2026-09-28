import type {DashboardConfig} from "./dashboard-config";
import type {DashboardRecord} from "./dataset";
import type {LocalizedText, Project} from "./project";

export interface AdminDatasetDraft {
  id: string;
  records: DashboardRecord[];
  fields: string[];
}

export interface ProjectDraft {
  project: Project;
  localizedTitle: LocalizedText;
  localizedDescription: LocalizedText;
  dashboardConfig: DashboardConfig;
  dataset: AdminDatasetDraft | null;
}

export interface AdminProjectRecord {
  project: Project;
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
  | "invalidProject"
  | "projectNotFound"
  | "unknown";

export type AdminActionResult<T> =
  | {ok: true; data: T}
  | {ok: false; error: AdminActionError};

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
