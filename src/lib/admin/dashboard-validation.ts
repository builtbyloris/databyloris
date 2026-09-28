import type {
  AdminValidationIssue,
  AggregationType,
  ChartSort,
  ChartType,
  DashboardConfig,
  FilterType,
  KPIFormat,
  ProjectDraft,
} from "@/types";

const aggregations: AggregationType[] = ["sum", "count", "distinctCount", "average"];
const chartTypes: ChartType[] = ["line", "bar", "pie", "donut"];
const chartSorts: ChartSort[] = ["category-asc", "category-desc", "value-asc", "value-desc"];
const filterTypes: FilterType[] = ["select", "multi-select"];
const formats: KPIFormat[] = ["number", "sales", "currency", "percentage", "duration"];

const required = (value: string | undefined, path: string, issues: AdminValidationIssue[]) => {
  if (!value?.trim()) issues.push({path, code: "required"});
};

const supported = <T extends string>(value: T, values: T[], path: string, issues: AdminValidationIssue[]) => {
  if (!values.includes(value)) issues.push({path, code: "unsupportedValue"});
};

const field = (value: string | undefined, path: string, fields: string[], issues: AdminValidationIssue[], optional = false) => {
  if (!value?.trim()) {
    if (!optional) issues.push({path, code: "fieldRequired"});
    return;
  }
  if (fields.length > 0 && !fields.includes(value)) issues.push({path, code: "unknownField"});
};

function duplicateIds(items: {id: string}[], path: string, issues: AdminValidationIssue[]) {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) issues.push({path: `${path}.${index}.id`, code: "duplicateId"});
    seen.add(item.id);
  });
}

export function validateDashboardConfig(config: DashboardConfig, fields: string[]): AdminValidationIssue[] {
  const issues: AdminValidationIssue[] = [];
  required(config.id, "dashboard.id", issues);
  required(config.datasetId, "dashboard.datasetId", issues);
  duplicateIds(config.filters, "filters", issues);
  duplicateIds(config.kpis, "kpis", issues);
  duplicateIds(config.charts, "charts", issues);
  duplicateIds(config.rankings, "rankings", issues);

  config.filters.forEach((item, index) => {
    required(item.id, `filters.${index}.id`, issues);
    required(item.label, `filters.${index}.label`, issues);
    field(item.field, `filters.${index}.field`, fields, issues);
    supported(item.type, filterTypes, `filters.${index}.type`, issues);
  });
  config.kpis.forEach((item, index) => {
    required(item.id, `kpis.${index}.id`, issues);
    required(item.label, `kpis.${index}.label`, issues);
    supported(item.aggregation, aggregations, `kpis.${index}.aggregation`, issues);
    field(item.field, `kpis.${index}.field`, fields, issues, item.aggregation === "count");
    supported(item.format, formats, `kpis.${index}.format`, issues);
  });
  config.charts.forEach((item, index) => {
    required(item.id, `charts.${index}.id`, issues);
    required(item.title, `charts.${index}.title`, issues);
    supported(item.type, chartTypes, `charts.${index}.type`, issues);
    field(item.categoryField, `charts.${index}.categoryField`, fields, issues);
    supported(item.aggregation, aggregations, `charts.${index}.aggregation`, issues);
    field(item.valueField, `charts.${index}.valueField`, fields, issues, item.aggregation === "count");
    if (item.sort) supported(item.sort, chartSorts, `charts.${index}.sort`, issues);
    if (item.valueFormat) supported(item.valueFormat, formats, `charts.${index}.valueFormat`, issues);
    if (item.limit !== undefined && item.limit < 1) issues.push({path: `charts.${index}.limit`, code: "positiveLimit"});
  });
  config.rankings.forEach((item, index) => {
    required(item.id, `rankings.${index}.id`, issues);
    required(item.title, `rankings.${index}.title`, issues);
    required(item.dimensionLabel, `rankings.${index}.dimensionLabel`, issues);
    required(item.metricLabel, `rankings.${index}.metricLabel`, issues);
    field(item.dimension, `rankings.${index}.dimension`, fields, issues);
    field(item.metric, `rankings.${index}.metric`, fields, issues, item.aggregation === "count");
    supported(item.aggregation, aggregations, `rankings.${index}.aggregation`, issues);
    item.detailColumns.forEach((column, columnIndex) => {
      required(column.label, `rankings.${index}.detailColumns.${columnIndex}.label`, issues);
      field(column.field, `rankings.${index}.detailColumns.${columnIndex}.field`, fields, issues);
    });
    if (item.limit < 1) issues.push({path: `rankings.${index}.limit`, code: "positiveLimit"});
  });
  return issues;
}

export function validateProjectDraft(draft: ProjectDraft, allDrafts: ProjectDraft[]): AdminValidationIssue[] {
  const issues: AdminValidationIssue[] = [];
  required(draft.localizedTitle.it, "project.title.it", issues);
  required(draft.localizedTitle.en, "project.title.en", issues);
  required(draft.project.slug, "project.slug", issues);
  required(draft.project.category, "project.category", issues);
  if (draft.project.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.project.slug)) {
    issues.push({path: "project.slug", code: "invalidSlug"});
  }
  if (allDrafts.some((item) => item.project.id !== draft.project.id && item.project.slug === draft.project.slug)) {
    issues.push({path: "project.slug", code: "duplicateSlug"});
  }
  return issues;
}
