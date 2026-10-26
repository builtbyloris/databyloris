import type {AdminDatasetDraft, AdminProjectInput, DashboardConfig, ProjectDetail} from "@/types";
import {normalizeDatasetFieldName, resolveDatasetFieldName} from "@/lib/datasets/field-names";
import {isProjectCoverStoragePath} from "@/lib/project-media";
import {isSafeExternalUrl} from "@/lib/urls";
import {validateDashboardConfig} from "./dashboard-validation";
import {dashboardReferencedFields, isReviewedRights, potentiallyIdentifyingFields, validFieldAllowlist} from "@/lib/datasets/rights";

export type PublishingArea = "metadata" | "cover" | "case-study" | "dataset" | "dashboard" | "rights";
export type PublishingIssueCode =
  | "titleIt" | "titleEn" | "descriptionIt" | "descriptionEn" | "slug" | "category"
  | "cover" | "caseStudy" | "contextIt" | "contextEn" | "objectiveIt" | "objectiveEn"
  | "datasetName" | "datasetSourceIt" | "datasetSourceEn" | "datasetDescriptionIt" | "datasetDescriptionEn"
  | "methodology" | "insights" | "repositoryUrl" | "sourceUrl"
  | "dashboardDataset" | "dashboardSchema" | "dashboardRows" | "dashboardConfig"
  | "dashboardDatasetId" | "dashboardFields" | "dashboardContent"
  | "rightsReview" | "rightsSource" | "rightsDashboard" | "rightsExplorer" | "rightsDictionary" | "rightsIdentifiers";

export interface PublishingIssue {
  code: PublishingIssueCode;
  area: PublishingArea;
}

export interface PublishingQualityResult {
  ready: boolean;
  issues: PublishingIssue[];
  warnings?: PublishingIssue[];
  featuredDraftWarning: boolean;
  totalRequirements?: number;
}

export interface PublishingQualityInput {
  project: AdminProjectInput;
  previouslyPublished?: boolean;
  imagePath: string | null;
  detail: ProjectDetail | null;
  dataset: AdminDatasetDraft | null;
  datasetCount: number;
  config: DashboardConfig | null;
}

const filled = (value: string | undefined) => Boolean(value?.trim());
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function evaluatePublishingQuality({project, previouslyPublished = false, imagePath, detail, dataset, datasetCount, config}: PublishingQualityInput): PublishingQualityResult {
  const issues: PublishingIssue[] = [];
  const warnings: PublishingIssue[] = [];
  let totalRequirements = 0;
  const add = (code: PublishingIssueCode, area: PublishingArea) => issues.push({code, area});
  const check = (valid: boolean, code: PublishingIssueCode, area: PublishingArea) => {
    totalRequirements += 1;
    if (!valid) add(code, area);
  };

  check(filled(project.title.it), "titleIt", "metadata");
  check(filled(project.title.en), "titleEn", "metadata");
  check(filled(project.description.it), "descriptionIt", "metadata");
  check(filled(project.description.en), "descriptionEn", "metadata");
  check(slugPattern.test(project.slug), "slug", "metadata");
  check(filled(project.category), "category", "metadata");
  check(isProjectCoverStoragePath(imagePath, project.id), "cover", "cover");
  if (project.repositoryUrl) check(isSafeExternalUrl(project.repositoryUrl), "repositoryUrl", "metadata");

  check(Boolean(detail), "caseStudy", "case-study");
  if (detail) {
    check(filled(detail.context.it), "contextIt", "case-study");
    check(filled(detail.context.en), "contextEn", "case-study");
    check(filled(detail.objective.it), "objectiveIt", "case-study");
    check(filled(detail.objective.en), "objectiveEn", "case-study");
    check(filled(detail.dataset.name), "datasetName", "case-study");
    check(filled(detail.dataset.source.it), "datasetSourceIt", "case-study");
    check(filled(detail.dataset.source.en), "datasetSourceEn", "case-study");
    check(filled(detail.dataset.description.it), "datasetDescriptionIt", "case-study");
    check(filled(detail.dataset.description.en), "datasetDescriptionEn", "case-study");
    if (detail.dataset.sourceUrl) check(isSafeExternalUrl(detail.dataset.sourceUrl), "sourceUrl", "case-study");
    check(Boolean(detail.methodology.length && detail.methodology.every((step) => filled(step.title.it) && filled(step.title.en) && filled(step.description.it) && filled(step.description.en))), "methodology", "case-study");
    check(Boolean(detail.insights.length && detail.insights.every((insight) => filled(insight.description.it) && filled(insight.description.en) && (!insight.title || (filled(insight.title.it) && filled(insight.title.en))))), "insights", "case-study");
  }

  if (project.dashboardAvailable) {
    if (datasetCount !== 1 || (dataset && (dataset.source !== "database" || dataset.projectId !== project.id))) {
      check(false, "dashboardDataset", "dataset");
    } else if (!dataset) {
      check(true, "dashboardDataset", "dataset");
      check(false, "dashboardSchema", "dataset");
    } else {
      check(true, "dashboardDataset", "dataset");
      const names = dataset.columns.map((column) => column.name);
      check(Boolean(names.length && !names.some((name) => !filled(name)) && new Set(names.map(normalizeDatasetFieldName)).size === names.length), "dashboardSchema", "dataset");
      check(dataset.records.some((record) => names.some((name) => {
        const field = resolveDatasetFieldName(name, Object.keys(record));
        return field !== null && record[field] != null;
      })), "dashboardRows", "dataset");
    }
    if (!config) {
      check(false, "dashboardConfig", "dashboard");
    } else if (dataset) {
      check(true, "dashboardConfig", "dashboard");
      check(config.datasetId === dataset.id || config.datasetId === project.slug, "dashboardDatasetId", "dashboard");
      check(validateDashboardConfig(config, dataset.fields).length === 0 && dataset.fields.length > 0, "dashboardFields", "dashboard");
      check(config.kpis.length + config.charts.length + config.rankings.length > 0, "dashboardContent", "dashboard");
    } else {
      check(true, "dashboardConfig", "dashboard");
    }
  }

  if (dataset) {
    const reviewed = isReviewedRights(dataset.rights);
    const legacy = dataset.rightsLegacy && previouslyPublished && project.status === "published";
    const anyPublicMode = project.dashboardAvailable || dataset.explorerEnabled || dataset.csvExportEnabled;
    if (anyPublicMode && !reviewed) {
      if (legacy) warnings.push({code: "rightsReview", area: "rights"});
      else check(false, "rightsReview", "rights");
    } else if (anyPublicMode) {
      check(true, "rightsReview", "rights");
    }
    if (anyPublicMode && !dataset.rights.sourceUrl) {
      if (legacy) warnings.push({code: "rightsSource", area: "rights"});
      else check(false, "rightsSource", "rights");
    }
    if (project.dashboardAvailable) {
      const referenced = config ? dashboardReferencedFields(config) : [];
      check(dataset.dashboardPublicEnabled && validFieldAllowlist(dataset.dashboardFields, dataset.columns)
        && referenced.every((field) => dataset.dashboardFields.includes(field)), "rightsDashboard", "rights");
    }
    if (dataset.explorerEnabled) {
      check(validFieldAllowlist(dataset.explorerFields, dataset.columns) && dataset.explorerFields.length > 0,
        "rightsExplorer", "rights");
      const complete = dataset.explorerFields.every((field) => {
        const entry = dataset.dictionary[field];
        return entry?.label.it.trim() && entry.label.en.trim() && entry.description.it.trim() && entry.description.en.trim();
      });
      if (!complete) {
        if (legacy) warnings.push({code: "rightsDictionary", area: "rights"});
        else check(false, "rightsDictionary", "rights");
      } else check(true, "rightsDictionary", "rights");
    }
    const identifying = potentiallyIdentifyingFields(dataset.columns)
      .filter((field) => dataset.explorerFields.includes(field) || dataset.dashboardFields.includes(field));
    if (identifying.length > 0) {
      if (legacy || dataset.rights.reviewNotes) warnings.push({code: "rightsIdentifiers", area: "rights"});
      else check(false, "rightsIdentifiers", "rights");
    }
  }

  return {ready: issues.length === 0, issues, warnings, featuredDraftWarning: project.status === "draft" && project.featured, totalRequirements};
}
