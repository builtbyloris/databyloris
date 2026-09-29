export const PROJECT_MEDIA_BUCKET = "project-media";
export const PROJECT_COVER_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const PROJECT_COVER_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
export const DEFAULT_PROJECT_IMAGE = "/images/projects/project-cover.svg";
