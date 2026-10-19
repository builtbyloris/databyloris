"use client";

import {useEffect, useMemo} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import {ALL_FILTER_VALUE, getFilterOptions, type DashboardFilterState} from "@/lib/dashboard";
import type {DashboardConfig, DashboardRecord} from "@/types";
import {createInitialDashboardFilters, equalDashboardFilterValues} from "./dashboard-filter-state";
import {DashboardShell} from "./dashboard-shell";

const PARAM_PREFIX = "filter.";

function readFilters(config: DashboardConfig, records: DashboardRecord[], params: URLSearchParams): DashboardFilterState {
  const defaults = createInitialDashboardFilters(config);
  const state: DashboardFilterState = {...defaults};
  for (const filter of config.filters) {
    const incoming = params.getAll(`${PARAM_PREFIX}${filter.id}`);
    if (incoming.length === 0) continue;
    if (incoming.includes(ALL_FILTER_VALUE)) {
      state[filter.id] = filter.type === "multi-select" ? [] : ALL_FILTER_VALUE;
      continue;
    }
    const allowed = new Set(getFilterOptions(records, filter).map((option) => option.value));
    const valid = [...new Set(incoming.filter((value) => allowed.has(value)))].sort();
    if (valid.length === 0) continue;
    state[filter.id] = filter.type === "multi-select" ? valid : valid[0];
  }
  return state;
}

function filterHref(pathname: string, config: DashboardConfig, defaults: DashboardFilterState, state: DashboardFilterState) {
  const params = new URLSearchParams();
  for (const filter of config.filters) {
    const value = state[filter.id];
    if (equalDashboardFilterValues(value, defaults[filter.id])) continue;
    const values = Array.isArray(value)
      ? value.length ? [...value].sort() : [ALL_FILTER_VALUE]
      : [value];
    for (const selected of values) params.append(`${PARAM_PREFIX}${filter.id}`, selected);
  }
  return `${pathname}${params.size ? `?${params}` : ""}`;
}

export function DashboardUrlState({project, config, records}: {
  project: {slug: string; title: string};
  config: DashboardConfig;
  records: DashboardRecord[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaults = useMemo(() => createInitialDashboardFilters(config), [config]);
  const state = useMemo(() => readFilters(config, records, new URLSearchParams(searchParams.toString())), [config, records, searchParams]);
  const canonicalHref = filterHref(pathname, config, defaults, state);

  useEffect(() => {
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== canonicalHref) window.history.replaceState(null, "", canonicalHref);
  }, [canonicalHref]);

  const update = (next: DashboardFilterState) => {
    const href = filterHref(pathname, config, defaults, next);
    if (href !== `${window.location.pathname}${window.location.search}`) window.history.pushState(null, "", href);
  };

  return <DashboardShell project={project} config={config} records={records} urlFilters={{
    state,
    onChange: (id, value) => update({...state, [id]: value}),
    onReset: () => update(defaults),
  }} />;
}
