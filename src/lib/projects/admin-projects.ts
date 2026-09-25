import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getAdminAccess } from "@/lib/auth/admin";
import { removeDeletedProjectCover } from "@/lib/projects/project-covers";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminProjectCounts,
  ProjectDatabaseRow,
  ProjectWriteInput,
} from "@/types/project-database";

export class AdminProjectError extends Error {
  constructor(
    message: string,
    public readonly code: "unauthorized" | "duplicate_slug" | "database",
  ) {
    super(message);
    this.name = "AdminProjectError";
  }
}

async function getAuthorizedClient(): Promise<{
  supabase: SupabaseClient;
  userId: string;
}> {
  const access = await getAdminAccess();

  if (access.status !== "authenticated") {
    throw new AdminProjectError("Admin authorization is required.", "unauthorized");
  }

  return { supabase: await createClient(), userId: access.user.id };
}

function throwDatabaseError(error: { code?: string; message: string }): never {
  if (error.code === "23505") {
    throw new AdminProjectError(
      "A project with this slug already exists.",
      "duplicate_slug",
    );
  }

  throw new AdminProjectError("The project database request failed.", "database");
}

export async function listAdminProjects() {
  const { supabase } = await getAuthorizedClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throwDatabaseError(error);
  return (data ?? []) as ProjectDatabaseRow[];
}

export async function getAdminProjectById(id: string) {
  const { supabase } = await getAuthorizedClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throwDatabaseError(error);
  return data as ProjectDatabaseRow | null;
}

export async function getAdminProjectCounts(): Promise<AdminProjectCounts> {
  const { supabase } = await getAuthorizedClient();
  const [all, published, drafts] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  const error = all.error ?? published.error ?? drafts.error;
  if (error) throwDatabaseError(error);

  return {
    projects: all.count ?? 0,
    published: published.count ?? 0,
    drafts: drafts.count ?? 0,
  };
}

export async function createAdminProject(input: ProjectWriteInput) {
  const { supabase, userId } = await getAuthorizedClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...input,
      created_by: userId,
      published_at:
        input.status === "published" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error) throwDatabaseError(error);
  return data as ProjectDatabaseRow;
}

export async function updateAdminProject(
  id: string,
  input: ProjectWriteInput,
) {
  const { supabase } = await getAuthorizedClient();
  const existing = await getAdminProjectById(id);

  if (!existing) {
    throw new AdminProjectError("Project not found.", "database");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      ...input,
      published_at:
        input.status === "published" && !existing.published_at
          ? new Date().toISOString()
          : existing.published_at,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throwDatabaseError(error);
  return data as ProjectDatabaseRow;
}

export async function deleteAdminProject(id: string) {
  const { supabase } = await getAuthorizedClient();
  const existing = await getAdminProjectById(id);

  if (!existing) {
    throw new AdminProjectError("Project not found.", "database");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throwDatabaseError(error);

  if (!existing.cover_path) return { coverCleanupFailed: false };

  // The database row is removed first so a Storage failure cannot leave a
  // public project pointing at a missing image. Failed cleanup is surfaced to
  // Admin and can only leave an unreachable orphaned object.
  try {
    await removeDeletedProjectCover(existing.id, existing.cover_path);
    return { coverCleanupFailed: false };
  } catch {
    return { coverCleanupFailed: true };
  }
}

export async function publishAdminProject(id: string) {
  const existing = await getAdminProjectById(id);
  if (!existing) throw new AdminProjectError("Project not found.", "database");

  return updateAdminProject(id, { ...toWriteInput(existing), status: "published" });
}

export async function moveAdminProjectToDraft(id: string) {
  const existing = await getAdminProjectById(id);
  if (!existing) throw new AdminProjectError("Project not found.", "database");

  return updateAdminProject(id, { ...toWriteInput(existing), status: "draft" });
}

function toWriteInput(project: ProjectDatabaseRow): ProjectWriteInput {
  return {
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    category: project.category,
    question: project.question,
    period: project.period,
    tags: project.tags,
    featured: project.featured,
    demo: project.demo,
    status: project.status,
    dataset_records: project.dataset_records,
    dataset_grain: project.dataset_grain,
    dataset_source: project.dataset_source,
  };
}
