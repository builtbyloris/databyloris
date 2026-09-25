import { SPOTIFY_DEMO_PROJECT } from "@/data/projects";
import {
  SPOTIFY_TOUR_SESSION_KEY,
  SPOTIFY_TOUR_STEPS,
  SPOTIFY_TOUR_STORAGE_KEY,
} from "@/data/spotify-tour";
import type { GuidedTourStep } from "@/types/onboarding";
import type { ProjectDetail } from "@/types/project";

export interface ProjectImplementation {
  project: ProjectDetail;
  tour?: {
    sessionKey: string;
    steps: readonly GuidedTourStep[];
    storageKey: string;
  };
}

export const implementedProjects = {
  "spotify-listening-trends": {
    project: SPOTIFY_DEMO_PROJECT,
    tour: {
      sessionKey: SPOTIFY_TOUR_SESSION_KEY,
      steps: SPOTIFY_TOUR_STEPS,
      storageKey: SPOTIFY_TOUR_STORAGE_KEY,
    },
  },
} satisfies Record<string, ProjectImplementation>;

export function getProjectImplementation(slug: string) {
  return implementedProjects[slug as keyof typeof implementedProjects];
}
