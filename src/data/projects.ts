import type { ProjectSummary } from "@/types/project";

export const SPOTIFY_DEMO_PROJECT = {
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
  href: "/demo",
} satisfies ProjectSummary;

export const MVP_PROJECTS = [
  SPOTIFY_DEMO_PROJECT,
  {
    slug: "netflix-catalog-trends",
    title: "Netflix Catalog Trends",
    category: "Entertainment",
    description:
      "A planned analysis of how streaming catalogs change across genres, formats and regions.",
    question: "How is the shape of a global streaming catalog changing?",
    coverType: "catalog",
    period: "Upcoming",
    tags: ["Titles", "Genres", "Regions"],
    featured: false,
    demo: false,
    status: "upcoming",
  },
  {
    slug: "video-game-market-analysis",
    title: "Video Game Market Analysis",
    category: "Gaming",
    description:
      "A future data story about platforms, publishers and changing market preferences.",
    question: "Which forces shape the global video game market?",
    coverType: "market",
    period: "Upcoming",
    tags: ["Platforms", "Publishers", "Markets"],
    featured: false,
    demo: false,
    status: "upcoming",
  },
  {
    slug: "global-travel-trends",
    title: "Global Travel Trends",
    category: "Travel",
    description:
      "A planned exploration of destinations, seasonality and international travel flows.",
    question: "How are global travel patterns evolving?",
    coverType: "geography",
    period: "Upcoming",
    tags: ["Destinations", "Seasonality", "Countries"],
    featured: false,
    demo: false,
    status: "upcoming",
  },
  {
    slug: "digital-economy-trends",
    title: "Digital Economy Trends",
    category: "Business",
    description:
      "A future analysis of digital adoption, market growth and economic participation.",
    question: "Where is digital activity reshaping economic opportunity?",
    coverType: "economy",
    period: "Upcoming",
    tags: ["Adoption", "Growth", "Markets"],
    featured: false,
    demo: false,
    status: "upcoming",
  },
] satisfies readonly ProjectSummary[];
