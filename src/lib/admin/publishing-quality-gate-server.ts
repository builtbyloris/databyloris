import "server-only";

import type {AdminProjectInput, AdminProjectRecord, DashboardConfig, ProjectDetail} from "@/types";
import {getDashboardConfig} from "@/lib/repositories/dashboard-configs-repository";
import {getAdminProjectDataset, listProjectDatasets} from "@/lib/repositories/datasets-repository";
import {getAdminProjectById, getAdminProjectDetail} from "@/lib/repositories/projects-repository";
import {RepositoryError} from "@/lib/repositories/repository-error";
import {evaluatePublishingQuality, type PublishingQualityResult} from "./publishing-quality-gate";

type Locale = "it" | "en";

export function projectInputFromRecord(record: AdminProjectRecord): AdminProjectInput {
  return {
    id: record.project.id,
    slug: record.project.slug,
    title: record.localizedTitle,
    description: record.localizedDescription,
    category: record.project.category,
    technologies: record.project.technologies,
    featured: record.project.featured,
    status: record.project.status === "published" ? "published" : "draft",
    dashboardAvailable: Boolean(record.project.dashboardAvailable),
    repositoryUrl: record.project.repositoryUrl,
  };
}

async function orNullOnInvalid<T>(read: () => Promise<T>): Promise<T | null> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof RepositoryError && error.code === "invalid_data") return null;
    throw error;
  }
}

export async function getPublishingQuality(projectId: string, locale: Locale, proposed?: {
  project?: AdminProjectInput;
  imagePath?: string | null;
  detail?: ProjectDetail | null;
  config?: DashboardConfig | null;
}): Promise<PublishingQualityResult | null> {
  const record = await getAdminProjectById(projectId, locale);
  if (!record) return null;
  const project = proposed?.project ?? projectInputFromRecord(record);
  const [detail, datasets, dataset, config] = await Promise.all([
    proposed && "detail" in proposed ? Promise.resolve(proposed.detail ?? null) : orNullOnInvalid(() => getAdminProjectDetail(projectId)),
    project.dashboardAvailable ? listProjectDatasets(projectId) : Promise.resolve([]),
    project.dashboardAvailable ? orNullOnInvalid(() => getAdminProjectDataset(projectId)) : Promise.resolve(null),
    project.dashboardAvailable
      ? proposed && "config" in proposed ? Promise.resolve(proposed.config ?? null) : orNullOnInvalid(() => getDashboardConfig(projectId))
      : Promise.resolve(null),
  ]);

  return evaluatePublishingQuality({
    project,
    imagePath: proposed && "imagePath" in proposed ? proposed.imagePath ?? null : record.imagePath,
    detail,
    dataset,
    datasetCount: datasets.length,
    config,
  });
}
