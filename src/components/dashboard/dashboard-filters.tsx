"use client";

import {useTranslations} from "next-intl";
import type {DashboardFilterState} from "@/lib/dashboard";
import {ALL_FILTER_VALUE, getFilterOptions} from "@/lib/dashboard";
import type {DashboardRecord, FilterConfig} from "@/types";
import {SearchableFilter} from "./searchable-filter";

const SEARCHABLE_FILTER_THRESHOLD = 50;

export function DashboardFilters({filters, records, state, onChange, onReset}: {
  filters: FilterConfig[];
  records: DashboardRecord[];
  state: DashboardFilterState;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations("Dashboard");
  const label = (value: string) => t.has(value) ? t(value) : value;

  return (
    <div data-dashboard-section="filters" className="w-full min-w-0 max-w-full rounded-card border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end">
        <div className="grid w-full min-w-0 max-w-full flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => {
            const options = getFilterOptions(records, filter);
            const filterLabel = label(filter.label);
            const value = String(state[filter.id] ?? ALL_FILTER_VALUE);
            return (
              <div key={filter.id} className="block min-w-0">
                <label htmlFor={`${filter.id}-filter`} className="mb-1.5 block text-xs font-semibold text-muted">{filterLabel}</label>
                {options.length > SEARCHABLE_FILTER_THRESHOLD ? (
                  <SearchableFilter
                    controlId={`${filter.id}-filter`}
                    label={filterLabel}
                    value={value}
                    options={options}
                    allLabel={t("filters.all")}
                    searchLabel={t("filters.search")}
                    noResultsLabel={t("filters.noResults")}
                    onChange={(nextValue) => onChange(filter.id, nextValue)}
                  />
                ) : (
                  <select
                    id={`${filter.id}-filter`}
                    value={value}
                    onChange={(event) => onChange(filter.id, event.target.value)}
                    className="h-11 w-full appearance-none rounded-control border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus:border-primary"
                  >
                    <option value={ALL_FILTER_VALUE}>{t("filters.all")}</option>
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                )}
              </div>
            );
          })}
        </div>
        <button type="button" onClick={onReset} className="h-11 shrink-0 rounded-control border border-border px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
          {t("filters.reset")}
        </button>
      </div>
    </div>
  );
}
