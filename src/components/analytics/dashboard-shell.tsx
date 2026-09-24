"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FilterBar } from "@/components/analytics/filter-bar";
import { KPICard } from "@/components/analytics/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  calculateDashboardKpis,
  createDashboardFilterOptions,
  EMPTY_DASHBOARD_FILTERS,
  filterDashboardRows,
  formatCompactMetric,
  parseDashboardFilters,
  serializeDashboardFilters,
} from "@/lib/dashboard-analytics";
import type {
  DashboardConfiguration,
  DashboardFilterKey,
  DashboardFilterState,
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

const placeholderModules = [
  {
    title: "Streaming activity",
    description: "A time-series module will show how the current selection changes month by month.",
    size: "lg:col-span-2",
  },
  {
    title: "Audience composition",
    description: "A comparison module will break the current selection down by its leading dimensions.",
    size: "",
  },
  {
    title: "Top performers",
    description: "A ranking module will surface the strongest artists and tracks for this selection.",
    size: "",
  },
] as const;

export function DashboardShell({ configuration }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
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
          {filteredRows.length.toLocaleString()} of {configuration.rows.length.toLocaleString()} records
        </p>
      </div>

      {filteredRows.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <KPICard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {placeholderModules.map((module) => (
              <Card className={`min-h-44 p-5 sm:p-6 ${module.size}`} key={module.title} surface="primary">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Chart module
                  </p>
                </div>
                <h3 className="mt-5 text-lg">{module.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  {module.description}
                </p>
                <p className="mt-5 text-xs text-text-muted">Ready for the next dashboard phase</p>
              </Card>
            ))}
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
