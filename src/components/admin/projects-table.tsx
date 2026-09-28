"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import type {ProjectDraft, ProjectStatus} from "@/types";

type StatusFilter = "all" | Extract<ProjectStatus, "draft" | "published">;

export function ProjectsTable({drafts, creating, onNew, onEdit}: {drafts: ProjectDraft[]; creating: boolean; onNew: () => void; onEdit: (id: string) => void}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const visible = filter === "all" ? drafts : drafts.filter(({project}) => project.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("projects.eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{t("projects.title")}</h1>
        </div>
        <Button onClick={onNew} disabled={creating}>{creating ? t("common.creating") : t("actions.newProject")}</Button>
      </div>
      <div role="group" aria-label={t("projects.filterLabel")} className="flex flex-wrap gap-2">
        {(["all", "published", "draft"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filter === value ? "border-primary bg-primary/10 text-primary-strong" : "border-border text-muted hover:text-foreground"}`}>{t(`projects.filters.${value}`)}</button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-wider text-muted">
              <tr>
                {(["project", "category", "status", "dashboard", "publishedAt", "actions"] as const).map((key) => <th key={key} className="px-5 py-3 font-semibold">{t(`projects.columns.${key}`)}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map(({project}) => (
                <tr key={project.id} className="border-t border-border">
                  <th scope="row" className="px-5 py-4 font-semibold">{project.title || t("projects.untitled")}</th>
                  <td className="px-5 py-4 text-muted">{project.category || "—"}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-surface-raised px-2.5 py-1 text-xs font-bold">{t(`status.${project.status}`)}</span></td>
                  <td className="px-5 py-4 text-muted">{project.dashboardAvailable ? t("common.yes") : t("common.no")}</td>
                  <td className="px-5 py-4 text-muted">{project.publishedAt ? new Intl.DateTimeFormat(locale, {dateStyle: "medium"}).format(new Date(project.publishedAt)) : "—"}</td>
                  <td className="px-5 py-4"><button type="button" onClick={() => onEdit(project.id)} className="font-semibold text-primary-strong hover:underline">{t("actions.edit")}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
