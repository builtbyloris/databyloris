"use client";

import {useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import {slugifyProjectTitle, validateProjectDraft} from "@/lib/admin";
import type {Project, ProjectDraft} from "@/types";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const textareaClass = "mt-1.5 min-h-28 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

export function ProjectEditor({draft, allDrafts, dirty, onChange, onApply, onBuilder, onBack}: {
  draft: ProjectDraft;
  allDrafts: ProjectDraft[];
  dirty: boolean;
  onChange: (project: Project) => void;
  onApply: () => void;
  onBuilder: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("Admin");
  const issues = validateProjectDraft(draft, allDrafts);
  const issueFor = (path: string) => issues.find((issue) => issue.path === path);
  const set = <K extends keyof Project>(key: K, value: Project[K]) => onChange({...draft.project, [key]: value});
  const error = (path: string) => {
    const issue = issueFor(path);
    return issue ? t(`validation.${issue.code}`) : null;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-semibold text-muted hover:text-foreground">← {t("actions.backToProjects")}</button>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{draft.project.title || t("editor.newTitle")}</h1>
          <p aria-live="polite" className={`mt-2 text-sm font-semibold ${dirty ? "text-violet" : "text-muted"}`}>{dirty ? t("common.unsaved") : t("common.sessionApplied")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBuilder}>{t("actions.openBuilder")}</Button>
          <Button onClick={onApply} disabled={issues.length > 0 || !dirty}>{t("actions.applySession")}</Button>
        </div>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold">{t("editor.metadata")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">{t("fields.title")}
            <input className={inputClass} value={draft.project.title} aria-invalid={Boolean(error("project.title"))} onChange={(event) => {
              const title = event.target.value;
              const previousAutoSlug = slugifyProjectTitle(draft.project.title);
              onChange({...draft.project, title, slug: !draft.project.slug || draft.project.slug === previousAutoSlug ? slugifyProjectTitle(title) : draft.project.slug});
            }} />
            {error("project.title") ? <span className="mt-1 block text-xs text-red-500">{error("project.title")}</span> : null}
          </label>
          <label className="text-sm font-semibold">{t("fields.slug")}
            <input className={inputClass} value={draft.project.slug} aria-invalid={Boolean(error("project.slug"))} onChange={(event) => set("slug", event.target.value)} />
            {error("project.slug") ? <span className="mt-1 block text-xs text-red-500">{error("project.slug")}</span> : null}
          </label>
          <label className="text-sm font-semibold md:col-span-2">{t("fields.description")}
            <textarea className={textareaClass} value={draft.project.description} onChange={(event) => set("description", event.target.value)} />
          </label>
          <label className="text-sm font-semibold">{t("fields.category")}
            <input className={inputClass} value={draft.project.category} aria-invalid={Boolean(error("project.category"))} onChange={(event) => set("category", event.target.value)} />
            {error("project.category") ? <span className="mt-1 block text-xs text-red-500">{error("project.category")}</span> : null}
          </label>
          <label className="text-sm font-semibold">{t("fields.technologies")}
            <input className={inputClass} value={draft.project.technologies.join(", ")} onChange={(event) => set("technologies", event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} />
          </label>
          <label className="text-sm font-semibold">{t("fields.status")}
            <select className={inputClass} value={draft.project.status} onChange={(event) => set("status", event.target.value as Project["status"])}>
              <option value="draft">{t("status.draft")}</option><option value="published">{t("status.published")}</option><option value="archived">{t("status.archived")}</option>
            </select>
          </label>
          <label className="text-sm font-semibold">{t("fields.repositoryUrl")}
            <input type="url" className={inputClass} value={draft.project.repositoryUrl ?? ""} onChange={(event) => set("repositoryUrl", event.target.value || undefined)} />
          </label>
        </div>
        <fieldset className="mt-5 flex flex-wrap gap-5 border-t border-border pt-5">
          <legend className="sr-only">{t("editor.options")}</legend>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={draft.project.featured} onChange={(event) => set("featured", event.target.checked)} />{t("fields.featured")}</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(draft.project.dashboardAvailable)} onChange={(event) => set("dashboardAvailable", event.target.checked)} />{t("fields.dashboardAvailable")}</label>
        </fieldset>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold">{t("dataset.title")}</h2>
        {draft.dataset ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <DatasetFact label={t("dataset.associated")} value={draft.dataset.id} />
            <DatasetFact label={t("dataset.records")} value={String(draft.dataset.records.length)} />
            <DatasetFact label={t("dataset.fields")} value={String(draft.dataset.fields.length)} />
            <div className="sm:col-span-3"><p className="text-xs font-semibold text-muted">{t("dataset.availableFields")}</p><p className="mt-2 text-sm leading-6">{draft.dataset.fields.join(", ")}</p></div>
          </div>
        ) : (
          <div className="mt-4 rounded-control border border-dashed border-border bg-surface-raised p-5">
            <p className="font-semibold">{t("dataset.none")}</p><p className="mt-2 text-sm text-muted">{t("dataset.storageNote")}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function DatasetFact({label, value}: {label: string; value: string}) {
  return <div className="rounded-control bg-surface-raised p-4"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 break-words font-bold">{value}</p></div>;
}
