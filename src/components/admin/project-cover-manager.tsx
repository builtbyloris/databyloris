"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {removeProjectCoverAction, updateProjectCoverAction} from "@/app/[locale]/admin/actions";
import {Button, Card} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {
  isAllowedProjectCoverMimeType,
  isProjectCoverStoragePath,
  PROJECT_COVER_ALLOWED_MIME_TYPES,
  PROJECT_COVER_MAX_FILE_BYTES,
  PROJECT_MEDIA_BUCKET,
  sanitizeProjectMediaFilename,
} from "@/lib/project-media";
import {createClient} from "@/lib/supabase/client";
import type {AdminActionError, ProjectCoverResult} from "@/types";

export function ProjectCoverManager({
  projectId,
  projectTitle,
  imagePath,
  imageUrl,
  locale,
  onChange,
}: {
  projectId: string;
  projectTitle: string;
  imagePath: string | null;
  imageUrl: string;
  locale: AppLocale;
  onChange: (cover: Pick<ProjectCoverResult, "imagePath" | "imageUrl">) => void;
}) {
  const t = useTranslations("Admin.cover");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState<"upload" | "remove" | null>(null);
  const [message, setMessage] = useState<{kind: "success" | "warning" | "error"; value: string} | null>(null);
  const hasStoredCover = isProjectCoverStoragePath(imagePath, projectId);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const clearPreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectFile = (selected: File | null) => {
    clearPreview();
    setMessage(null);
    if (!selected) return;
    if (!isAllowedProjectCoverMimeType(selected.type)) {
      setMessage({kind: "error", value: t("errors.unsupportedFormat")});
      return;
    }
    if (selected.size > PROJECT_COVER_MAX_FILE_BYTES) {
      setMessage({kind: "error", value: t("errors.tooLarge")});
      return;
    }
    const url = URL.createObjectURL(selected);
    previewRef.current = url;
    setPreviewUrl(url);
    setFile(selected);
  };

  const upload = async () => {
    if (!file) return;
    setPending("upload");
    setMessage(null);
    const safeFilename = storageFilename(file);
    const storagePath = `projects/${projectId}/cover/${crypto.randomUUID()}-${safeFilename}`;
    const supabase = createClient();
    const {error} = await supabase.storage
      .from(PROJECT_MEDIA_BUCKET)
      .upload(storagePath, file, {contentType: file.type, upsert: false});

    if (error) {
      setPending(null);
      setMessage({kind: "error", value: t("errors.uploadFailed")});
      return;
    }

    try {
      const result = await updateProjectCoverAction(locale, projectId, storagePath);
      if (!result.ok) {
        await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([storagePath]);
        setMessage({kind: "error", value: actionErrorMessage(result.error, t)});
        return;
      }
      onChange(result.data);
      clearPreview();
      setConfirmed(false);
      setMessage({
        kind: result.data.cleanupIncomplete ? "warning" : "success",
        value: t(result.data.cleanupIncomplete ? "feedback.cleanupIncomplete" : hasStoredCover ? "feedback.replaced" : "feedback.uploaded"),
      });
    } catch {
      await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([storagePath]);
      setMessage({kind: "error", value: t("errors.updateFailed")});
    } finally {
      setPending(null);
    }
  };

  const remove = async () => {
    if (!hasStoredCover || !confirmed) return;
    setPending("remove");
    setMessage(null);
    const result = await removeProjectCoverAction(locale, projectId, true);
    setPending(null);
    if (!result.ok) {
      setMessage({kind: "error", value: actionErrorMessage(result.error, t)});
      return;
    }
    onChange(result.data);
    setConfirmed(false);
    setMessage({
      kind: result.data.cleanupIncomplete ? "warning" : "success",
      value: t(result.data.cleanupIncomplete ? "feedback.cleanupIncomplete" : "feedback.removed"),
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <h2 className="text-lg font-bold">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("description")}</p>
          <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-control border border-border bg-surface-raised">
            <Image
              src={previewUrl ?? imageUrl}
              alt={t("previewAlt", {title: projectTitle})}
              fill
              unoptimized={Boolean(previewUrl)}
              sizes="(max-width: 1023px) 100vw, 32vw"
              className="object-cover"
            />
          </div>
          <p className="mt-2 break-all text-xs text-muted">
            {hasStoredCover ? imagePath?.split("/").at(-1) : t("none")}
          </p>
        </div>

        <div className="space-y-4 lg:pt-8">
          <label className="block text-sm font-semibold">{t(hasStoredCover ? "replace" : "upload")}
            <input
              ref={fileInputRef}
              type="file"
              accept={PROJECT_COVER_ALLOWED_MIME_TYPES.join(",")}
              className="mt-2 block w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
              onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <p className="text-xs text-muted">{t("limits", {megabytes: PROJECT_COVER_MAX_FILE_BYTES / 1024 / 1024})}</p>
          <Button onClick={upload} disabled={!file || pending !== null}>
            {pending === "upload" ? t("uploading") : t(hasStoredCover ? "replaceAction" : "uploadAction")}
          </Button>

          {hasStoredCover ? (
            <div className="border-t border-border pt-4">
              <label className="flex items-start gap-2 text-sm font-semibold">
                <input type="checkbox" className="mt-0.5" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                {t("confirmRemove")}
              </label>
              <Button variant="secondary" className="mt-3" onClick={remove} disabled={!confirmed || pending !== null}>
                {pending === "remove" ? t("removing") : t("remove")}
              </Button>
            </div>
          ) : null}

          {message ? (
            <p role={message.kind === "error" ? "alert" : "status"} className={`text-sm font-semibold ${message.kind === "error" ? "text-red-600 dark:text-red-300" : message.kind === "warning" ? "text-amber-700 dark:text-amber-300" : "text-cyan"}`}>
              {message.value}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function storageFilename(file: File) {
  const sanitized = sanitizeProjectMediaFilename(file.name);
  const base = sanitized.replace(/\.[^.]+$/, "") || "cover";
  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1] ?? "webp";
  return `${base}.${extension}`;
}

function actionErrorMessage(error: AdminActionError, t: ReturnType<typeof useTranslations>) {
  const key = `errors.${error}`;
  return t.has(key) ? t(key) : t("errors.updateFailed");
}
