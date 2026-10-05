"use client";

import {useTranslations} from "next-intl";
import type {DashboardFilterState} from "@/lib/dashboard";
import {ALL_FILTER_VALUE, getFilterOptions} from "@/lib/dashboard";
import type {DashboardRecord, FilterConfig} from "@/types";
import {SearchableFilter} from "./searchable-filter";
import {useDashboardText} from "./use-dashboard-text";

const SEARCHABLE_FILTER_THRESHOLD = 50;

export function DashboardFilters({filters, records, filteredCount, activeFilterCount, canReset, state, onChange, onReset}: {
  filters: FilterConfig[];
  records: DashboardRecord[];
  filteredCount: number;
  activeFilterCount: number;
  canReset: boolean;
  state: DashboardFilterState;
  onChange: (id: string, value: string | string[]) => void;
  onReset: () => void;
}) {
  const t = useTranslations("Dashboard");
  const dashboardText = useDashboardText();

  return (
    <section data-dashboard-section="filters" aria-label={t("filters.sectionLabel")} className="w-full min-w-0 max-w-full border-y border-border py-4 sm:py-5">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end">
        <div className="grid w-full min-w-0 max-w-full flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => {
            const options = getFilterOptions(records, filter);
            const filterLabel = dashboardText(filter.label);
            const rawValue = state[filter.id] ?? (filter.type === "multi-select" ? [] : ALL_FILTER_VALUE);
            const value = filter.type === "multi-select"
              ? Array.isArray(rawValue) ? rawValue : rawValue === ALL_FILTER_VALUE ? [] : [String(rawValue)]
              : Array.isArray(rawValue) ? rawValue[0] ?? ALL_FILTER_VALUE : String(rawValue);
            return (
              <div key={filter.id} className="block min-w-0">
                <label htmlFor={`${filter.id}-filter`} className="mb-1.5 block text-xs font-semibold text-muted">{filterLabel}</label>
                {filter.type === "multi-select" || options.length > SEARCHABLE_FILTER_THRESHOLD ? (
                  <SearchableFilter
                    controlId={`${filter.id}-filter`}
                    label={filterLabel}
                    value={value}
                    options={options}
                    multiple={filter.type === "multi-select"}
                    allLabel={t("filters.all")}
                    searchLabel={t("filters.search")}
                    noResultsLabel={t("filters.noResults")}
                    selectedCountLabel={t("filters.selectedCount", {count: Array.isArray(value) ? value.length : 0})}
                    onChange={(nextValue) => onChange(filter.id, nextValue)}
                  />
                ) : (
                  <select
                    id={`${filter.id}-filter`}
                    value={value}
                    onChange={(event) => onChange(filter.id, event.target.value)}
                    className="h-11 w-full appearance-none rounded-control border border-control-border bg-surface px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary"
                  >
                    <option value={ALL_FILTER_VALUE}>{t("filters.all")}</option>
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                )}
              </div>
            );
          })}
        </div>
        {canReset ? <button type="button" onClick={onReset} className="h-11 shrink-0 rounded-control border border-border px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
          {t("filters.reset")}
        </button> : null}
      </div>
      <div aria-live="polite" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
        <span>{t("filters.recordCount", {filtered: filteredCount, total: records.length})}</span>
        {activeFilterCount > 0 ? <span className="text-primary-strong">{t("filters.activeCount", {count: activeFilterCount})}</span> : null}
      </div>
    </section>
  );
}
