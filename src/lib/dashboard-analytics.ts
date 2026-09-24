import type {
  DashboardFilterKey,
  DashboardFilterOptions,
  DashboardFilterState,
  DashboardKPIResult,
  DashboardRow,
  FilterOption,
} from "@/types/analytics";

export const DASHBOARD_FILTER_KEYS = [
  "period",
  "country",
  "genre",
  "artist",
] as const satisfies readonly DashboardFilterKey[];

export const EMPTY_DASHBOARD_FILTERS: DashboardFilterState = {
  period: null,
  country: null,
  genre: null,
  artist: null,
};

interface SearchParamsReader {
  get(name: string): string | null;
}

function uniqueOptions(values: readonly string[]): FilterOption[] {
  return [...new Set(values)]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ label: value, value }));
}

export function createDashboardFilterOptions(
  rows: readonly DashboardRow[],
): DashboardFilterOptions {
  return {
    period: uniqueOptions(rows.map((row) => String(row.year))),
    country: uniqueOptions(rows.map((row) => row.country)),
    genre: uniqueOptions(rows.map((row) => row.genre)),
    artist: uniqueOptions(rows.map((row) => row.artistName)),
  };
}

export function parseDashboardFilters(
  searchParams: SearchParamsReader,
  options: DashboardFilterOptions,
): DashboardFilterState {
  return DASHBOARD_FILTER_KEYS.reduce<DashboardFilterState>(
    (filters, key) => {
      const value = searchParams.get(key);
      const valid = options[key].some((option) => option.value === value);
      filters[key] = valid ? value : null;
      return filters;
    },
    { ...EMPTY_DASHBOARD_FILTERS },
  );
}

export function serializeDashboardFilters(filters: DashboardFilterState) {
  const searchParams = new URLSearchParams();

  DASHBOARD_FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    if (value) {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}

export function filterDashboardRows(
  rows: readonly DashboardRow[],
  filters: DashboardFilterState,
) {
  return rows.filter((row) => {
    return (
      (!filters.period || String(row.year) === filters.period) &&
      (!filters.country || row.country === filters.country) &&
      (!filters.genre || row.genre === filters.genre) &&
      (!filters.artist || row.artistName === filters.artist)
    );
  });
}

function findTopValue(
  rows: readonly DashboardRow[],
  getLabel: (row: DashboardRow) => string,
) {
  const totals = new Map<string, number>();

  rows.forEach((row) => {
    const label = getLabel(row);
    totals.set(label, (totals.get(label) ?? 0) + row.streams);
  });

  return [...totals.entries()].sort(
    ([labelA, valueA], [labelB, valueB]) =>
      valueB - valueA || labelA.localeCompare(labelB),
  )[0]?.[0] ?? null;
}

export function calculateDashboardKpis(
  rows: readonly DashboardRow[],
): DashboardKPIResult {
  return {
    totalStreams: rows.reduce((total, row) => total + row.streams, 0),
    uniqueListeners: rows.reduce((total, row) => total + row.listeners, 0),
    topArtist: findTopValue(rows, (row) => row.artistName),
    topGenre: findTopValue(rows, (row) => row.genre),
  };
}

export function formatCompactMetric(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}
