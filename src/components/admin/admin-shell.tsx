"use client";

import {useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Card, Container} from "@/components/ui";
import {createNewProjectDraft} from "@/lib/admin";
import type {AdminView, DashboardConfig, Project, ProjectDraft} from "@/types";
import {AdminOverview} from "./admin-overview";
import {AdminSidebar} from "./admin-sidebar";
import {DashboardBuilder} from "./dashboard-builder";
import {ProjectEditor} from "./project-editor";
import {ProjectsTable} from "./projects-table";

export function AdminShell({initialDrafts}: {initialDrafts: ProjectDraft[]}) {
  const t = useTranslations("Admin");
  const [drafts, setDrafts] = useState(initialDrafts);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(() => new Set());
  const [view, setView] = useState<AdminView>("overview");
  const [selectedId, setSelectedId] = useState(initialDrafts[0]?.project.id ?? null);
  const sequence = useRef(1);
  const selected = drafts.find(({project}) => project.id === selectedId) ?? null;

  const markDirty = (id: string) => setDirtyIds((current) => new Set(current).add(id));
  const updateSelected = (change: Partial<Pick<ProjectDraft, "project" | "dashboardConfig">>) => {
    if (!selectedId) return;
    setDrafts((current) => current.map((draft) => draft.project.id === selectedId ? {...draft, ...change} : draft));
    markDirty(selectedId);
  };
  const applySession = () => {
    if (!selectedId) return;
    setDirtyIds((current) => {
      const next = new Set(current);
      next.delete(selectedId);
      return next;
    });
  };
  const edit = (id: string) => { setSelectedId(id); setView("editor"); };
  const create = () => {
    const draft = createNewProjectDraft(sequence.current++);
    setDrafts((current) => [draft, ...current]);
    setDirtyIds((current) => new Set(current).add(draft.project.id));
    setSelectedId(draft.project.id);
    setView("editor");
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
          <span className="w-fit rounded-full border border-violet/25 bg-violet/10 px-3 py-1.5 text-xs font-bold text-violet">{t("sessionBadge")}</span>
        </div>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <AdminSidebar view={view} onChange={navigate} />
          <div className="min-w-0">
            {view === "overview" ? <AdminOverview drafts={drafts} onNew={create} onProjects={() => setView("projects")} onEdit={edit} /> : null}
            {view === "projects" ? <ProjectsTable drafts={drafts} onNew={create} onEdit={edit} /> : null}
            {view === "editor" && selected ? <ProjectEditor draft={selected} allDrafts={drafts} dirty={dirtyIds.has(selected.project.id)} onChange={(project: Project) => updateSelected({project})} onApply={applySession} onBuilder={() => setView("builder")} onBack={() => setView("projects")} /> : null}
            {view === "builder" && selected ? <DashboardBuilder draft={selected} dirty={dirtyIds.has(selected.project.id)} onChange={(dashboardConfig: DashboardConfig) => updateSelected({dashboardConfig})} onApply={applySession} onBack={() => setView("editor")} /> : null}
            {view === "media" ? <Card className="p-8 sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("media.eyebrow")}</p><h1 className="mt-3 text-3xl font-black tracking-tight">{t("media.title")}</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t("media.description")}</p><div className="mt-6 rounded-control border border-dashed border-border bg-surface-raised p-5 text-sm text-muted">{t("media.storageNote")}</div></Card> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
