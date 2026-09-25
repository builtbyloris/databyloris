import { SPOTIFY_DASHBOARD } from "@/data/spotify-demo-dataset";
import { SPOTIFY_INSIGHTS } from "@/data/spotify-insights";
import { SPOTIFY_METHODOLOGY } from "@/data/spotify-methodology";
import { SPOTIFY_OVERVIEW } from "@/data/spotify-overview";
import {
  SPOTIFY_TOUR_SESSION_KEY,
  SPOTIFY_TOUR_STEPS,
  SPOTIFY_TOUR_STORAGE_KEY,
} from "@/data/spotify-tour";
import type { ProjectAnalyticsImplementation } from "@/types/project";

import { SPOTIFY_PROJECT_SLUG } from "./project-identifiers";

export const implementedProjects = {
  [SPOTIFY_PROJECT_SLUG]: {
    dataset: {
      name: "Spotify listening trends demo dataset",
      summary:
        "An illustrative streaming dataset configured to demonstrate the project story and exploration experience.",
      entities: "Artists and tracks",
      categories: "Genres",
      markets: "Countries",
      illustrative: true,
    },
    dashboard: SPOTIFY_DASHBOARD,
    overview: SPOTIFY_OVERVIEW,
    insights: SPOTIFY_INSIGHTS,
    methodology: SPOTIFY_METHODOLOGY,
    tour: {
      sessionKey: SPOTIFY_TOUR_SESSION_KEY,
      steps: SPOTIFY_TOUR_STEPS,
      storageKey: SPOTIFY_TOUR_STORAGE_KEY,
    },
  },
} satisfies Record<string, ProjectAnalyticsImplementation>;

export function getProjectImplementation(slug: string) {
  return implementedProjects[slug as keyof typeof implementedProjects];
}
