"use server";

import {revalidatePath} from "next/cache";
import {dashboardRegistry} from "@/data/dashboards/registry";
import type {AppLocale} from "@/i18n/routing";
import {isValidAdminProjectInput, validateDashboardConfig} from "@/lib/admin";
import {requireAdmin} from "@/lib/auth/require-admin";
import {
  dashboardConfigFromJson,
  dashboardConfigToJson,
} from "@/lib/mappers/dashboard-config-mapper";
import {upsertDashboardConfig} from "@/lib/repositories/dashboard-configs-repository";
import {
  createProject,
  getAdminProjectById,
  updateProject,
  updateProjectStatus,
} from "@/lib/repositories/projects-repository";
import {RepositoryError} from "@/lib/repositories/repository-error";
import type {
  AdminActionError,
  AdminActionResult,
  AdminProjectInput,
  AdminProjectRecord,
  DashboardConfig,
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

function dashboardFields(slug: string) {
  const data = dashboardRegistry[slug]?.data ?? [];
  return Array.from(new Set(data.flatMap((record) => Object.keys(record))));
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

    const issues = validateDashboardConfig(normalizedConfig, dashboardFields(project.project.slug));
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
