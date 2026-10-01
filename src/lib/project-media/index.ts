export {
  DEFAULT_PROJECT_IMAGE,
  PROJECT_COVER_ALLOWED_MIME_TYPES,
  PROJECT_COVER_MAX_FILE_BYTES,
  PROJECT_MEDIA_BUCKET,
} from "./constants";

import {
  DEFAULT_PROJECT_IMAGE,
  PROJECT_COVER_ALLOWED_MIME_TYPES,
  PROJECT_COVER_MAX_FILE_BYTES,
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

function hasBytes(bytes: Uint8Array, expected: number[], offset = 0) {
  return expected.every((byte, index) => bytes[offset + index] === byte);
}

function detectedImageType(bytes: Uint8Array) {
  if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return "jpeg";
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "webp";
  }
  if (hasBytes(bytes, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brands = new TextDecoder("ascii").decode(bytes.slice(8));
    if (brands.includes("avif") || brands.includes("avis")) return "avif";
  }
  return null;
}

export async function isValidProjectCoverFile(file: Blob, storagePath: string) {
  if (file.size === 0 || file.size > PROJECT_COVER_MAX_FILE_BYTES) return false;

  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  const type = detectedImageType(bytes);
  const extension = storagePath.split(".").at(-1)?.toLowerCase();

  return type === "jpeg"
    ? extension === "jpg" || extension === "jpeg"
    : type !== null && type === extension;
}
