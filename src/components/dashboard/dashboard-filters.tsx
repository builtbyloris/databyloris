"use client";

import {useTranslations} from "next-intl";
import type {DashboardFilterState} from "@/lib/dashboard";
import {ALL_FILTER_VALUE, getFilterOptions} from "@/lib/dashboard";
import type {DashboardRecord, FilterConfig} from "@/types";

export function DashboardFilters({filters, records, state, onChange, onReset}: {
  filters: FilterConfig[];
  records: DashboardRecord[];
  state: DashboardFilterState;
  onChange: (id: string, value: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations("Dashboard");

  return (
    <div className="rounded-card border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => (
            <label key={filter.id} className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{t(filter.label)}</span>
              <select
                value={String(state[filter.id] ?? ALL_FILTER_VALUE)}
                onChange={(event) => onChange(filter.id, event.target.value)}
                className="h-11 w-full appearance-none rounded-control border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus:border-primary"
              >
                <option value={ALL_FILTER_VALUE}>{t("filters.all")}</option>
                {getFilterOptions(records, filter).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          ))}
        </div>
        <button type="button" onClick={onReset} className="h-11 shrink-0 rounded-control border border-border px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
          {t("filters.reset")}
        </button>
      </div>
    </div>
  );
}
