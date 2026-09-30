import {validateDashboardConfig} from "@/lib/admin";
import type {DashboardConfig} from "@/types";
import type {Json} from "@/types/database";

function isRecord(value: unknown): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function dashboardConfigFromJson(value: Json): DashboardConfig | null {
  if (
    !isRecord(value)
    || typeof value.id !== "string"
    || typeof value.datasetId !== "string"
    || !Array.isArray(value.filters)
    || !Array.isArray(value.kpis)
    || !Array.isArray(value.charts)
    || !Array.isArray(value.rankings)
    || !value.filters.every(isRecord)
    || !value.kpis.every(isRecord)
    || !value.charts.every(isRecord)
    || !isRecord(value.layout)
    || typeof value.layout.featuredChartId !== "string"
    || !value.rankings.every((ranking) => (
      isRecord(ranking)
      && Array.isArray(ranking.detailColumns)
      && ranking.detailColumns.every(isRecord)
    ))
  ) {
    return null;
  }

  const config = value as unknown as DashboardConfig;
  return validateDashboardConfig(config, []).length === 0 ? config : null;
}

export function dashboardConfigToJson(config: DashboardConfig): Json {
  return JSON.parse(JSON.stringify(config)) as Json;
}
