import "server-only";

import {
  projectInputToInsert,
  projectInputToUpdate,
  projectRowToDomain,
  projectRowToProject,
} from "@/lib/mappers/project-mapper";
import {projectDetailRowToDomain, projectDetailToUpsert} from "@/lib/mappers/project-detail-mapper";
import {createClient} from "@/lib/supabase/server";
import type {AdminProjectInput, AdminProjectRecord, Project, ProjectDetail} from "@/types";
import {RepositoryError} from "./repository-error";

type SupportedLocale = "it" | "en";

function mapDatabaseError(error: {code?: string}): RepositoryError {
  return new RepositoryError(error.code === "23505" ? "duplicate_slug" : "database");
}

function mapProject(row: Parameters<typeof projectRowToDomain>[0], locale: SupportedLocale) {
  try {
    return projectRowToDomain(row, locale);
  } catch {
    throw new RepositoryError("invalid_data");
  }
}

function mapPublicProject(row: Parameters<typeof projectRowToProject>[0], locale: SupportedLocale) {
  try {
    return projectRowToProject(row, locale);
  } catch {
    throw new RepositoryError("invalid_data");
  }
}

function mapProjectDetail(row: Parameters<typeof projectDetailRowToDomain>[0]) {
  try {
    return projectDetailRowToDomain(row);
  } catch {
    throw new RepositoryError("invalid_data");
  }
}

export interface PublishedProjectWithDetail {
  project: Project;
  detail: ProjectDetail | null;
}

export async function listPublishedProjects(locale: SupportedLocale): Promise<Project[]> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("published_at", {ascending: false, nullsFirst: false});

  if (error) throw mapDatabaseError(error);
  return data.map((row) => mapPublicProject(row, locale));
}

export async function getPublishedProjectBySlug(
  slug: string,
  locale: SupportedLocale,
): Promise<Project | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  return data ? mapPublicProject(data, locale) : null;
}

export async function getPublishedProjectWithDetailBySlug(
  slug: string,
  locale: SupportedLocale,
): Promise<PublishedProjectWithDetail | null> {
  const project = await getPublishedProjectBySlug(slug, locale);
  if (!project) return null;

  const supabase = await createClient();
  const {data: detailRow, error: detailError} = await supabase
    .from("project_details")
    .select("*")
    .eq("project_id", project.id)
    .maybeSingle();

  if (detailError) throw mapDatabaseError(detailError);

  return {
    project,
    detail: detailRow ? mapProjectDetail(detailRow) : null,
  };
}

export async function getAdminProjectDetail(projectId: string): Promise<ProjectDetail | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("project_details")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  return data ? mapProjectDetail(data) : null;
}

export async function upsertProjectDetail(
  projectId: string,
  detail: ProjectDetail,
): Promise<ProjectDetail> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("project_details")
    .upsert(projectDetailToUpsert(projectId, detail), {onConflict: "project_id"})
    .select("*")
    .single();

  if (error) throw mapDatabaseError(error);
  return mapProjectDetail(data);
}

export async function listAdminProjects(locale: SupportedLocale): Promise<AdminProjectRecord[]> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .select("*")
    .order("published_at", {ascending: false, nullsFirst: false})
    .order("created_at", {ascending: true});

  if (error) throw mapDatabaseError(error);
  return data.map((row) => mapProject(row, locale));
}

export async function getAdminProjectById(
  projectId: string,
  locale: SupportedLocale,
): Promise<AdminProjectRecord | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  return data ? mapProject(data, locale) : null;
}

export async function createProject(
  input: Omit<AdminProjectInput, "id">,
  locale: SupportedLocale,
): Promise<AdminProjectRecord> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .insert(projectInputToInsert(input))
    .select("*")
    .single();

  if (error) throw mapDatabaseError(error);
  return mapProject(data, locale);
}

export async function updateProject(
  input: AdminProjectInput,
  locale: SupportedLocale,
): Promise<AdminProjectRecord> {
  const supabase = await createClient();
  const current = await getAdminProjectById(input.id, locale);
  if (!current) throw new RepositoryError("not_found");

  const {data, error} = await supabase
    .from("projects")
    .update(projectInputToUpdate(input, current.project.publishedAt))
    .eq("id", input.id)
    .select("*")
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  if (!data) throw new RepositoryError("not_found");
  return mapProject(data, locale);
}

export async function updateProjectStatus(
  projectId: string,
  status: "draft" | "published",
  locale: SupportedLocale,
): Promise<AdminProjectRecord> {
  const supabase = await createClient();
  const current = await getAdminProjectById(projectId, locale);
  if (!current) throw new RepositoryError("not_found");

  const {data, error} = await supabase
    .from("projects")
    .update({
      status,
      published_at: status === "published" ? current.project.publishedAt ?? new Date().toISOString() : null,
    })
    .eq("id", projectId)
    .select("*")
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  if (!data) throw new RepositoryError("not_found");
  return mapProject(data, locale);
}

export async function updateProjectImagePath(
  projectId: string,
  imagePath: string | null,
  locale: SupportedLocale,
): Promise<AdminProjectRecord> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("projects")
    .update({image_path: imagePath})
    .eq("id", projectId)
    .select("*")
    .maybeSingle();

  if (error) throw mapDatabaseError(error);
  if (!data) throw new RepositoryError("not_found");
  return mapProject(data, locale);
}
