import {listeningInsightsDashboard} from "./listening-insights-dashboard";
import {listeningInsightsData} from "./listening-insights-data";
import {videoGameSalesDashboard} from "./video-game-sales-dashboard";
import {videoGameSalesData} from "./video-game-sales-data";
import type {DashboardConfig, DashboardRecord} from "@/types";

export interface DashboardDefinition {
  config: DashboardConfig;
  data: DashboardRecord[];
}

export const dashboardRegistry: Record<string, DashboardDefinition> = {
  "listening-insights": {
    config: listeningInsightsDashboard,
    data: listeningInsightsData,
  },
  "video-game-sales": {
    config: videoGameSalesDashboard,
    data: videoGameSalesData,
  },
};

export function getDashboardBySlug(slug: string) {
  return dashboardRegistry[slug];
}
