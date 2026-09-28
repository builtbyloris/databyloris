"use client";

import {useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import type {ProjectDraft} from "@/types";

export function AdminOverview({drafts, creating, onNew, onProjects, onEdit}: {
  drafts: ProjectDraft[];
  creating: boolean;
  onNew: () => void;
  onProjects: () => void;
  onEdit: (id: string) => void;
}) {
  const t = useTranslations("Admin");
  const metrics = [
    ["total", drafts.length],
    ["published", drafts.filter(({project}) => project.status === "published").length],
    ["draft", drafts.filter(({project}) => project.status === "draft").length],
    ["dashboards", drafts.filter(({project}) => project.dashboardAvailable).length],
  ] as const;
  const recent = [...drafts].sort((a, b) => (b.project.publishedAt ?? "").localeCompare(a.project.publishedAt ?? "")).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("overview.eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{t("overview.title")}</h1>
          <p className="mt-2 text-sm text-muted">{t("overview.description")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onProjects}>{t("actions.manageProjects")}</Button>
          <Button onClick={onNew} disabled={creating}>{creating ? t("common.creating") : t("actions.newProject")}</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(([key, value]) => (
          <Card key={key} className="p-5">
            <p className="text-xs font-semibold text-muted">{t(`metrics.${key}`)}</p>
            <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold">{t("overview.recent")}</h2>
        </div>
        <div className="divide-y divide-border">
          {recent.map(({project}) => (
            <button key={project.id} type="button" onClick={() => onEdit(project.id)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-raised sm:px-6">
              <span>
                <span className="block font-semibold">{project.title || t("projects.untitled")}</span>
                <span className="mt-1 block text-xs text-muted">{project.category || "—"}</span>
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${project.status === "published" ? "bg-cyan/10 text-cyan" : "bg-violet/10 text-violet"}`}>{t(`status.${project.status}`)}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
