"use server";

import {revalidatePath} from "next/cache";
import {dashboardRegistry} from "@/data/dashboards/registry";
import type {AppLocale} from "@/i18n/routing";
import {isValidAdminProjectInput, isValidProjectDetail, isValidProjectId, validateDashboardConfig} from "@/lib/admin";
import {requireAdmin} from "@/lib/auth/require-admin";
import {
  DATASET_MAX_FILE_BYTES,
  DATASET_MAX_GRAIN_LENGTH,
  DATASET_MAX_NAME_LENGTH,
  DatasetParseError,
  parseCsvDataset,
} from "@/lib/datasets";
import {
  dashboardConfigFromJson,
  dashboardConfigToJson,
} from "@/lib/mappers/dashboard-config-mapper";
import {upsertDashboardConfig} from "@/lib/repositories/dashboard-configs-repository";
import {
  createDatasetWithRows,
  deleteDataset,
  downloadDatasetFile,
  getAdminProjectDatasetFields,
  listProjectDatasets,
  removeDatasetFile,
  updateDatasetGrain,
} from "@/lib/repositories/datasets-repository";
import {
  createProject,
  getAdminProjectById,
  upsertProjectDetail,
  updateProject,
  updateProjectStatus,
} from "@/lib/repositories/projects-repository";
import {RepositoryError} from "@/lib/repositories/repository-error";
import type {
  AdminActionError,
  AdminActionResult,
  AdminDatasetDraft,
  AdminProjectInput,
  AdminProjectRecord,
  DashboardConfig,
  ProjectDetail,
  RegisterDatasetInput,
} from "@/types";

function adminRoute(locale: AppLocale) {
  return locale === "en" ? "/en/admin" : "/admin";
}

function actionError(error: unknown): AdminActionError {
  if (!(error instanceof RepositoryError)) return "unknown";
  if (error.code === "duplicate_slug") return "duplicateSlug";
  if (error.code === "not_found") return "projectNotFound";
  if (error.code === "invalid_data") return "invalidProject";
  return "databaseUnavailable";
}

async function dashboardFields(projectId: string, slug: string) {
  const fields = await getAdminProjectDatasetFields(projectId);
  if (fields) return fields;
  const data = dashboardRegistry[slug]?.data ?? [];
  return Array.from(new Set(data.flatMap((record) => Object.keys(record))));
}

function isRegisterDatasetInput(input: unknown): input is RegisterDatasetInput {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return false;
  const value = input as Record<string, unknown>;
  if (!isValidProjectId(value.projectId) || typeof value.storagePath !== "string") return false;
  const expectedPrefix = `projects/${value.projectId}/`;
  const pathParts = value.storagePath.slice(expectedPrefix.length).split("/");
  return value.storagePath.startsWith(expectedPrefix)
    && pathParts.length === 2
    && isValidProjectId(pathParts[0])
    && pathParts[1].toLowerCase().endsWith(".csv")
    && !value.storagePath.includes("..")
    && typeof value.originalFilename === "string"
    && value.originalFilename.length <= 255
    && value.originalFilename.toLowerCase().endsWith(".csv")
    && typeof value.name === "string"
    && value.name.trim().length > 0
    && value.name.trim().length <= DATASET_MAX_NAME_LENGTH
    && typeof value.grain === "string"
    && value.grain.trim().length <= DATASET_MAX_GRAIN_LENGTH
    && typeof value.replaceExisting === "boolean";
}

async function cleanupUploadedFile(storagePath: string) {
  try {
    await removeDatasetFile(storagePath);
  } catch {
    // Best effort: the Admin can retry replacement if Storage cleanup is unavailable.
  }
}

function normalizeDashboardConfig(config: DashboardConfig) {
  try {
    return dashboardConfigFromJson(dashboardConfigToJson(config));
  } catch {
    return null;
  }
}

export async function createProjectAction(
  locale: AppLocale,
): Promise<AdminActionResult<AdminProjectRecord>> {
  await requireAdmin(locale);

  const suffix = crypto.randomUUID().slice(0, 8);
  const input = {
    slug: `draft-${suffix}`,
    title: {it: "Nuovo progetto", en: "New project"},
    description: {it: "", en: ""},
    category: "Uncategorized",
    technologies: [],
    featured: false,
    status: "draft" as const,
    dashboardAvailable: false,
    repositoryUrl: undefined,
  };

  try {
    const project = await createProject(input, locale);
    revalidatePath(adminRoute(locale));
    return {ok: true, data: project};
  } catch (error) {
    return {ok: false, error: actionError(error)};
  }
}

export async function updateProjectAction(
  locale: AppLocale,
  input: AdminProjectInput,
): Promise<AdminActionResult<AdminProjectRecord>> {
  await requireAdmin(locale);
  if (!isValidAdminProjectInput(input)) return {ok: false, error: "invalidProject"};

  try {
    const project = await updateProject(input, locale);
    revalidatePath(adminRoute(locale));
    return {ok: true, data: project};
  } catch (error) {
    return {ok: false, error: actionError(error)};
  }
}

export async function updateProjectStatusAction(
  locale: AppLocale,
  projectId: string,
  status: "draft" | "published",
): Promise<AdminActionResult<AdminProjectRecord>> {
  await requireAdmin(locale);
  if (!projectId || (status !== "draft" && status !== "published")) {
    return {ok: false, error: "invalidProject"};
  }

  try {
    const project = await updateProjectStatus(projectId, status, locale);
    revalidatePath(adminRoute(locale));
    return {ok: true, data: project};
  } catch (error) {
    return {ok: false, error: actionError(error)};
  }
}

export async function saveDashboardConfigAction(
  locale: AppLocale,
  projectId: string,
  config: DashboardConfig,
): Promise<AdminActionResult<DashboardConfig>> {
  await requireAdmin(locale);

  try {
    const project = await getAdminProjectById(projectId, locale);
    if (!project) return {ok: false, error: "projectNotFound"};

    const normalizedConfig = normalizeDashboardConfig(config);
    if (!normalizedConfig) return {ok: false, error: "invalidConfig"};

    const issues = validateDashboardConfig(
      normalizedConfig,
      await dashboardFields(projectId, project.project.slug),
    );
    if (issues.length > 0) return {ok: false, error: "invalidConfig"};

    const saved = await upsertDashboardConfig(projectId, normalizedConfig);
    revalidatePath(adminRoute(locale));
    return {ok: true, data: saved};
  } catch (error) {
    if (error instanceof RepositoryError && error.code === "invalid_data") {
      return {ok: false, error: "invalidConfig"};
    }
    return {ok: false, error: actionError(error)};
  }
}

export async function registerDatasetAction(
  locale: AppLocale,
  input: unknown,
): Promise<AdminActionResult<AdminDatasetDraft>> {
  await requireAdmin(locale);
  if (!isRegisterDatasetInput(input)) return {ok: false, error: "invalidDataset"};

  try {
    const project = await getAdminProjectById(input.projectId, locale);
    if (!project) {
      await cleanupUploadedFile(input.storagePath);
      return {ok: false, error: "projectNotFound"};
    }

    const existing = await listProjectDatasets(input.projectId);
    if (existing.length > 0 && !input.replaceExisting) {
      await cleanupUploadedFile(input.storagePath);
      return {ok: false, error: "datasetExists"};
    }

    const file = await downloadDatasetFile(input.storagePath);
    if (file.size > DATASET_MAX_FILE_BYTES) {
      await cleanupUploadedFile(input.storagePath);
      return {ok: false, error: "datasetTooLarge"};
    }

    const parsed = parseCsvDataset(await file.text());
    const saved = await createDatasetWithRows({
      projectId: input.projectId,
      name: input.name.trim(),
      originalFilename: input.originalFilename,
      storagePath: input.storagePath,
      grain: input.grain.trim(),
      columns: parsed.columns,
      records: parsed.records,
    });

    try {
      for (const previous of existing) {
        await deleteDataset(previous.id);
        if (previous.storage_path && previous.storage_path !== input.storagePath) {
          await cleanupUploadedFile(previous.storage_path);
        }
      }
    } catch {
      await deleteDataset(saved.id).catch(() => undefined);
      await cleanupUploadedFile(input.storagePath);
      return {ok: false, error: "datasetProcessingFailed"};
    }

    revalidatePath(adminRoute(locale));
    return {ok: true, data: saved};
  } catch (error) {
    await cleanupUploadedFile(input.storagePath);
    if (error instanceof DatasetParseError) return {ok: false, error: error.code};
    if (error instanceof RepositoryError && error.code === "not_found") {
      return {ok: false, error: "projectNotFound"};
    }
    return {ok: false, error: error instanceof RepositoryError ? "datasetProcessingFailed" : "invalidDataset"};
  }
}

export async function updateDatasetGrainAction(
  locale: AppLocale,
  projectId: string,
  datasetId: string,
  grain: string,
): Promise<AdminActionResult<AdminDatasetDraft>> {
  await requireAdmin(locale);
  if (!isValidProjectId(projectId)
    || !isValidProjectId(datasetId)
    || typeof grain !== "string"
    || grain.trim().length > DATASET_MAX_GRAIN_LENGTH) {
    return {ok: false, error: "invalidDataset"};
  }

  try {
    const datasets = await listProjectDatasets(projectId);
    if (!datasets.some((dataset) => dataset.id === datasetId)) {
      return {ok: false, error: "projectNotFound"};
    }
    const saved = await updateDatasetGrain(datasetId, grain.trim());
    revalidatePath(adminRoute(locale));
    return {ok: true, data: saved};
  } catch {
    return {ok: false, error: "datasetProcessingFailed"};
  }
}

export async function saveProjectDetailAction(
  locale: AppLocale,
  projectId: string,
  detail: ProjectDetail,
): Promise<AdminActionResult<ProjectDetail>> {
  await requireAdmin(locale);
  if (!isValidProjectId(projectId) || !isValidProjectDetail(detail)) {
    return {ok: false, error: "invalidDetail"};
  }

  try {
    const project = await getAdminProjectById(projectId, locale);
    if (!project) return {ok: false, error: "projectNotFound"};

    const saved = await upsertProjectDetail(projectId, detail);
    revalidatePath(adminRoute(locale));
    revalidatePath(`/projects/${project.project.slug}`);
    revalidatePath(`/en/projects/${project.project.slug}`);
    return {ok: true, data: saved};
  } catch (error) {
    if (error instanceof RepositoryError && error.code === "invalid_data") {
      return {ok: false, error: "invalidDetail"};
    }
    return {ok: false, error: actionError(error)};
  }
}
