import type {AdminDatasetDraft, AdminProjectInput, DashboardConfig, ProjectDetail} from "@/types";
import {normalizeDatasetFieldName, resolveDatasetFieldName} from "@/lib/datasets/field-names";
import {isProjectCoverStoragePath} from "@/lib/project-media";
import {isSafeExternalUrl} from "@/lib/urls";
import {validateDashboardConfig} from "./dashboard-validation";

export type PublishingArea = "metadata" | "cover" | "case-study" | "dataset" | "dashboard";
export type PublishingIssueCode =
  | "titleIt" | "titleEn" | "descriptionIt" | "descriptionEn" | "slug" | "category"
  | "cover" | "caseStudy" | "contextIt" | "contextEn" | "objectiveIt" | "objectiveEn"
  | "datasetName" | "datasetSourceIt" | "datasetSourceEn" | "datasetDescriptionIt" | "datasetDescriptionEn"
  | "methodology" | "insights" | "repositoryUrl" | "sourceUrl"
  | "dashboardDataset" | "dashboardSchema" | "dashboardRows" | "dashboardConfig"
  | "dashboardDatasetId" | "dashboardFields" | "dashboardContent";

export interface PublishingIssue {
  code: PublishingIssueCode;
  area: PublishingArea;
}

export interface PublishingQualityResult {
  ready: boolean;
  issues: PublishingIssue[];
  featuredDraftWarning: boolean;
}

export interface PublishingQualityInput {
  project: AdminProjectInput;
  imagePath: string | null;
  detail: ProjectDetail | null;
  dataset: AdminDatasetDraft | null;
  datasetCount: number;
  config: DashboardConfig | null;
}

const filled = (value: string | undefined) => Boolean(value?.trim());
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function evaluatePublishingQuality({project, imagePath, detail, dataset, datasetCount, config}: PublishingQualityInput): PublishingQualityResult {
  const issues: PublishingIssue[] = [];
  const add = (code: PublishingIssueCode, area: PublishingArea) => issues.push({code, area});

  if (!filled(project.title.it)) add("titleIt", "metadata");
  if (!filled(project.title.en)) add("titleEn", "metadata");
  if (!filled(project.description.it)) add("descriptionIt", "metadata");
  if (!filled(project.description.en)) add("descriptionEn", "metadata");
  if (!slugPattern.test(project.slug)) add("slug", "metadata");
  if (!filled(project.category)) add("category", "metadata");
  if (!isProjectCoverStoragePath(imagePath, project.id)) add("cover", "cover");
  if (project.repositoryUrl && !isSafeExternalUrl(project.repositoryUrl)) add("repositoryUrl", "metadata");

  if (!detail) {
    add("caseStudy", "case-study");
  } else {
    if (!filled(detail.context.it)) add("contextIt", "case-study");
    if (!filled(detail.context.en)) add("contextEn", "case-study");
    if (!filled(detail.objective.it)) add("objectiveIt", "case-study");
    if (!filled(detail.objective.en)) add("objectiveEn", "case-study");
    if (!filled(detail.dataset.name)) add("datasetName", "case-study");
    if (!filled(detail.dataset.source.it)) add("datasetSourceIt", "case-study");
    if (!filled(detail.dataset.source.en)) add("datasetSourceEn", "case-study");
    if (!filled(detail.dataset.description.it)) add("datasetDescriptionIt", "case-study");
    if (!filled(detail.dataset.description.en)) add("datasetDescriptionEn", "case-study");
    if (detail.dataset.sourceUrl && !isSafeExternalUrl(detail.dataset.sourceUrl)) add("sourceUrl", "case-study");
    if (!detail.methodology.length || !detail.methodology.every((step) => filled(step.title.it) && filled(step.title.en) && filled(step.description.it) && filled(step.description.en))) add("methodology", "case-study");
    if (!detail.insights.length || !detail.insights.every((insight) => filled(insight.description.it) && filled(insight.description.en) && (!insight.title || (filled(insight.title.it) && filled(insight.title.en))))) add("insights", "case-study");
  }

  if (project.dashboardAvailable) {
    if (datasetCount !== 1 || (dataset && (dataset.source !== "database" || dataset.projectId !== project.id))) {
      add("dashboardDataset", "dataset");
    } else if (!dataset) {
      add("dashboardSchema", "dataset");
    } else {
      const names = dataset.columns.map((column) => column.name);
      if (!names.length || names.some((name) => !filled(name)) || new Set(names.map(normalizeDatasetFieldName)).size !== names.length) add("dashboardSchema", "dataset");
      if (!dataset.records.some((record) => names.some((name) => {
        const field = resolveDatasetFieldName(name, Object.keys(record));
        return field !== null && record[field] != null;
      }))) add("dashboardRows", "dataset");
    }
    if (!config) {
      add("dashboardConfig", "dashboard");
    } else if (dataset) {
      if (config.datasetId !== dataset.id && config.datasetId !== project.slug) add("dashboardDatasetId", "dashboard");
      if (validateDashboardConfig(config, dataset.fields).length > 0 || dataset.fields.length === 0) add("dashboardFields", "dashboard");
      if (config.kpis.length + config.charts.length + config.rankings.length === 0) add("dashboardContent", "dashboard");
    }
  }

  return {ready: issues.length === 0, issues, featuredDraftWarning: project.status === "draft" && project.featured};
}
