import type {AdminProjectInput, LocalizedText} from "@/types";
import {isSafeExternalUrl} from "@/lib/urls";

function isLocalizedText(value: unknown): value is LocalizedText {
  if (!value || typeof value !== "object") return false;
  const localized = value as Record<string, unknown>;
  return typeof localized.it === "string" && typeof localized.en === "string";
}

export function isValidAdminProjectInput(value: unknown): value is AdminProjectInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;

  return (
    typeof input.id === "string"
    && typeof input.slug === "string"
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)
    && isLocalizedText(input.title)
    && input.title.it.trim().length > 0
    && input.title.en.trim().length > 0
    && isLocalizedText(input.description)
    && typeof input.category === "string"
    && input.category.trim().length > 0
    && Array.isArray(input.technologies)
    && input.technologies.every((item) => typeof item === "string")
    && typeof input.featured === "boolean"
    && (input.status === "draft" || input.status === "published")
    && typeof input.dashboardAvailable === "boolean"
    && (input.repositoryUrl === undefined || isSafeExternalUrl(input.repositoryUrl))
  );
}
