"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ArtistComparison } from "@/components/analytics/artist-comparison";
import { FilterBar } from "@/components/analytics/filter-bar";
import { GenreDistributionChart } from "@/components/analytics/genre-distribution-chart";
import { GenreGrowthChart } from "@/components/analytics/genre-growth-chart";
import { KPICard } from "@/components/analytics/kpi-card";
import { StreamingTrendChart } from "@/components/analytics/streaming-trend-chart";
import { TopArtistsChart } from "@/components/analytics/top-artists-chart";
import { TrackTable } from "@/components/analytics/track-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  aggregateArtistMetrics,
  aggregateArtistStreams,
  aggregateGenreDistribution,
  aggregateMonthlyStreams,
  aggregateTracks,
  calculateDashboardKpis,
  calculateGenreGrowth,
  createDashboardFilterOptions,
  EMPTY_DASHBOARD_FILTERS,
  filterDashboardRows,
  formatCompactMetric,
  parseDashboardFilters,
  serializeDashboardFilters,
} from "@/lib/dashboard-analytics";
import {
  DASHBOARD_MODULE_QUERY_KEY,
  getDashboardModuleId,
  getDashboardModuleElementId,
  getDashboardModuleIdFromHash,
} from "@/lib/dashboard-navigation";
import type {
  DashboardConfiguration,
  DashboardFilterKey,
  DashboardFilterState,
  DashboardModuleId,
} from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface DashboardShellProps {
  configuration: DashboardConfiguration;
  strings: PublicDictionary["dashboard"];
}

interface DashboardModuleProps {
  children: ReactNode;
  highlighted: boolean;
  moduleId: DashboardModuleId;
  strings: PublicDictionary["dashboard"];
}

function DashboardModule({
  children,
  highlighted,
  moduleId,
  strings,
}: DashboardModuleProps) {
  const label = strings.modules[moduleId];

  return (
    <section
      aria-label={`${label} ${strings.moduleAriaSuffix}`}
      className={`relative min-w-0 scroll-mt-32 rounded-card ${
        highlighted
          ? "outline outline-2 outline-offset-4 outline-accent shadow-elevated"
          : ""
      }`}
      id={getDashboardModuleElementId(moduleId)}
      tabIndex={-1}
    >
      {highlighted ? (
        <span
          className="absolute -top-3 right-4 z-10 rounded-badge border border-accent bg-surface-elevated px-2.5 py-1 text-xs font-semibold text-accent shadow-elevated"
          role="status"
        >
          {strings.insightFocus}
        </span>
      ) : null}
      {children}
    </section>
  );
}

export function DashboardShell({ configuration, strings }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [highlightedModule, setHighlightedModule] =
    useState<DashboardModuleId | null>(null);
  const options = useMemo(
    () => createDashboardFilterOptions(configuration.rows),
    [configuration.rows],
  );
  const filters = useMemo(
    () => parseDashboardFilters(searchParams, options),
    [options, searchParams],
  );
  const filteredRows = useMemo(
    () => filterDashboardRows(configuration.rows, filters),
    [configuration.rows, filters],
  );
  const kpis = useMemo(() => calculateDashboardKpis(filteredRows), [filteredRows]);
  const trendData = useMemo(() => aggregateMonthlyStreams(filteredRows), [filteredRows]);
  const artistRanking = useMemo(() => aggregateArtistStreams(filteredRows), [filteredRows]);
  const genreDistribution = useMemo(
    () => aggregateGenreDistribution(filteredRows),
    [filteredRows],
  );
  const genreGrowth = useMemo(() => calculateGenreGrowth(filteredRows), [filteredRows]);
  const comparisonRows = useMemo(
    () => filterDashboardRows(configuration.rows, { ...filters, artist: null }),
    [configuration.rows, filters],
  );
  const artistMetrics = useMemo(
    () => aggregateArtistMetrics(comparisonRows),
    [comparisonRows],
  );
  const trackData = useMemo(() => aggregateTracks(filteredRows), [filteredRows]);

  useEffect(() => {
    let highlightTimer: ReturnType<typeof setTimeout> | undefined;

    function focusTargetModule() {
      if (highlightTimer) clearTimeout(highlightTimer);

      const moduleId =
        getDashboardModuleId(
          new URLSearchParams(searchParamsString).get(
            DASHBOARD_MODULE_QUERY_KEY,
          ),
        ) ??
        getDashboardModuleIdFromHash(window.location.hash);
      if (!moduleId) {
        setHighlightedModule(null);
        return;
      }

      const element = document.getElementById(
        getDashboardModuleElementId(moduleId),
      );
      if (!element) return;

      element.scrollIntoView({ behavior: "auto", block: "start" });
      element.focus({ preventScroll: true });
      setHighlightedModule(moduleId);
      highlightTimer = setTimeout(() => setHighlightedModule(null), 2400);
    }

    focusTargetModule();
    window.addEventListener("hashchange", focusTargetModule);

    return () => {
      window.removeEventListener("hashchange", focusTargetModule);
      if (highlightTimer) clearTimeout(highlightTimer);
    };
  }, [searchParamsString]);

  function updateUrl(nextFilters: DashboardFilterState) {
    const query = serializeDashboardFilters(nextFilters);
    router.replace(`${pathname}${query ? `?${query}` : ""}#explore`, {
      scroll: false,
    });
  }

  function handleFilterChange(key: DashboardFilterKey, value: string | null) {
    updateUrl({ ...filters, [key]: value });
  }

  function resetFilters() {
    updateUrl(EMPTY_DASHBOARD_FILTERS);
  }

  const activeFilters = (Object.entries(filters) as [DashboardFilterKey, string | null][])
    .filter((entry): entry is [DashboardFilterKey, string] => Boolean(entry[1]))
    .map(([key, value]) => ({ label: strings.filterLabels[key], value }));

  const kpiCards = [
    {
      label: strings.kpis.totalStreams,
      value: formatCompactMetric(kpis.totalStreams),
      context: strings.kpis.selectionContext,
    },
    {
      label: strings.kpis.uniqueListeners,
      value: formatCompactMetric(kpis.uniqueListeners),
      context: strings.kpis.listenerContext,
    },
    {
      label: strings.kpis.topArtist,
      value: kpis.topArtist ?? "—",
      context: strings.kpis.rankingContext,
    },
    {
      label: strings.kpis.topGenre,
      value: kpis.topGenre ?? "—",
      context: strings.kpis.rankingContext,
    },
  ];

  return (
    <div className="mt-8">
      <div
        aria-label={strings.filtersAria}
        className="scroll-mt-32"
        data-tour-target="dashboard-state"
        tabIndex={-1}
      >
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={resetFilters}
          options={options}
          strings={strings}
        />

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{strings.showing}</span>
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <Badge key={filter.label} variant="accent">
                  {filter.label}: {filter.value}
                </Badge>
              ))
            ) : (
              <Badge>{strings.allData}</Badge>
            )}
          </div>
          <p aria-live="polite" className="shrink-0 text-sm text-text-muted">
            {filteredRows.length.toLocaleString(strings.locale)} {strings.recordsOf} {configuration.rows.length.toLocaleString(strings.locale)} {strings.records}
          </p>
        </div>
      </div>

      {filteredRows.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <KPICard demoLabel={strings.demoBadge} key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="mt-5">
            <DashboardModule
              highlighted={highlightedModule === "streaming-trend"}
              moduleId="streaming-trend"
              strings={strings}
            >
              <StreamingTrendChart data={trendData} strings={strings} />
            </DashboardModule>
          </div>

          <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
            <DashboardModule
              highlighted={highlightedModule === "top-artists"}
              moduleId="top-artists"
              strings={strings}
            >
              <TopArtistsChart data={artistRanking} strings={strings} />
            </DashboardModule>
            <DashboardModule
              highlighted={highlightedModule === "genre-distribution"}
              moduleId="genre-distribution"
              strings={strings}
            >
              <GenreDistributionChart data={genreDistribution} strings={strings} />
            </DashboardModule>
          </div>

          <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
            <DashboardModule
              highlighted={highlightedModule === "genre-growth"}
              moduleId="genre-growth"
              strings={strings}
            >
              <GenreGrowthChart result={genreGrowth} strings={strings} />
            </DashboardModule>
            <DashboardModule
              highlighted={highlightedModule === "artist-comparison"}
              moduleId="artist-comparison"
              strings={strings}
            >
              <ArtistComparison data={artistMetrics} strings={strings} />
            </DashboardModule>
          </div>

          <div className="mt-4">
            <DashboardModule
              highlighted={highlightedModule === "track-table"}
              moduleId="track-table"
              strings={strings}
            >
              <TrackTable data={trackData} strings={strings} />
            </DashboardModule>
          </div>
        </>
      ) : (
        <Card className="mt-5 flex flex-col items-start gap-5 p-6 sm:p-8" surface="secondary">
          <div>
            <p className="text-overline">{strings.noDataEyebrow}</p>
            <h3 className="mt-2 text-xl">{strings.noDataTitle}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              {strings.noDataDescription}
            </p>
          </div>
          <Button onClick={resetFilters} variant="secondary">
            {strings.resetFilters}
          </Button>
        </Card>
      )}
    </div>
  );
}
