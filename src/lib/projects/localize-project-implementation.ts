import type { PublicDictionary } from "@/i18n/types";
import type { ProjectAnalyticsImplementation } from "@/types/project";

export function localizeProjectImplementation(
  implementation: ProjectAnalyticsImplementation,
  spotify: PublicDictionary["spotify"],
): ProjectAnalyticsImplementation {
  return {
    ...implementation,
    dataset: {
      ...implementation.dataset,
      name: spotify.dataset.name,
      summary: spotify.dataset.summary,
      entities: spotify.dataset.entities,
      categories: spotify.dataset.categories,
      markets: spotify.dataset.markets,
    },
    dashboard: {
      ...implementation.dashboard,
      datasetLabel: spotify.dataset.dashboardLabel,
      datasetDescription: spotify.dataset.dashboardDescription,
    },
    overview: spotify.overview,
    insights: spotify.insights,
    methodology: spotify.methodology,
    tour: implementation.tour
      ? { ...implementation.tour, steps: spotify.tourSteps }
      : undefined,
  };
}
