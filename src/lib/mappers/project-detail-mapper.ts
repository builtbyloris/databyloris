import type {
  DatasetSummary,
  LocalizedText,
  MethodologyStep,
  ProjectDetail,
  ProjectInsight,
} from "@/types";
import type {Json, Tables, TablesInsert} from "@/types/database";

type ProjectDetailRow = Tables<"project_details">;

function isRecord(value: Json): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseLocalizedText(value: Json | undefined): LocalizedText | null {
  if (!value || !isRecord(value) || typeof value.it !== "string" || typeof value.en !== "string") {
    return null;
  }

  return {it: value.it, en: value.en};
}

function parseMethodology(value: Json): MethodologyStep[] | null {
  if (!Array.isArray(value)) return null;

  const steps = value.map((item) => {
    if (!isRecord(item) || typeof item.id !== "string") return null;
    const title = parseLocalizedText(item.title);
    const description = parseLocalizedText(item.description);
    return title && description ? {id: item.id, title, description} : null;
  });

  return steps.every((step): step is MethodologyStep => step !== null) ? steps : null;
}

function parseDatasetSummary(value: Json | null): DatasetSummary | null {
  if (!value || !isRecord(value) || typeof value.name !== "string") return null;

  const source = parseLocalizedText(value.source);
  const description = parseLocalizedText(value.description);
  const period = value.period === undefined ? undefined : parseLocalizedText(value.period);
  const sourceUrl = value.sourceUrl;
  const records = value.records;

  if (
    !source
    || !description
    || (value.period !== undefined && !period)
    || (sourceUrl !== undefined && typeof sourceUrl !== "string")
    || (records !== undefined && (typeof records !== "number" || !Number.isInteger(records) || records < 0))
  ) {
    return null;
  }

  return {
    name: value.name,
    source,
    description,
    ...(period ? {period} : {}),
    ...(typeof sourceUrl === "string" ? {sourceUrl} : {}),
    ...(typeof records === "number" ? {records} : {}),
  };
}

function parseInsights(value: Json): ProjectInsight[] | null {
  if (!Array.isArray(value)) return null;

  const insights = value.map((item) => {
    if (!isRecord(item) || typeof item.id !== "string") return null;
    const description = parseLocalizedText(item.description);
    const title = item.title === undefined ? undefined : parseLocalizedText(item.title);

    if (!description || (item.title !== undefined && !title)) return null;
    return {id: item.id, description, ...(title ? {title} : {})};
  });

  return insights.every((insight): insight is ProjectInsight => insight !== null) ? insights : null;
}

export function projectDetailRowToDomain(row: ProjectDetailRow): ProjectDetail {
  const context = row.context ? parseLocalizedText(row.context) : null;
  const objective = row.objective ? parseLocalizedText(row.objective) : null;
  const methodology = parseMethodology(row.methodology);
  const dataset = parseDatasetSummary(row.dataset_summary);
  const insights = parseInsights(row.insights);

  if (!context || !objective || !methodology || !dataset || !insights) {
    throw new Error("Invalid project detail database record");
  }

  return {
    context,
    objective,
    methodology,
    dataset,
    insights,
    updatedAt: row.updated_at,
  };
}

function localizedTextToJson(value: LocalizedText): Json {
  return {it: value.it, en: value.en};
}

export function projectDetailToUpsert(
  projectId: string,
  detail: ProjectDetail,
): TablesInsert<"project_details"> {
  return {
    project_id: projectId,
    context: localizedTextToJson(detail.context),
    objective: localizedTextToJson(detail.objective),
    methodology: detail.methodology.map((step) => ({
      id: step.id,
      title: localizedTextToJson(step.title),
      description: localizedTextToJson(step.description),
    })),
    dataset_summary: {
      name: detail.dataset.name,
      source: localizedTextToJson(detail.dataset.source),
      description: localizedTextToJson(detail.dataset.description),
      ...(detail.dataset.sourceUrl ? {sourceUrl: detail.dataset.sourceUrl} : {}),
      ...(detail.dataset.records !== undefined ? {records: detail.dataset.records} : {}),
      ...(detail.dataset.period ? {period: localizedTextToJson(detail.dataset.period)} : {}),
    },
    insights: detail.insights.map((insight) => ({
      id: insight.id,
      description: localizedTextToJson(insight.description),
      ...(insight.title ? {title: localizedTextToJson(insight.title)} : {}),
    })),
  };
}
