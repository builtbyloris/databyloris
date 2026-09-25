import { DASHBOARD_CHART_INTERACTION_EVENT } from "@/lib/dashboard-interactions";
import type { GuidedTourStep } from "@/types/onboarding";

export const SPOTIFY_TOUR_STORAGE_KEY = "databyloris:spotify-tour-status";
export const SPOTIFY_TOUR_SESSION_KEY = "databyloris:spotify-tour-progress";

export const SPOTIFY_TOUR_STEPS = [
  {
    id: "kpi-overview",
    title: "Start with the big picture",
    description:
      "KPIs summarize the current data context before you move into the detailed story.",
    targetSelector: '[data-tour-target="overview-kpis"]',
  },
  {
    id: "insight",
    title: "Follow the data story",
    description:
      "Insights highlight patterns found during the analysis. Activate the real Explore this insight control to continue.",
    targetSelector: '[data-tour-target="insight-explore"]',
    targetActionLabel: "Focus Explore this insight",
    completion: {
      type: "navigation",
      triggerSelector: '[data-tour-action="insight-explore"]',
      destinationSelector: '[data-tour-target="dashboard-state"]',
    },
  },
  {
    id: "dashboard-state",
    title: "See the evidence",
    description:
      "The dashboard opened with the relevant analytical state already applied. The filters and summary show the current context.",
    targetSelector: '[data-tour-target="dashboard-state"]',
  },
  {
    id: "filter-interaction",
    title: "Explore for yourself",
    description:
      "Change the real Country filter to see every dashboard measure and visualization update together.",
    targetSelector: '[data-tour-filter="country"]',
    targetActionLabel: "Focus Country filter",
    completion: {
      type: "change",
      selector: '[data-tour-filter="country"]',
    },
  },
  {
    id: "chart-interaction",
    title: "Inspect the details",
    description:
      "Hover, focus or tap a highlighted point in the real Streaming Trend chart to inspect a specific period.",
    targetSelector: "#dashboard-streaming-trend",
    targetActionLabel: "Focus a chart point",
    completion: {
      type: "event",
      eventName: DASHBOARD_CHART_INTERACTION_EVENT,
    },
  },
] as const satisfies readonly GuidedTourStep[];
