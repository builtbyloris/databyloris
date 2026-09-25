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

interface DashboardShellProps {
  configuration: DashboardConfiguration;
}

const filterLabels: Record<DashboardFilterKey, string> = {
  period: "Period",
  country: "Country",
  genre: "Genre",
  artist: "Artist",
};

const moduleLabels: Record<DashboardModuleId, string> = {
  "streaming-trend": "Streaming Trend",
  "top-artists": "Top Artists",
  "genre-distribution": "Genre Distribution",
  "genre-growth": "Genre Growth",
  "artist-comparison": "Artist Comparison",
  "track-table": "Track Table",
};

interface DashboardModuleProps {
  children: ReactNode;
  highlighted: boolean;
  moduleId: DashboardModuleId;
}

function DashboardModule({
  children,
  highlighted,
  moduleId,
}: DashboardModuleProps) {
  const label = moduleLabels[moduleId];

  return (
    <section
      aria-label={`${label} dashboard module`}
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
          Insight focus
        </span>
      ) : null}
      {children}
    </section>
  );
}

export function DashboardShell({ configuration }: DashboardShellProps) {
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
    .map(([key, value]) => ({ label: filterLabels[key], value }));

  const kpiCards = [
    {
      label: "Total Streams",
      value: formatCompactMetric(kpis.totalStreams),
      context: "Across the current synthetic selection",
    },
    {
      label: "Unique Listeners",
      value: formatCompactMetric(kpis.uniqueListeners),
      context: "Illustrative additive listener cohorts",
    },
    {
      label: "Top Artist",
      value: kpis.topArtist ?? "—",
      context: "Ranked by illustrative streams",
    },
    {
      label: "Top Genre",
      value: kpis.topGenre ?? "—",
      context: "Ranked by illustrative streams",
    },
  ];

  return (
    <div className="mt-8">
      <div
        aria-label="Dashboard filters and active selection"
        className="scroll-mt-32"
        data-tour-target="dashboard-state"
        tabIndex={-1}
      >
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={resetFilters}
          options={options}
        />

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">Showing:</span>
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <Badge key={filter.label} variant="accent">
                  {filter.label}: {filter.value}
                </Badge>
              ))
            ) : (
              <Badge>All data</Badge>
            )}
          </div>
          <p aria-live="polite" className="shrink-0 text-sm text-text-muted">
            {filteredRows.length.toLocaleString("en-US")} of {configuration.rows.length.toLocaleString("en-US")} records
          </p>
        </div>
      </div>

      {filteredRows.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <KPICard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="mt-5">
            <DashboardModule
              highlighted={highlightedModule === "streaming-trend"}
              moduleId="streaming-trend"
            >
              <StreamingTrendChart data={trendData} />
            </DashboardModule>
          </div>

          <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
            <DashboardModule
              highlighted={highlightedModule === "top-artists"}
              moduleId="top-artists"
            >
              <TopArtistsChart data={artistRanking} />
            </DashboardModule>
            <DashboardModule
              highlighted={highlightedModule === "genre-distribution"}
              moduleId="genre-distribution"
            >
              <GenreDistributionChart data={genreDistribution} />
            </DashboardModule>
          </div>

          <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
            <DashboardModule
              highlighted={highlightedModule === "genre-growth"}
              moduleId="genre-growth"
            >
              <GenreGrowthChart result={genreGrowth} />
            </DashboardModule>
            <DashboardModule
              highlighted={highlightedModule === "artist-comparison"}
              moduleId="artist-comparison"
            >
              <ArtistComparison data={artistMetrics} />
            </DashboardModule>
          </div>

          <div className="mt-4">
            <DashboardModule
              highlighted={highlightedModule === "track-table"}
              moduleId="track-table"
            >
              <TrackTable data={trackData} />
            </DashboardModule>
          </div>
        </>
      ) : (
        <Card className="mt-5 flex flex-col items-start gap-5 p-6 sm:p-8" surface="secondary">
          <div>
            <p className="text-overline">No matching data</p>
            <h3 className="mt-2 text-xl">This filter combination has no records.</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Try changing one of the active dimensions or reset the dashboard to return to
              the complete synthetic dataset.
            </p>
          </div>
          <Button onClick={resetFilters} variant="secondary">
            Reset filters
          </Button>
        </Card>
      )}
    </div>
  );
}
