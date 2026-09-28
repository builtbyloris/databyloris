"use client";

import {useTranslations} from "next-intl";
import {DashboardShell} from "@/components/dashboard";
import {Card} from "@/components/ui";
import {validateDashboardConfig} from "@/lib/admin";
import type {ProjectDraft} from "@/types";

export function AdminPreview({draft}: {draft: ProjectDraft}) {
  const t = useTranslations("Admin");
  if (!draft.dataset) {
    return <InfoCard title={t("preview.noDatasetTitle")} description={t("preview.noDatasetDescription")} />;
  }
  const issues = validateDashboardConfig(draft.dashboardConfig, draft.dataset.fields);
  if (issues.length > 0) {
    return (
      <Card className="border-red-500/25 p-6">
        <h2 className="text-lg font-bold">{t("preview.invalidTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("preview.invalidDescription")}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {issues.map((issue, index) => <li key={`${issue.path}-${issue.code}-${index}`} className="rounded-control bg-red-500/8 px-3 py-2"><span className="font-mono text-xs">{issue.path}</span>: {t(`validation.${issue.code}`)}</li>)}
        </ul>
      </Card>
    );
  }
  return (
    <div className="rounded-card border border-border bg-background p-3 shadow-inner sm:p-5">
      <DashboardShell embedded config={draft.dashboardConfig} records={draft.dataset.records} />
    </div>
  );
}

function InfoCard({title, description}: {title: string; description: string}) {
  return <Card className="border-dashed p-8 text-center"><h2 className="text-lg font-bold">{title}</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p></Card>;
}
