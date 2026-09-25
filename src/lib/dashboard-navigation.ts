import {
  EMPTY_DASHBOARD_FILTERS,
  serializeDashboardFilters,
} from "@/lib/dashboard-analytics";
import type {
  DashboardModuleId,
  InsightExploreState,
} from "@/types/analytics";

export const DASHBOARD_MODULE_IDS = [
  "streaming-trend",
  "top-artists",
  "genre-distribution",
  "genre-growth",
  "artist-comparison",
  "track-table",
] as const satisfies readonly DashboardModuleId[];

const DASHBOARD_MODULE_PREFIX = "dashboard-";
export const DASHBOARD_MODULE_QUERY_KEY = "module";

export function getDashboardModuleElementId(moduleId: DashboardModuleId) {
  return `${DASHBOARD_MODULE_PREFIX}${moduleId}`;
}

export function getDashboardModuleIdFromHash(hash: string) {
  const value = decodeURIComponent(hash.replace(/^#/, ""));
  if (!value.startsWith(DASHBOARD_MODULE_PREFIX)) return null;

  return getDashboardModuleId(value.slice(DASHBOARD_MODULE_PREFIX.length));
}

export function getDashboardModuleId(value: string | null) {
  return value && DASHBOARD_MODULE_IDS.includes(value as DashboardModuleId)
    ? (value as DashboardModuleId)
    : null;
}

export function buildInsightExploreHref(
  projectPath: string,
  state: InsightExploreState,
) {
  const filters = { ...EMPTY_DASHBOARD_FILTERS, ...state.filters };
  const searchParams = new URLSearchParams(serializeDashboardFilters(filters));
  if (state.target) {
    searchParams.set(DASHBOARD_MODULE_QUERY_KEY, state.target);
  }
  const hash = state.target
    ? getDashboardModuleElementId(state.target)
    : "explore";
  const query = searchParams.toString();

  return `${projectPath}${query ? `?${query}` : ""}#${hash}`;
}
