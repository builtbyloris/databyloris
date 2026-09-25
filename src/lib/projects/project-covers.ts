import "server-only";

import { randomUUID } from "node:crypto";

import { getAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { ProjectDatabaseRow } from "@/types/project-database";

export const PROJECT_COVERS_BUCKET = "project-covers";
export const PROJECT_COVER_MAX_BYTES = 5 * 1024 * 1024;

const PROJECT_COVER_PATH =
  /^projects\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/cover-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/;

const allowedCoverTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export class ProjectCoverError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "invalid_file"
      | "unauthorized"
      | "not_found"
      | "storage"
      | "database",
  ) {
    super(message);
    this.name = "ProjectCoverError";
  }
}

export interface ProjectCoverMutationResult {
  project: ProjectDatabaseRow;
  cleanupWarning: boolean;
}

async function getAuthorizedClient() {
  const access = await getAdminAccess();

  if (access.status !== "authenticated") {
    throw new ProjectCoverError(
      "Admin authorization is required.",
      "unauthorized",
    );
  }

  return createClient();
}

function isProjectCoverPath(path: string, projectId?: string) {
  const match = PROJECT_COVER_PATH.exec(path);
  return Boolean(match && (!projectId || match[1] === projectId));
}

function validateCover(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    throw new ProjectCoverError("Choose an image to upload.", "invalid_file");
  }

  const extension = allowedCoverTypes[file.type as keyof typeof allowedCoverTypes];

  if (!extension) {
    throw new ProjectCoverError(
      "Use a JPEG, PNG, or WebP image.",
      "invalid_file",
    );
  }

  if (file.size > PROJECT_COVER_MAX_BYTES) {
    throw new ProjectCoverError(
      "The cover must be 5 MB or smaller.",
      "invalid_file",
    );
  }

  return { extension, file };
}

function hasExpectedSignature(mimeType: string, bytes: Uint8Array) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value,
    );
  }

  if (mimeType === "image/webp") {
    const signature = String.fromCharCode(...bytes.slice(0, 4));
    const format = String.fromCharCode(...bytes.slice(8, 12));
    return signature === "RIFF" && format === "WEBP";
  }

  return false;
}

async function getProject(supabase: Awaited<ReturnType<typeof createClient>>, id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new ProjectCoverError("The project could not be loaded.", "database");
  }

  if (!data) {
    throw new ProjectCoverError("Project not found.", "not_found");
  }

  return data as ProjectDatabaseRow;
}

async function deleteCoverObject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  path: string,
) {
  if (!isProjectCoverPath(path, projectId)) {
    throw new ProjectCoverError("The stored cover path is invalid.", "storage");
  }

  const { error } = await supabase.storage
    .from(PROJECT_COVERS_BUCKET)
    .remove([path]);

  if (error) {
    throw new ProjectCoverError("The cover object could not be removed.", "storage");
  }
}

export function getProjectCoverPublicUrl(path: string | null) {
  const config = getSupabasePublicConfig();

  if (!path || !config || !isProjectCoverPath(path)) return null;

  const baseUrl = config.url.replace(/\/+$/, "");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/public/${PROJECT_COVERS_BUCKET}/${encodedPath}`;
}

export async function uploadProjectCover(
  projectId: string,
  fileValue: FormDataEntryValue | null,
): Promise<ProjectCoverMutationResult> {
  const { extension, file } = validateCover(fileValue);
  const supabase = await getAuthorizedClient();
  const project = await getProject(supabase, projectId);
  const path = `projects/${project.id}/cover-${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!hasExpectedSignature(file.type, bytes)) {
    throw new ProjectCoverError(
      "The selected file does not match its image type.",
      "invalid_file",
    );
  }

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_COVERS_BUCKET)
    .upload(path, bytes, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new ProjectCoverError("The cover could not be uploaded.", "storage");
  }

  const { data, error: updateError } = await supabase
    .from("projects")
    .update({ cover_path: path })
    .eq("id", project.id)
    .select("*")
    .single();

  if (updateError) {
    await supabase.storage.from(PROJECT_COVERS_BUCKET).remove([path]);
    throw new ProjectCoverError("The cover could not be saved.", "database");
  }

  let cleanupWarning = false;

  if (project.cover_path && project.cover_path !== path) {
    try {
      await deleteCoverObject(supabase, project.id, project.cover_path);
    } catch {
      cleanupWarning = true;
    }
  }

  return { project: data as ProjectDatabaseRow, cleanupWarning };
}

export async function removeProjectCover(
  projectId: string,
): Promise<ProjectCoverMutationResult> {
  const supabase = await getAuthorizedClient();
  const project = await getProject(supabase, projectId);

  if (!project.cover_path) {
    return { project, cleanupWarning: false };
  }

  // Clear public metadata first. A failed Storage cleanup can leave an inert
  // orphan, but never a published record pointing at a missing object.
  const { data, error } = await supabase
    .from("projects")
    .update({ cover_path: null })
    .eq("id", project.id)
    .select("*")
    .single();

  if (error) {
    throw new ProjectCoverError("The cover could not be removed.", "database");
  }

  let cleanupWarning = false;

  try {
    await deleteCoverObject(supabase, project.id, project.cover_path);
  } catch {
    cleanupWarning = true;
  }

  return { project: data as ProjectDatabaseRow, cleanupWarning };
}

export async function removeDeletedProjectCover(
  projectId: string,
  path: string,
) {
  const supabase = await getAuthorizedClient();
  await deleteCoverObject(supabase, projectId, path);
}
