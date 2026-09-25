import type { ProjectMethodologyData } from "@/types/project";

export const SPOTIFY_METHODOLOGY = {
  title: "How the demo analysis works",
  introduction:
    "A transparent view of the synthetic dataset, preparation choices and analytical methods behind this demonstration.",
  objective:
    "This demo explores listening patterns across time, artists, genres and markets while showing how databyloris connects an editorial data story to an interactive analytics workspace.",
  dataset: {
    description:
      "A deterministic synthetic listening dataset created locally for the product demonstration. No real Spotify activity, catalog data or user records were collected.",
    grain: "One track × one country × one month",
    period: "January 2022–December 2025",
    dimensions: ["Month and year", "Track", "Artist", "Genre", "Country"],
    metrics: ["Streams", "Listeners", "Popularity", "Playlist reach"],
  },
  preparation: [
    "Generate the same synthetic rows from a fixed set of track, artist, genre and market inputs on every run.",
    "Derive consistent month and year fields so the data can support chronological filtering and trend analysis.",
    "Store one aggregation-ready row for each track, country and month combination.",
    "Check ranges, identifiers and coverage so values remain internally consistent across the full demo period.",
  ],
  techniques: [
    {
      label: "Aggregation",
      description: "Sum measures across the rows included in the current selection.",
    },
    {
      label: "Ranking",
      description: "Order artists, genres and tracks by illustrative stream totals.",
    },
    {
      label: "Trend analysis",
      description: "Compare monthly activity in chronological order from 2022 through 2025.",
    },
    {
      label: "Growth analysis",
      description: "Measure relative change between the earliest and latest available periods.",
    },
    {
      label: "Segmentation",
      description: "Break the selection down by artist, genre, country or time period.",
    },
    {
      label: "Comparison",
      description: "Evaluate selected artists and markets using the same metric definitions.",
    },
  ],
  metricDefinitions: [
    {
      label: "Streams",
      description: "The illustrative number of track plays represented by the current rows.",
    },
    {
      label: "Unique Listeners",
      description:
        "An illustrative listener count aggregated for the current selection; it is not based on person-level identities.",
    },
    {
      label: "Popularity",
      description:
        "A synthetic 1–100 index used to compare relative track momentum within the demo.",
    },
    {
      label: "Playlist Reach",
      description:
        "An illustrative estimate of the audience potentially reached through playlist placement.",
    },
    {
      label: "Growth",
      description:
        "The percentage change between the earliest and latest comparable periods in a selection.",
    },
  ],
  tools: [
    {
      label: "Next.js",
      description: "Application routing, rendering and the reusable public project experience.",
    },
    {
      label: "TypeScript",
      description: "Typed project content, dashboard rows, filters and analytical results.",
    },
    {
      label: "Recharts",
      description: "Responsive dashboard visualizations built from the filtered local dataset.",
    },
    {
      label: "Local synthetic analytics data",
      description: "Deterministic demonstration data generated and processed in the application.",
    },
  ],
  limitations: [
    "The dataset is entirely synthetic and was created only for this product demonstration.",
    "Every finding and value is illustrative and must not be interpreted as a real Spotify statistic.",
    "The simplified tracks, artists, genres and markets do not represent Spotify's complete catalog or user behavior.",
    "The demo favors clear storytelling and interaction patterns over production-scale data complexity.",
  ],
  takeaways: [
    "A project can lead with a clear analytical question before introducing detailed exploration.",
    "Authored insights can connect directly to the filters and visual evidence that support them.",
    "Transparent methodology helps visitors understand what the data can—and cannot—show.",
  ],
} satisfies ProjectMethodologyData;
