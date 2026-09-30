"use client";

import {useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {buttonStyles, Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import {ALL_FILTER_VALUE, applyDashboardFilters, calculateKpis, type DashboardFilterState} from "@/lib/dashboard";
import type {DashboardConfig, DashboardRecord} from "@/types";
import {DashboardChart} from "./dashboard-chart";
import {DashboardFilters} from "./dashboard-filters";
import {DashboardKpiGrid} from "./dashboard-kpi-grid";
import {DashboardRanking} from "./dashboard-ranking";
import {DashboardSidebar} from "./dashboard-sidebar";
import {useDashboardText} from "./use-dashboard-text";

function createInitialState(config: DashboardConfig): DashboardFilterState {
  return Object.fromEntries(config.filters.map((filter) => [filter.id, filter.defaultValue ?? ALL_FILTER_VALUE]));
}

export function DashboardShell({project, config, records, embedded = false}: {
  project?: {slug: string; title: string};
  config: DashboardConfig;
  records: DashboardRecord[];
  embedded?: boolean;
}) {
  const t = useTranslations("Dashboard");
  const dashboardText = useDashboardText();
  const [filters, setFilters] = useState<DashboardFilterState>(() => createInitialState(config));
  const filteredRecords = useMemo(() => applyDashboardFilters(records, config.filters, filters), [config.filters, filters, records]);
  const kpis = useMemo(() => calculateKpis(filteredRecords, config.kpis), [config.kpis, filteredRecords]);
  const resetFilters = () => setFilters(createInitialState(config));
  const dashboardTitle = dashboardText(config.title).trim() || t("breadcrumb.dashboard");
  const dashboardDescription = dashboardText(config.description).trim();

  const dashboardContent = (
    <div className="w-full min-w-0 max-w-full space-y-5">
      <DashboardFilters filters={config.filters} records={records} state={filters} onChange={(id, value) => setFilters((current) => ({...current, [id]: value}))} onReset={resetFilters} />
      <DashboardKpiGrid items={kpis} />

      {filteredRecords.length === 0 ? (
        <div className="rounded-card border border-border bg-card px-6 py-16 text-center shadow-card">
          <h2 className="text-xl font-bold">{t("empty.title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("empty.description")}</p>
          <button type="button" onClick={resetFilters} className={buttonStyles({variant: "secondary", className: "mt-6"})}>{t("filters.reset")}</button>
        </div>
      ) : (
        <div className="grid min-w-0 gap-5 xl:grid-cols-3">
          {config.charts.map((chart) => <DashboardChart key={chart.id} config={chart} records={filteredRecords} featured={chart.id === config.layout.featuredChartId} />)}
          {config.rankings.map((ranking) => <DashboardRanking key={ranking.id} config={ranking} records={filteredRecords} className="xl:col-span-2" />)}
        </div>
      )}
    </div>
  );

  if (embedded) return dashboardContent;
  if (!project) return null;

  return (
    <section className="relative min-h-[75vh] overflow-hidden py-8 sm:py-10 lg:py-12">
      <div className="data-grid pointer-events-none absolute inset-x-0 top-0 h-[26rem]" />
      <Container className="relative">
        <nav aria-label={t("breadcrumb.label")} className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/projects" className="font-medium hover:text-foreground">{t("breadcrumb.projects")}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/projects/${project.slug}`} className="font-medium hover:text-foreground">{project.title}</Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-foreground">{t("breadcrumb.dashboard")}</span>
        </nav>
        <div className="mt-6 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("eyebrow")}</p>
          <h1 className="mt-3 break-words text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">{dashboardTitle}</h1>
          {dashboardDescription ? <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{dashboardDescription}</p> : null}
        </div>

        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-6">
          <DashboardSidebar slug={project.slug} />
          {dashboardContent}
        </div>
      </Container>
    </section>
  );
}
