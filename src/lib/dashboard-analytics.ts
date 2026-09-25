import type {
  ArtistComparisonMetric,
  ArtistRankingItem,
  DashboardFilterKey,
  DashboardFilterOptions,
  DashboardFilterState,
  DashboardKPIResult,
  DashboardRow,
  FilterOption,
  GenreDistributionItem,
  GenreGrowthResult,
  MonthlyStreamsPoint,
  TrackAggregate,
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

export function aggregateMonthlyStreams(
  rows: readonly DashboardRow[],
): MonthlyStreamsPoint[] {
  const totals = new Map<string, number>();

  rows.forEach((row) => {
    totals.set(row.month, (totals.get(row.month) ?? 0) + row.streams);
  });

  return [...totals.entries()]
    .sort(([periodA], [periodB]) => periodA.localeCompare(periodB))
    .map(([period, streams]) => ({ period, streams }));
}

export function aggregateArtistStreams(
  rows: readonly DashboardRow[],
): ArtistRankingItem[] {
  const totals = new Map<string, number>();

  rows.forEach((row) => {
    totals.set(row.artistName, (totals.get(row.artistName) ?? 0) + row.streams);
  });

  return [...totals.entries()]
    .sort(
      ([artistA, streamsA], [artistB, streamsB]) =>
        streamsB - streamsA || artistA.localeCompare(artistB),
    )
    .map(([artistName, streams]) => ({ artistName, streams }));
}

export function aggregateGenreDistribution(
  rows: readonly DashboardRow[],
): GenreDistributionItem[] {
  const totals = new Map<string, number>();
  const totalStreams = rows.reduce((total, row) => total + row.streams, 0);

  rows.forEach((row) => {
    totals.set(row.genre, (totals.get(row.genre) ?? 0) + row.streams);
  });

  return [...totals.entries()]
    .sort(
      ([genreA, streamsA], [genreB, streamsB]) =>
        streamsB - streamsA || genreA.localeCompare(genreB),
    )
    .map(([genre, streams]) => ({
      genre,
      streams,
      percentage: totalStreams > 0 ? (streams / totalStreams) * 100 : 0,
    }));
}

export function calculateGenreGrowth(
  rows: readonly DashboardRow[],
): GenreGrowthResult {
  const periods = [...new Set(rows.map((row) => row.month))].sort();

  if (periods.length < 2) {
    return {
      status: "insufficient",
      reason: "Select at least two months to compare genre growth.",
      items: [],
    };
  }

  const earliestPeriod = periods[0];
  const latestPeriod = periods.at(-1)!;
  const totals = new Map<
    string,
    { earliest: number; latest: number; total: number }
  >();

  rows.forEach((row) => {
    const current = totals.get(row.genre) ?? {
      earliest: 0,
      latest: 0,
      total: 0,
    };
    current.total += row.streams;
    if (row.month === earliestPeriod) current.earliest += row.streams;
    if (row.month === latestPeriod) current.latest += row.streams;
    totals.set(row.genre, current);
  });

  const items = [...totals.entries()]
    .flatMap(([genre, values]) => {
      if (values.earliest <= 0 || values.latest <= 0) return [];
      const growthPercent =
        ((values.latest - values.earliest) / values.earliest) * 100;
      if (!Number.isFinite(growthPercent)) return [];

      return [
        {
          genre,
          growthPercent,
          earliestStreams: values.earliest,
          latestStreams: values.latest,
          totalStreams: values.total,
        },
      ];
    })
    .sort(
      (itemA, itemB) =>
        itemB.growthPercent - itemA.growthPercent ||
        itemA.genre.localeCompare(itemB.genre),
    );

  if (items.length === 0) {
    return {
      status: "insufficient",
      reason: "The current selection has no genres with data in both boundary months.",
      items: [],
    };
  }

  return { status: "ready", earliestPeriod, latestPeriod, items };
}

export function aggregateArtistMetrics(
  rows: readonly DashboardRow[],
): ArtistComparisonMetric[] {
  const totals = new Map<
    string,
    {
      streams: number;
      listeners: number;
      popularityTotal: number;
      popularityCount: number;
      playlistReach: number;
    }
  >();

  rows.forEach((row) => {
    const current = totals.get(row.artistName) ?? {
      streams: 0,
      listeners: 0,
      popularityTotal: 0,
      popularityCount: 0,
      playlistReach: 0,
    };
    current.streams += row.streams;
    current.listeners += row.listeners;
    current.popularityTotal += row.popularity;
    current.popularityCount += 1;
    current.playlistReach += row.playlistReach;
    totals.set(row.artistName, current);
  });

  return [...totals.entries()]
    .map(([artistName, values]) => ({
      artistName,
      totalStreams: values.streams,
      uniqueListeners: values.listeners,
      averagePopularity:
        values.popularityCount > 0
          ? values.popularityTotal / values.popularityCount
          : 0,
      playlistReach: values.playlistReach,
    }))
    .sort(
      (artistA, artistB) =>
        artistB.totalStreams - artistA.totalStreams ||
        artistA.artistName.localeCompare(artistB.artistName),
    );
}

export function aggregateTracks(rows: readonly DashboardRow[]): TrackAggregate[] {
  const totals = new Map<
    string,
    TrackAggregate & { popularityTotal: number; popularityCount: number }
  >();

  rows.forEach((row) => {
    const current = totals.get(row.trackId) ?? {
      trackId: row.trackId,
      trackName: row.trackName,
      artistName: row.artistName,
      genre: row.genre,
      streams: 0,
      listeners: 0,
      popularity: 0,
      popularityTotal: 0,
      popularityCount: 0,
    };
    current.streams += row.streams;
    current.listeners += row.listeners;
    current.popularityTotal += row.popularity;
    current.popularityCount += 1;
    totals.set(row.trackId, current);
  });

  return [...totals.values()]
    .map(({ popularityCount, popularityTotal, ...track }) => ({
      ...track,
      popularity: popularityCount > 0 ? popularityTotal / popularityCount : 0,
    }))
    .sort(
      (trackA, trackB) =>
        trackB.streams - trackA.streams ||
        trackA.trackName.localeCompare(trackB.trackName),
    );
}

export function formatCompactMetric(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);
}
