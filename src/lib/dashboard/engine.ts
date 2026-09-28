import type {
  AggregationType,
  ChartConfig,
  DashboardRecord,
  FilterConfig,
  KPIConfig,
  RankingConfig,
} from "@/types";

export const ALL_FILTER_VALUE = "__all__";
export type DashboardFilterState = Record<string, string | string[]>;

export interface AggregatedPoint {
  category: string | number;
  value: number;
}

export interface RankingRow {
  dimension: string;
  details: Record<string, string>;
  value: number;
}

function numericValues(records: DashboardRecord[], field?: string) {
  if (!field) return [];
  return records
    .map((record) => record[field])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function aggregateRecords(records: DashboardRecord[], aggregation: AggregationType, field?: string) {
  if (aggregation === "count") return records.length;
  if (!field) return 0;
  if (aggregation === "distinctCount") {
    return new Set(records.map((record) => record[field]).filter((value) => value !== null && value !== undefined)).size;
  }

  const values = numericValues(records, field);
  if (aggregation === "average") {
    const average = values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
    return Number(average.toFixed(4));
  }
  return Number(values.reduce((total, value) => total + value, 0).toFixed(4));
}

export function applyDashboardFilters(
  records: DashboardRecord[],
  filters: FilterConfig[],
  state: DashboardFilterState,
) {
  return records.filter((record) =>
    filters.every((filter) => {
      const selected = state[filter.id];
      if (!selected || selected === ALL_FILTER_VALUE) return true;
      if (Array.isArray(selected)) {
        return selected.length === 0 || selected.includes(String(record[filter.field]));
      }
      return String(record[filter.field]) === selected;
    }),
  );
}

export function getFilterOptions(records: DashboardRecord[], filter: FilterConfig) {
  if (filter.options) return filter.options;
  const values = Array.from(
    new Set(
      records
        .map((record) => record[filter.field])
        .filter((value): value is string | number => typeof value === "string" || typeof value === "number"),
    ),
  );

  values.sort((left, right) => {
    if (typeof left === "number" && typeof right === "number") return right - left;
    return String(left).localeCompare(String(right));
  });

  return values.map((value) => ({label: String(value), value: String(value)}));
}

export function calculateKpis(records: DashboardRecord[], configs: KPIConfig[]) {
  return configs.map((config) => ({
    config,
    value: aggregateRecords(records, config.aggregation, config.field),
  }));
}

export function prepareChartData(records: DashboardRecord[], config: ChartConfig): AggregatedPoint[] {
  const groups = new Map<string | number, DashboardRecord[]>();
  for (const record of records) {
    const rawCategory = record[config.categoryField];
    if (typeof rawCategory !== "string" && typeof rawCategory !== "number") continue;
    const group = groups.get(rawCategory) ?? [];
    group.push(record);
    groups.set(rawCategory, group);
  }

  const points = Array.from(groups, ([category, group]) => ({
    category,
    value: aggregateRecords(group, config.aggregation, config.valueField),
  }));

  points.sort((left, right) => {
    if (config.sort === "value-asc") return left.value - right.value;
    if (config.sort === "value-desc") return right.value - left.value;
    if (config.sort === "category-desc") return String(right.category).localeCompare(String(left.category), undefined, {numeric: true});
    return String(left.category).localeCompare(String(right.category), undefined, {numeric: true});
  });

  return config.limit ? points.slice(0, config.limit) : points;
}

export function calculateRanking(records: DashboardRecord[], config: RankingConfig): RankingRow[] {
  const groups = new Map<string, DashboardRecord[]>();
  for (const record of records) {
    const dimension = record[config.dimension];
    if (dimension === null || dimension === undefined) continue;
    const key = String(dimension);
    groups.set(key, [...(groups.get(key) ?? []), record]);
  }

  return Array.from(groups, ([dimension, group]) => ({
    dimension,
    details: Object.fromEntries(
      config.detailColumns.map(({field}) => [field, String(group[0]?.[field] ?? "—")]),
    ),
    value: aggregateRecords(group, config.aggregation, config.metric),
  }))
    .sort((left, right) => config.sortDirection === "desc" ? right.value - left.value : left.value - right.value)
    .slice(0, config.limit);
}
