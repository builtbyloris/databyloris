"use client";

import { useActionState, useState } from "react";

import {
  removeProjectCoverAction,
  uploadProjectCoverAction,
} from "@/app/admin/(protected)/projects/cover-actions";
import { ProjectCoverImage } from "@/components/projects/project-cover-image";
import { Button } from "@/components/ui/button";
import type { ProjectCoverActionState } from "@/types/project-database";

const initialState: ProjectCoverActionState = {
  message: null,
  status: "idle",
};

const statusClasses: Record<ProjectCoverActionState["status"], string> = {
  idle: "",
  success: "border-success/25 bg-success-subtle text-success",
  warning: "border-warning/25 bg-warning-subtle text-warning",
  error: "border-danger/25 bg-danger-subtle text-danger",
};

export function ProjectCoverManager({
  coverUrl,
  projectId,
  title,
}: {
  coverUrl?: string;
  projectId: string;
  title: string;
}) {
  const [lastAction, setLastAction] = useState<"upload" | "remove">("upload");
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const uploadAction = uploadProjectCoverAction.bind(null, projectId);
  const removeAction = removeProjectCoverAction.bind(null, projectId);
  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    uploadAction,
    initialState,
  );
  const [removeState, removeFormAction, removePending] = useActionState(
    removeAction,
    initialState,
  );
  const feedback = lastAction === "upload" ? uploadState : removeState;

  return (
    <section className="space-y-5" aria-labelledby="cover-heading">
      <div>
        <h2 className="text-xl" id="cover-heading">
          Cover
        </h2>
        <p className="text-sm text-text-muted">
          One JPEG, PNG, or WebP image, up to 5 MB.
        </p>
      </div>

      {coverUrl ? (
        <ProjectCoverImage
          className="max-w-2xl rounded-card border border-border"
          coverUrl={coverUrl}
          sizes="(max-width: 768px) 100vw, 640px"
          title={title}
        />
      ) : (
        <div className="flex aspect-video max-w-2xl items-center justify-center rounded-card border border-dashed border-border bg-surface-secondary px-6 text-center text-sm text-text-muted">
          No cover uploaded. Public surfaces use the generated project visual.
        </div>
      )}

      <form
        action={uploadFormAction}
        className="space-y-3"
        onSubmit={() => setLastAction("upload")}
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex min-h-10 cursor-pointer items-center rounded-control border border-border bg-surface-primary px-4 text-sm font-medium text-text-primary hover:border-accent hover:text-accent">
            <span>{coverUrl ? "Choose replacement" : "Choose cover"}</span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploadPending || removePending}
              name="cover"
              onChange={(event) =>
                setSelectedFilename(event.currentTarget.files?.[0]?.name ?? null)
              }
              required
              type="file"
            />
          </label>
          <span className="text-sm text-text-muted">
            {selectedFilename ?? "No file selected"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button disabled={uploadPending || removePending} type="submit">
            {uploadPending
              ? "Uploading…"
              : coverUrl
                ? "Replace cover"
                : "Upload cover"}
          </Button>
        </div>
      </form>

      {coverUrl ? (
        <form action={removeFormAction} onSubmit={() => setLastAction("remove")}>
          <Button
            disabled={uploadPending || removePending}
            type="submit"
            variant="danger"
          >
            {removePending ? "Removing…" : "Remove cover"}
          </Button>
        </form>
      ) : null}

      {feedback.message ? (
        <p
          className={`rounded-control border px-4 py-3 text-sm ${statusClasses[feedback.status]}`}
          role={feedback.status === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      ) : null}
    </section>
  );
}
