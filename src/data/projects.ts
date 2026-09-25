import type { ProjectDetail, ProjectSummary } from "@/types/project";

import { SPOTIFY_DASHBOARD } from "./spotify-demo-dataset";
import { SPOTIFY_INSIGHTS } from "./spotify-insights";
import { SPOTIFY_METHODOLOGY } from "./spotify-methodology";
import { SPOTIFY_OVERVIEW } from "./spotify-overview";

const SPOTIFY_PROJECT_PATH = "/projects/spotify-listening-trends";

export const SPOTIFY_PROJECT_SUMMARY = {
  slug: "spotify-listening-trends",
  title: "Spotify Listening Trends",
  category: "Music",
  description:
    "Explore listening patterns, artists, genres, markets and trends through an interactive data story.",
  question: "What can streaming data tell us about how people listen?",
  coverType: "listening",
  period: "2022–2025",
  tags: ["Artists", "Genres", "Countries"],
  featured: true,
  demo: true,
  status: "published",
  href: SPOTIFY_PROJECT_PATH,
} satisfies ProjectSummary;

export const SPOTIFY_DEMO_PROJECT = {
  ...SPOTIFY_PROJECT_SUMMARY,
  subtitle: "An interactive data story about streaming behavior across time and markets.",
  dataset: {
    name: "Spotify listening trends demo dataset",
    summary:
      "An illustrative streaming dataset configured to demonstrate the project story and future exploration experience.",
    period: "2022–2025 · illustrative coverage",
    records: "1,536 synthetic rows",
    entities: "Artists and tracks",
    categories: "Genres",
    markets: "Countries",
    grain: "One track × one country × one month",
    source: "Demonstration dataset",
    illustrative: true,
  },
  dashboard: SPOTIFY_DASHBOARD,
  overview: SPOTIFY_OVERVIEW,
  insights: SPOTIFY_INSIGHTS,
  methodology: SPOTIFY_METHODOLOGY,
} satisfies ProjectDetail;
