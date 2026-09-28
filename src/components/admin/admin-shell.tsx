"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {
  createProjectAction,
  saveDashboardConfigAction,
  saveProjectDetailAction,
  updateProjectAction,
} from "@/app/[locale]/admin/actions";
import {logoutAction} from "@/app/[locale]/admin/login/actions";
import {Button, Card, Container} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {createProjectDraft} from "@/lib/admin";
import type {AdminProjectInput, AdminView, DashboardConfig, ProjectDetail, ProjectDraft} from "@/types";
import {AdminOverview} from "./admin-overview";
import {AdminSidebar} from "./admin-sidebar";
import {DashboardBuilder} from "./dashboard-builder";
import {ProjectEditor} from "./project-editor";
import {ProjectsTable} from "./projects-table";

export function AdminShell({
  initialDrafts,
  adminEmail,
  locale,
  initialLoadError = false,
}: {
  initialDrafts: ProjectDraft[];
  adminEmail: string | null;
  locale: AppLocale;
  initialLoadError?: boolean;
}) {
  const t = useTranslations("Admin");
  const [drafts, setDrafts] = useState(initialDrafts);
  const [projectDirtyIds, setProjectDirtyIds] = useState<Set<string>>(() => new Set());
  const [configDirtyIds, setConfigDirtyIds] = useState<Set<string>>(() => new Set());
  const [persistedDetails, setPersistedDetails] = useState<Record<string, string>>(() => Object.fromEntries(
    initialDrafts.map((draft) => [draft.project.id, serializeDetail(draft.projectDetail)]),
  ));
  const [view, setView] = useState<AdminView>("overview");
  const [selectedId, setSelectedId] = useState(initialDrafts[0]?.project.id ?? null);
  const [pending, setPending] = useState<"create" | "project" | "detail" | "config" | null>(null);
  const [feedback, setFeedback] = useState<{kind: "success" | "error"; code: string} | null>(
    initialLoadError ? {kind: "error", code: "databaseUnavailable"} : null,
  );
  const selected = drafts.find(({project}) => project.id === selectedId) ?? null;
  const selectedDetailDirty = selected
    ? serializeDetail(selected.projectDetail) !== persistedDetails[selected.project.id]
    : false;

  const updateSelected = (change: Partial<Pick<ProjectDraft, "project" | "localizedTitle" | "localizedDescription">>) => {
    if (!selectedId) return;
    setDrafts((current) => current.map((draft) => draft.project.id === selectedId ? {...draft, ...change} : draft));
    setProjectDirtyIds((current) => new Set(current).add(selectedId));
    setFeedback(null);
  };
  const updateSelectedConfig = (dashboardConfig: DashboardConfig) => {
    if (!selectedId) return;
    setDrafts((current) => current.map((draft) => draft.project.id === selectedId ? {...draft, dashboardConfig} : draft));
    setConfigDirtyIds((current) => new Set(current).add(selectedId));
    setFeedback(null);
  };
  const updateSelectedDetail = (projectDetail: ProjectDetail) => {
    if (!selectedId) return;
    setDrafts((current) => current.map((draft) => draft.project.id === selectedId ? {...draft, projectDetail} : draft));
    setFeedback(null);
  };
  const edit = (id: string) => { setSelectedId(id); setView("editor"); };
  const create = async () => {
    setPending("create");
    setFeedback(null);
    const result = await createProjectAction(locale);
    setPending(null);

    if (!result.ok) {
      setFeedback({kind: "error", code: result.error});
      return;
    }

    const draft = createProjectDraft(result.data.project, {
      localizedTitle: result.data.localizedTitle,
      localizedDescription: result.data.localizedDescription,
    });
    setDrafts((current) => [draft, ...current]);
    setPersistedDetails((current) => ({...current, [draft.project.id]: serializeDetail(draft.projectDetail)}));
    setSelectedId(draft.project.id);
    setView("editor");
    setFeedback({kind: "success", code: "projectCreated"});
  };
  const saveProject = async () => {
    if (!selected || selected.project.status === "archived") return;
    setPending("project");
    setFeedback(null);
    const input: AdminProjectInput = {
      id: selected.project.id,
      slug: selected.project.slug,
      title: selected.localizedTitle,
      description: selected.localizedDescription,
      category: selected.project.category,
      technologies: selected.project.technologies,
      featured: selected.project.featured,
      status: selected.project.status,
      dashboardAvailable: Boolean(selected.project.dashboardAvailable),
      repositoryUrl: selected.project.repositoryUrl,
    };
    const result = await updateProjectAction(locale, input);
    setPending(null);

    if (!result.ok) {
      setFeedback({kind: "error", code: result.error});
      return;
    }

    setDrafts((current) => current.map((draft) => draft.project.id === result.data.project.id
      ? {
          ...draft,
          project: result.data.project,
          localizedTitle: result.data.localizedTitle,
          localizedDescription: result.data.localizedDescription,
        }
      : draft));
    setProjectDirtyIds((current) => without(current, result.data.project.id));
    setFeedback({kind: "success", code: "projectSaved"});
  };
  const saveConfig = async () => {
    if (!selected) return;
    setPending("config");
    setFeedback(null);
    const result = await saveDashboardConfigAction(locale, selected.project.id, selected.dashboardConfig);
    setPending(null);

    if (!result.ok) {
      setFeedback({kind: "error", code: result.error});
      return;
    }

    setDrafts((current) => current.map((draft) => draft.project.id === selected.project.id
      ? {...draft, dashboardConfig: result.data}
      : draft));
    setConfigDirtyIds((current) => without(current, selected.project.id));
    setFeedback({kind: "success", code: "configSaved"});
  };
  const saveDetail = async () => {
    if (!selected) return;
    setPending("detail");
    setFeedback(null);
    const result = await saveProjectDetailAction(locale, selected.project.id, selected.projectDetail);
    setPending(null);

    if (!result.ok) {
      setFeedback({kind: "error", code: result.error});
      return;
    }

    setDrafts((current) => current.map((draft) => draft.project.id === selected.project.id
      ? {...draft, projectDetail: result.data}
      : draft));
    setPersistedDetails((current) => ({...current, [selected.project.id]: serializeDetail(result.data)}));
    setFeedback({kind: "success", code: "detailSaved"});
  };
  const navigate = (next: AdminView) => {
    if ((next === "builder" || next === "editor") && !selectedId && drafts[0]) setSelectedId(drafts[0].project.id);
    setView(next);
  };

  return (
    <section className="relative min-h-[80vh] overflow-hidden py-8 sm:py-10">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[24rem] opacity-70" />
      <Container className="relative">
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("eyebrow")}</p><p className="mt-2 max-w-2xl text-sm text-muted">{t("prototypeNotice")}</p></div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted">{t("auth.signedInAs")}</p>
              <p className="max-w-64 truncate text-sm font-semibold">{adminEmail ?? t("auth.unknownEmail")}</p>
            </div>
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <Button type="submit" variant="secondary" size="sm">{t("auth.logout")}</Button>
            </form>
          </div>
        </div>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <AdminSidebar view={view} onChange={navigate} />
          <div className="min-w-0">
            {feedback ? <Feedback kind={feedback.kind} message={t(`${feedback.kind === "error" ? "errors" : "feedback"}.${feedback.code}`)} /> : null}
            {view === "overview" ? <AdminOverview drafts={drafts} creating={pending === "create"} onNew={create} onProjects={() => setView("projects")} onEdit={edit} /> : null}
            {view === "projects" ? <ProjectsTable drafts={drafts} creating={pending === "create"} onNew={create} onEdit={edit} /> : null}
            {view === "editor" && selected ? <ProjectEditor draft={selected} allDrafts={drafts} dirty={projectDirtyIds.has(selected.project.id)} detailDirty={selectedDetailDirty} saving={pending === "project"} detailSaving={pending === "detail"} onChange={updateSelected} onDetailChange={updateSelectedDetail} onSave={saveProject} onDetailSave={saveDetail} onBuilder={() => setView("builder")} onBack={() => setView("projects")} /> : null}
            {view === "builder" && selected ? <DashboardBuilder draft={selected} dirty={configDirtyIds.has(selected.project.id)} saving={pending === "config"} onChange={updateSelectedConfig} onSave={saveConfig} onBack={() => setView("editor")} /> : null}
            {view === "media" ? <Card className="p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("media.eyebrow")}</p><h1 className="mt-3 text-3xl font-black tracking-tight">{t("media.title")}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t("media.description")}</p><div className="mt-6 rounded-control border border-dashed border-border bg-surface-raised p-5 text-sm text-muted">{t("media.storageNote")}</div></Card> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function without(current: Set<string>, id: string) {
  const next = new Set(current);
  next.delete(id);
  return next;
}

function serializeDetail(detail: ProjectDetail) {
  return JSON.stringify(detail);
}

function Feedback({kind, message}: {kind: "success" | "error"; message: string}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`mb-5 rounded-control border px-4 py-3 text-sm font-semibold ${kind === "error" ? "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300" : "border-cyan/25 bg-cyan/10 text-cyan"}`}
    >
      {message}
    </div>
  );
}
