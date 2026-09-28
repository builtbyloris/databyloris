import type {LocalizedText, ProjectDetail} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && typeof value.it === "string" && typeof value.en === "string";
}

function isOptionalUrl(value: unknown) {
  if (value === undefined) return true;
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidProjectId(value: unknown): value is string {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function isValidProjectDetail(value: unknown): value is ProjectDetail {
  if (!isRecord(value) || !isLocalizedText(value.context) || !isLocalizedText(value.objective)) return false;
  if (!Array.isArray(value.methodology) || !Array.isArray(value.insights) || !isRecord(value.dataset)) return false;
  if (value.updatedAt !== undefined && typeof value.updatedAt !== "string") return false;

  const dataset = value.dataset;
  if (
    typeof dataset.name !== "string"
    || !isLocalizedText(dataset.source)
    || !isLocalizedText(dataset.description)
    || (dataset.period !== undefined && !isLocalizedText(dataset.period))
    || !isOptionalUrl(dataset.sourceUrl)
    || (dataset.records !== undefined
      && (typeof dataset.records !== "number" || !Number.isInteger(dataset.records) || dataset.records < 0))
  ) {
    return false;
  }

  const methodologyValid = value.methodology.every((step) => isRecord(step)
    && typeof step.id === "string"
    && step.id.trim().length > 0
    && isLocalizedText(step.title)
    && isLocalizedText(step.description));

  const insightsValid = value.insights.every((insight) => isRecord(insight)
    && typeof insight.id === "string"
    && insight.id.trim().length > 0
    && (insight.title === undefined || isLocalizedText(insight.title))
    && isLocalizedText(insight.description));

  const methodologyIds = value.methodology.map((step) => isRecord(step) ? step.id : undefined);
  const insightIds = value.insights.map((insight) => isRecord(insight) ? insight.id : undefined);

  return methodologyValid
    && insightsValid
    && new Set(methodologyIds).size === methodologyIds.length
    && new Set(insightIds).size === insightIds.length;
}
