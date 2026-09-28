import type {DashboardConfig} from "./dashboard-config";
import type {DashboardRecord} from "./dataset";
import type {Project} from "./project";

export interface AdminDatasetDraft {
  id: string;
  records: DashboardRecord[];
  fields: string[];
}

export interface ProjectDraft {
  project: Project;
  dashboardConfig: DashboardConfig;
  dataset: AdminDatasetDraft | null;
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
