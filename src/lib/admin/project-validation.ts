import type {AdminProjectInput, LocalizedText} from "@/types";

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object") return false;
  const localized = value as Record<string, unknown>;
  return typeof localized.it === "string" && typeof localized.en === "string";
}

export function isProjectQualityCandidate(value: unknown): value is AdminProjectInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;

  return (
    typeof input.id === "string"
    && typeof input.slug === "string"
    && isLocalizedText(input.title)
    && isLocalizedText(input.description)
    && typeof input.category === "string"
    && Array.isArray(input.technologies)
    && input.technologies.every((item) => typeof item === "string")
    && typeof input.featured === "boolean"
    && (input.status === "draft" || input.status === "published")
    && typeof input.dashboardAvailable === "boolean"
    && (input.repositoryUrl === undefined || typeof input.repositoryUrl === "string")
  );
}

export function isValidAdminProjectInput(value: unknown): value is AdminProjectInput {
  return isProjectQualityCandidate(value)
    && (value.status === "published" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug));
}
