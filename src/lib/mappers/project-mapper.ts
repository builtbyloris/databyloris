import type {
  AdminProjectInput,
  AdminProjectRecord,
  LocalizedText,
  Project,
} from "@/types";
import type {Json, Tables, TablesInsert, TablesUpdate} from "@/types/database";
import {getProjectImageUrl} from "@/lib/project-media";

type ProjectRow = Tables<"projects">;

function isRecord(value: Json): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLocalizedText(value: Json): LocalizedText | null {
  if (!isRecord(value) || typeof value.it !== "string" || typeof value.en !== "string") {
    return null;
  }
  return {it: value.it, en: value.en};
}

function parseTechnologies(value: Json): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  return value;
}

function localizedJson(value: LocalizedText): Json {
  return {it: value.it, en: value.en};
}

export function projectRowToDomain(
  row: ProjectRow,
  locale: "it" | "en",
): AdminProjectRecord {
  const title = parseLocalizedText(row.title);
  const description = parseLocalizedText(row.description);
  const technologies = parseTechnologies(row.technologies);

  if (!title || !description || !technologies || (row.status !== "draft" && row.status !== "published")) {
    throw new Error("Invalid project database record");
  }

  return {
    project: {
      id: row.id,
      slug: row.slug,
      title: title[locale],
      description: description[locale],
      category: row.category,
      technologies,
      image: getProjectImageUrl(row.image_path),
      featured: row.featured,
      status: row.status,
      publishedAt: row.published_at,
      repositoryUrl: row.repository_url ?? undefined,
      dashboardAvailable: row.dashboard_available,
    },
    localizedTitle: title,
    localizedDescription: description,
    imagePath: row.image_path,
  };
}

export function projectRowToProject(row: ProjectRow, locale: "it" | "en"): Project {
  return projectRowToDomain(row, locale).project;
}

export function projectInputToInsert(
  input: Omit<AdminProjectInput, "id">,
): TablesInsert<"projects"> {
  return {
    slug: input.slug,
    title: localizedJson(input.title),
    description: localizedJson(input.description),
    category: input.category,
    technologies: input.technologies,
    image_path: null,
    featured: input.featured,
    status: input.status,
    published_at: input.status === "published" ? new Date().toISOString() : null,
    repository_url: input.repositoryUrl ?? null,
    dashboard_available: input.dashboardAvailable,
  };
}

export function projectInputToUpdate(
  input: AdminProjectInput,
  currentPublishedAt: string | null,
): TablesUpdate<"projects"> {
  return {
    slug: input.slug,
    title: localizedJson(input.title),
    description: localizedJson(input.description),
    category: input.category,
    technologies: input.technologies,
    featured: input.featured,
    status: input.status,
    published_at: input.status === "published" ? currentPublishedAt ?? new Date().toISOString() : null,
    repository_url: input.repositoryUrl ?? null,
    dashboard_available: input.dashboardAvailable,
  };
}
