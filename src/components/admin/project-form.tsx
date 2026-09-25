"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createProjectAction,
  updateProjectAction,
} from "@/app/admin/(protected)/projects/actions";
import { Button, ButtonLink } from "@/components/ui/button";
import type {
  ProjectDatabaseRow,
  ProjectFormField,
  ProjectFormState,
} from "@/types/project-database";

const initialState: ProjectFormState = { error: null, fieldErrors: {} };
const inputClassName =
  "min-h-11 w-full rounded-control border border-control-border bg-surface-primary px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60";
const labelClassName = "text-sm font-medium text-text-primary";

function FieldError({ field, state }: { field: ProjectFormField; state: ProjectFormState }) {
  const message = state.fieldErrors[field];
  return message ? (
    <p className="text-xs text-danger" id={`${field}-error`}>
      {message}
    </p>
  ) : null;
}

interface ProjectFormProps {
  implementedSlug?: string;
  mode: "create" | "edit";
  project?: ProjectDatabaseRow;
}

export function ProjectForm({ implementedSlug, mode, project }: ProjectFormProps) {
  const action =
    mode === "edit" && project
      ? updateProjectAction.bind(null, project.id)
      : createProjectAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!state.error) return;

    const firstInvalidField = formRef.current?.querySelector<HTMLElement>(
      "[aria-invalid='true']",
    );
    (firstInvalidField ?? errorRef.current)?.focus();
  }, [state.error, state.fieldErrors]);

  const describedBy = (field: ProjectFormField, helperId?: string) => {
    const ids = [helperId, state.fieldErrors[field] ? `${field}-error` : null].filter(
      Boolean,
    );
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  return (
    <form action={formAction} aria-busy={pending} className="space-y-8" ref={formRef}>
      {state.error ? (
        <p
          className="rounded-control border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger"
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {state.error}
        </p>
      ) : null}

      <section className="space-y-5" aria-labelledby="project-content-heading">
        <div>
          <h2 className="text-xl" id="project-content-heading">
            Project content
          </h2>
          <p className="text-sm text-text-muted">Core catalog and story information.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="title">Title <span className="font-normal text-text-muted">(required)</span></label>
            <input aria-describedby={describedBy("title")} aria-invalid={Boolean(state.fieldErrors.title)} className={inputClassName} defaultValue={project?.title} disabled={pending} id="title" maxLength={120} name="title" required />
            <FieldError field="title" state={state} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="slug">Slug <span className="font-normal text-text-muted">(required)</span></label>
            <input aria-describedby={describedBy("slug", implementedSlug ? "slug-help" : undefined)} aria-invalid={Boolean(state.fieldErrors.slug)} autoCapitalize="none" className={inputClassName} defaultValue={project?.slug} disabled={pending} id="slug" maxLength={100} name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="project-name" required />
            {implementedSlug ? (
              <p className="rounded-control border border-warning/25 bg-warning-subtle px-3 py-2 text-xs leading-5 text-warning" id="slug-help">
                This slug connects the project to its code-driven analytical
                implementation. Changing it will disconnect that experience
                until the implementation registry is updated.
              </p>
            ) : null}
            <FieldError field="slug" state={state} />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClassName} htmlFor="subtitle">Subtitle</label>
          <input aria-describedby={describedBy("subtitle")} aria-invalid={Boolean(state.fieldErrors.subtitle)} className={inputClassName} defaultValue={project?.subtitle ?? ""} disabled={pending} id="subtitle" maxLength={240} name="subtitle" />
          <FieldError field="subtitle" state={state} />
        </div>

        <div className="space-y-2">
          <label className={labelClassName} htmlFor="description">Description <span className="font-normal text-text-muted">(required)</span></label>
          <textarea aria-describedby={describedBy("description")} aria-invalid={Boolean(state.fieldErrors.description)} className={`${inputClassName} min-h-32 py-2.5`} defaultValue={project?.description} disabled={pending} id="description" maxLength={2000} name="description" required />
          <FieldError field="description" state={state} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="category">Category <span className="font-normal text-text-muted">(required)</span></label>
            <input aria-describedby={describedBy("category")} aria-invalid={Boolean(state.fieldErrors.category)} className={inputClassName} defaultValue={project?.category} disabled={pending} id="category" maxLength={80} name="category" required />
            <FieldError field="category" state={state} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="period">Period</label>
            <input aria-describedby={describedBy("period")} aria-invalid={Boolean(state.fieldErrors.period)} className={inputClassName} defaultValue={project?.period ?? ""} disabled={pending} id="period" maxLength={100} name="period" placeholder="2022–2025" />
            <FieldError field="period" state={state} />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClassName} htmlFor="question">Main question</label>
          <input aria-describedby={describedBy("question")} aria-invalid={Boolean(state.fieldErrors.question)} className={inputClassName} defaultValue={project?.question ?? ""} disabled={pending} id="question" maxLength={300} name="question" />
          <FieldError field="question" state={state} />
        </div>

        <div className="space-y-2">
          <label className={labelClassName} htmlFor="tags">Tags</label>
          <input aria-describedby={describedBy("tags", "tags-help")} aria-invalid={Boolean(state.fieldErrors.tags)} className={inputClassName} defaultValue={project?.tags.join(", ") ?? ""} disabled={pending} id="tags" name="tags" placeholder="Artists, Genres, Countries" />
          <p className="text-xs text-text-muted" id="tags-help">Separate tags with commas.</p>
          <FieldError field="tags" state={state} />
        </div>
      </section>

      {mode === "create" ? (
        <section
          className="space-y-3 border-t border-border pt-8"
          aria-labelledby="cover-heading"
        >
          <div>
            <h2 className="text-xl" id="cover-heading">
              Cover
            </h2>
            <p className="text-sm text-text-muted">
              Create the project first, then upload its cover from the edit
              screen. This keeps every Storage object attached to a saved
              project.
            </p>
          </div>
        </section>
      ) : null}

      <section className="space-y-5 border-t border-border pt-8" aria-labelledby="dataset-heading">
        <div>
          <h2 className="text-xl" id="dataset-heading">Dataset metadata</h2>
          <p className="text-sm text-text-muted">Descriptive metadata only; no dataset upload is created.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="datasetRecords">Records</label>
            <input aria-describedby={describedBy("datasetRecords")} aria-invalid={Boolean(state.fieldErrors.datasetRecords)} className={inputClassName} defaultValue={project?.dataset_records ?? ""} disabled={pending} id="datasetRecords" maxLength={120} name="datasetRecords" />
            <FieldError field="datasetRecords" state={state} />
          </div>
          <div className="space-y-2">
            <label className={labelClassName} htmlFor="datasetGrain">Grain</label>
            <input aria-describedby={describedBy("datasetGrain")} aria-invalid={Boolean(state.fieldErrors.datasetGrain)} className={inputClassName} defaultValue={project?.dataset_grain ?? ""} disabled={pending} id="datasetGrain" maxLength={240} name="datasetGrain" />
            <FieldError field="datasetGrain" state={state} />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor="datasetSource">Source</label>
          <input aria-describedby={describedBy("datasetSource")} aria-invalid={Boolean(state.fieldErrors.datasetSource)} className={inputClassName} defaultValue={project?.dataset_source ?? ""} disabled={pending} id="datasetSource" maxLength={500} name="datasetSource" />
          <FieldError field="datasetSource" state={state} />
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8" aria-labelledby="publishing-heading">
        <div>
          <h2 className="text-xl" id="publishing-heading">Publishing</h2>
          <p className="text-sm text-text-muted">Control the project&apos;s public visibility and featured state.</p>
        </div>
        <div className="max-w-sm space-y-2">
          <label className={labelClassName} htmlFor="status">Status</label>
          <select aria-describedby={describedBy("status")} aria-invalid={Boolean(state.fieldErrors.status)} className={inputClassName} defaultValue={project?.status ?? "draft"} disabled={pending} id="status" name="status">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <FieldError field="status" state={state} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-11 items-center gap-3 rounded-control border border-control-border bg-surface-primary px-3.5 text-sm text-text-primary">
            <input defaultChecked={project?.featured} disabled={pending} name="featured" type="checkbox" />
            Featured project
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-control border border-control-border bg-surface-primary px-3.5 text-sm text-text-primary">
            <input defaultChecked={project?.demo} disabled={pending} name="demo" type="checkbox" />
            Demo project
          </label>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-6">
        <ButtonLink href="/admin/projects" variant="ghost">Cancel</ButtonLink>
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
