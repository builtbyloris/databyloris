export {
  DEFAULT_PROJECT_IMAGE,
  PROJECT_COVER_ALLOWED_MIME_TYPES,
  PROJECT_COVER_MAX_FILE_BYTES,
  PROJECT_MEDIA_BUCKET,
} from "./constants";

import {
  DEFAULT_PROJECT_IMAGE,
  PROJECT_COVER_ALLOWED_MIME_TYPES,
} from "./constants";

export function getProjectImageUrl(imagePath: string | null | undefined) {
  if (!imagePath) return DEFAULT_PROJECT_IMAGE;
  if (imagePath.startsWith("/")) return imagePath;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return DEFAULT_PROJECT_IMAGE;

  try {
    const encodedPath = imagePath.split("/").map(encodeURIComponent).join("/");
    return new URL(`/storage/v1/object/public/project-media/${encodedPath}`, supabaseUrl).toString();
  } catch {
    return DEFAULT_PROJECT_IMAGE;
  }
}

export function sanitizeProjectMediaFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function isAllowedProjectCoverMimeType(value: string) {
  return (PROJECT_COVER_ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

export function isProjectCoverStoragePath(value: unknown, projectId: string): value is string {
  if (typeof value !== "string") return false;
  const prefix = `projects/${projectId}/cover/`;
  if (!value.startsWith(prefix) || value.includes("..")) return false;
  const filename = value.slice(prefix.length);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-.+\.(?:jpe?g|png|webp|avif)$/i.test(filename);
}
