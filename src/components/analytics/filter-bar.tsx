"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  DashboardFilterKey,
  DashboardFilterOptions,
  DashboardFilterState,
} from "@/types/analytics";

interface FilterBarProps {
  filters: DashboardFilterState;
  onChange: (key: DashboardFilterKey, value: string | null) => void;
  onReset: () => void;
  options: DashboardFilterOptions;
}

const filterDefinitions = [
  { key: "period", label: "Period", allLabel: "All periods" },
  { key: "country", label: "Country", allLabel: "All countries" },
  { key: "genre", label: "Genre", allLabel: "All genres" },
  { key: "artist", label: "Artist", allLabel: "All artists" },
] as const satisfies readonly {
  key: DashboardFilterKey;
  label: string;
  allLabel: string;
}[];

export function FilterBar({ filters, onChange, onReset, options }: FilterBarProps) {
  const activeCount = filterDefinitions.filter(({ key }) => filters[key]).length;

  function controls(idPrefix: string) {
    return filterDefinitions.map(({ allLabel, key, label }) => {
      const id = `${idPrefix}-${key}`;

      return (
        <div key={key}>
          <label className="mb-1.5 block text-xs font-semibold text-text-secondary" htmlFor={id}>
            {label}
          </label>
          <select
            className="min-h-10 w-full rounded-control border border-border bg-surface-primary px-3 text-sm text-text-primary"
            data-tour-filter={key}
            id={id}
            onChange={(event) => onChange(key, event.target.value || null)}
            value={filters[key] ?? ""}
          >
            <option value="">{allLabel}</option>
            {options[key].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    });
  }

  return (
    <Card className="p-4 sm:p-5" surface="secondary">
      <div className="hidden items-end gap-3 md:grid md:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        {controls("desktop-filter")}
        <Button disabled={activeCount === 0} onClick={onReset} variant="secondary">
          Reset filters
        </Button>
      </div>

      <details
        className="group md:hidden"
        data-tour-filter-panel
        open={activeCount > 0 || undefined}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-text-primary">
          <span>Global filters</span>
          <span className="rounded-badge bg-accent-subtle px-2 py-1 text-xs text-accent">
            {activeCount > 0 ? `${activeCount} active` : "All data"}
          </span>
        </summary>
        <div className="mt-4 grid gap-4 border-t border-border pt-4">
          {controls("mobile-filter")}
          <Button disabled={activeCount === 0} onClick={onReset} variant="secondary">
            Reset filters
          </Button>
        </div>
      </details>
    </Card>
  );
}
