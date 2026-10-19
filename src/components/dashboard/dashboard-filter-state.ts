import {ALL_FILTER_VALUE, type DashboardFilterState} from "@/lib/dashboard";
import type {DashboardConfig} from "@/types";

export function createInitialDashboardFilters(config: DashboardConfig): DashboardFilterState {
  return Object.fromEntries(config.filters.map((filter) => {
    const fallback = filter.type === "multi-select" ? [] : ALL_FILTER_VALUE;
    const value = filter.defaultValue ?? fallback;
    return [filter.id, Array.isArray(value) ? [...value] : value];
  }));
}

export function equalDashboardFilterValues(left: string | string[] | undefined, right: string | string[] | undefined) {
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    const sortedLeft = [...left].sort();
    const sortedRight = [...right].sort();
    return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
  }
  return left === right;
}
