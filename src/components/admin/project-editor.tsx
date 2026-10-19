"use client";

import {useLocale, useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import {slugifyProjectTitle, validateProjectDraft} from "@/lib/admin";
import type {PublishingQualityResult} from "@/lib/admin/publishing-quality-gate";
import type {Project, ProjectDetail, ProjectDraft} from "@/types";
import type {AppLocale} from "@/i18n/routing";
import type {AdminDatasetDraft} from "@/types";
import {getLocalizedPath} from "@/lib/seo";
import {AdminSaveStatus} from "./admin-save-status";
import {DatasetManager} from "./dataset-manager";
import {ProjectCoverManager} from "./project-cover-manager";
import {ProjectDetailEditor} from "./project-detail-editor";
import {PublishingChecklist} from "./publishing-checklist";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const textareaClass = "mt-1.5 min-h-28 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

export function ProjectEditor({draft, allDrafts, locale: appLocale, persistedSlug, dirty, detailDirty, saving, detailSaving, saveError, detailSaveError, quality, qualityLoading, onCheckQuality, onChange, onDetailChange, onDatasetChange, onCoverChange, onDatasetDirtyChange, onCoverDirtyChange, onSave, onDetailSave, onBuilder, onBack}: {
  draft: ProjectDraft;
  allDrafts: ProjectDraft[];
  locale: AppLocale;
  persistedSlug: string;
  dirty: boolean;
  detailDirty: boolean;
  saving: boolean;
  detailSaving: boolean;
  saveError?: string;
  detailSaveError?: string;
  quality: PublishingQualityResult | null;
  qualityLoading: boolean;
  onCheckQuality: () => void;
  onChange: (change: Partial<Pick<ProjectDraft, "project" | "localizedTitle" | "localizedDescription">>) => void;
  onDetailChange: (detail: ProjectDetail) => void;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
  onCoverChange: (cover: {imagePath: string | null; imageUrl: string}) => void;
  onDatasetDirtyChange: (dirty: boolean) => void;
  onCoverDirtyChange: (dirty: boolean) => void;
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
  const published = draft.project.status === "published";
  const dashboardAvailable = Boolean(draft.project.dashboardAvailable);
  const dataset = draft.dataset;
  const explorerAvailable = published && dataset?.source === "database" && dataset.explorerEnabled
    && dataset.explorerFields.length > 0
    && dataset.explorerFields.every((field) => dataset.columns.some((column) => column.name === field));
  const publicProjectPath = getLocalizedPath(appLocale, `/projects/${persistedSlug}`);
  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({behavior: "smooth", block: "start"});
    target?.focus({preventScroll: true});
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-semibold text-muted hover:text-foreground">← {t("actions.backToProjects")}</button>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{draft.project.title || t("editor.newTitle")}</h1>
          <AdminSaveStatus className="mt-2" phase={saving ? "saving" : saveError ? "error" : dirty ? "dirty" : "saved"} detail={saveError} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onBuilder}>{t("actions.openBuilder")}</Button>
          <Button onClick={onSave} disabled={issues.length > 0 || !dirty || saving}>{saving ? t("common.saving") : t("actions.saveChanges")}</Button>
        </div>
      </div>

      <section aria-label={t("hub.title")} className="rounded-card border border-border bg-card p-4 sm:p-5">
        <div className="grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2 xl:grid-cols-5">
          <HubFact label={t("fields.status")} value={t(`status.${draft.project.status}`)} />
          <HubFact label={t("fields.dashboardAvailable")} value={t(dashboardAvailable ? "common.yes" : "common.no")} />
          <HubFact label={t("hub.explorer")} value={t(explorerAvailable ? "common.yes" : "common.no")} />
          <HubFact label={t("hub.dataset")} value={dataset?.name || t("dataset.none")} />
          <HubFact label={t("quality.title")} value={!quality ? dirty || detailDirty ? t("quality.pending") : t("quality.unavailable") : quality.ready ? t("quality.ready") : t("quality.incomplete", {count: quality.issues.length})} />
        </div>
        {published ? <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-sm font-semibold">
          <a href={publicProjectPath} target="_blank" rel="noopener noreferrer" className="text-primary-strong hover:underline focus-visible:outline-2 focus-visible:outline-primary">{t("hub.openCaseStudy")} ↗</a>
          {dashboardAvailable ? <a href={`${publicProjectPath}/dashboard`} target="_blank" rel="noopener noreferrer" className="text-primary-strong hover:underline focus-visible:outline-2 focus-visible:outline-primary">{t("hub.openDashboard")} ↗</a> : null}
          {explorerAvailable ? <a href={`${publicProjectPath}/dataset`} target="_blank" rel="noopener noreferrer" className="text-primary-strong hover:underline focus-visible:outline-2 focus-visible:outline-primary">{t("hub.openExplorer")} ↗</a> : null}
        </div> : null}
      </section>

      <nav aria-label={t("hub.sections")} className="flex gap-2 overflow-x-auto border-b border-border pb-3 text-sm">
        {([ ["project-metadata", "project"], ["project-case-study", "caseStudy"], ["project-dataset", "dataset"], ["data-dictionary-heading", "dictionary"] ] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => jumpTo(id)} className="min-w-max rounded-control px-3 py-2 font-semibold text-muted hover:bg-surface-raised hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{t(`hub.sectionsNav.${label}`)}</button>
        ))}
        <button type="button" onClick={onBuilder} className="min-w-max rounded-control px-3 py-2 font-semibold text-muted hover:bg-surface-raised hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{t("hub.sectionsNav.dashboard")}</button>
      </nav>

      <Card id="project-metadata" tabIndex={-1} className="scroll-mt-24 p-5 sm:p-6">
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
          <label className="text-sm font-semibold">{t("fields.status")}
            <select className={inputClass} value={draft.project.status} aria-describedby="publishing-quality-status" onChange={(event) => set("status", event.target.value as Project["status"])}>
              <option value="draft">{t("status.draft")}</option><option value="published">{t("status.published")}</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <PublishingChecklist quality={quality} loading={qualityLoading} hasUnsavedChanges={dirty || detailDirty} onCheck={onCheckQuality} onBuilder={onBuilder} />
          </div>
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

      <div id="project-cover" tabIndex={-1} className="scroll-mt-24">
        <ProjectCoverManager
          key={`cover-${draft.project.id}`}
          projectId={draft.project.id}
          projectTitle={draft.project.title}
          imagePath={draft.imagePath}
          imageUrl={draft.project.image}
          locale={appLocale}
          onChange={onCoverChange}
          onDirtyChange={onCoverDirtyChange}
        />
      </div>

      <div id="project-case-study" tabIndex={-1} className="scroll-mt-24">
        <ProjectDetailEditor
          detail={draft.projectDetail}
          dirty={detailDirty}
          saving={detailSaving}
          saveError={detailSaveError}
          onChange={onDetailChange}
          onSave={onDetailSave}
        />
      </div>

      <div id="project-dataset" tabIndex={-1} className="scroll-mt-24">
        <DatasetManager
          key={`dataset-${draft.project.id}`}
          projectId={draft.project.id}
          projectTitle={draft.project.title}
          locale={appLocale}
          dataset={draft.dataset}
          dashboardConfig={draft.dashboardConfig}
          onDatasetChange={onDatasetChange}
          onDirtyChange={onDatasetDirtyChange}
        />
      </div>
    </div>
  );
}

function HubFact({label, value}: {label: string; value: string}) {
  return <div className="min-w-0"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 break-words font-semibold">{value}</p></div>;
}
