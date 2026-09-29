"use client";

import {useLocale, useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import {slugifyProjectTitle, validateProjectDraft} from "@/lib/admin";
import type {Project, ProjectDetail, ProjectDraft} from "@/types";
import type {AppLocale} from "@/i18n/routing";
import type {AdminDatasetDraft} from "@/types";
import {DatasetManager} from "./dataset-manager";
import {ProjectCoverManager} from "./project-cover-manager";
import {ProjectDetailEditor} from "./project-detail-editor";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const textareaClass = "mt-1.5 min-h-28 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

export function ProjectEditor({draft, allDrafts, locale: appLocale, dirty, detailDirty, saving, detailSaving, onChange, onDetailChange, onDatasetChange, onCoverChange, onSave, onDetailSave, onBuilder, onBack}: {
  draft: ProjectDraft;
  allDrafts: ProjectDraft[];
  locale: AppLocale;
  dirty: boolean;
  detailDirty: boolean;
  saving: boolean;
  detailSaving: boolean;
  onChange: (change: Partial<Pick<ProjectDraft, "project" | "localizedTitle" | "localizedDescription">>) => void;
  onDetailChange: (detail: ProjectDetail) => void;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
  onCoverChange: (cover: {imagePath: string | null; imageUrl: string}) => void;
  onSave: () => void;
  onDetailSave: () => void;
  onBuilder: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale() === "en" ? "en" : "it";
  const issues = validateProjectDraft(draft, allDrafts);
  const issueFor = (path: string) => issues.find((issue) => issue.path === path);
  const set = <K extends keyof Project>(key: K, value: Project[K]) => onChange({project: {...draft.project, [key]: value}});
  const setLocalizedTitle = (language: "it" | "en", title: string) => {
    const localizedTitle = {...draft.localizedTitle, [language]: title};
    const previousAutoSlug = slugifyProjectTitle(draft.localizedTitle[language]);
    onChange({
      localizedTitle,
      project: {
        ...draft.project,
        title: localizedTitle[locale],
        slug: language === locale && (!draft.project.slug || draft.project.slug === previousAutoSlug)
          ? slugifyProjectTitle(title)
          : draft.project.slug,
      },
    });
  };
  const setLocalizedDescription = (language: "it" | "en", description: string) => {
    const localizedDescription = {...draft.localizedDescription, [language]: description};
    onChange({
      localizedDescription,
      project: {...draft.project, description: localizedDescription[locale]},
    });
  };
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
          <p aria-live="polite" className={`mt-2 text-sm font-semibold ${dirty ? "text-violet" : "text-muted"}`}>{dirty ? t("common.unsaved") : t("common.saved")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBuilder}>{t("actions.openBuilder")}</Button>
          <Button onClick={onSave} disabled={issues.length > 0 || !dirty || saving}>{saving ? t("common.saving") : t("actions.saveChanges")}</Button>
        </div>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold">{t("editor.metadata")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">{t("fields.titleIt")}
            <input className={inputClass} value={draft.localizedTitle.it} aria-invalid={Boolean(error("project.title.it"))} onChange={(event) => setLocalizedTitle("it", event.target.value)} />
            {error("project.title.it") ? <span className="mt-1 block text-xs text-red-500">{error("project.title.it")}</span> : null}
          </label>
          <label className="text-sm font-semibold">{t("fields.titleEn")}
            <input className={inputClass} value={draft.localizedTitle.en} aria-invalid={Boolean(error("project.title.en"))} onChange={(event) => setLocalizedTitle("en", event.target.value)} />
            {error("project.title.en") ? <span className="mt-1 block text-xs text-red-500">{error("project.title.en")}</span> : null}
          </label>
          <label className="text-sm font-semibold">{t("fields.slug")}
            <input className={inputClass} value={draft.project.slug} aria-invalid={Boolean(error("project.slug"))} onChange={(event) => set("slug", event.target.value)} />
            {error("project.slug") ? <span className="mt-1 block text-xs text-red-500">{error("project.slug")}</span> : null}
          </label>
          <label className="text-sm font-semibold">{t("fields.descriptionIt")}
            <textarea className={textareaClass} value={draft.localizedDescription.it} onChange={(event) => setLocalizedDescription("it", event.target.value)} />
          </label>
          <label className="text-sm font-semibold">{t("fields.descriptionEn")}
            <textarea className={textareaClass} value={draft.localizedDescription.en} onChange={(event) => setLocalizedDescription("en", event.target.value)} />
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
              <option value="draft">{t("status.draft")}</option><option value="published">{t("status.published")}</option>
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
        <p className="mt-5 rounded-control border border-violet/20 bg-violet/10 px-4 py-3 text-xs font-medium text-muted">{t("publishNotice")}</p>
      </Card>

      <ProjectCoverManager
        key={`cover-${draft.project.id}`}
        projectId={draft.project.id}
        projectTitle={draft.project.title}
        imagePath={draft.imagePath}
        imageUrl={draft.project.image}
        locale={appLocale}
        onChange={onCoverChange}
      />

      <ProjectDetailEditor
        detail={draft.projectDetail}
        dirty={detailDirty}
        saving={detailSaving}
        onChange={onDetailChange}
        onSave={onDetailSave}
      />

      <DatasetManager
        key={`dataset-${draft.project.id}`}
        projectId={draft.project.id}
        projectTitle={draft.project.title}
        locale={appLocale}
        dataset={draft.dataset}
        dashboardConfig={draft.dashboardConfig}
        onDatasetChange={onDatasetChange}
      />
    </div>
  );
}
