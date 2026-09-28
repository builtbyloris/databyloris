import type {Project} from "@/types";

export const projects = [
  {
    id: "project-001",
    slug: "video-game-sales",
    title: "Video Game Sales",
    description: "Global sales patterns across platforms, genres and publishing eras.",
    category: "Entertainment",
    technologies: ["Python", "Pandas", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: true,
    status: "published",
  },
  {
    id: "project-002",
    slug: "flight-analysis",
    title: "Flight Analysis",
    description: "Air traffic performance, routes and delay drivers at a glance.",
    category: "Mobility",
    technologies: ["SQL", "Python", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: true,
    status: "published",
  },
  {
    id: "project-003",
    slug: "listening-insights",
    title: "Listening Insights",
    description: "Listening habits translated into meaningful audience signals.",
    category: "Media",
    technologies: ["TypeScript", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: true,
    status: "published",
  },
  {
    id: "project-004",
    slug: "stock-market-analysis",
    title: "Stock Market Analysis",
    description: "Market movements, volatility and sector-level comparisons.",
    category: "Finance",
    technologies: ["Python", "SQL", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: false,
    status: "published",
  },
  {
    id: "project-005",
    slug: "city-data-analysis",
    title: "City Data Analysis",
    description: "Urban indicators for mobility, services and quality of life.",
    category: "Public Data",
    technologies: ["PostgreSQL", "GeoJSON", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: false,
    status: "draft",
  },
  {
    id: "project-006",
    slug: "sports-performance",
    title: "Sports Performance",
    description: "Player and team performance through comparable metrics.",
    category: "Sports",
    technologies: ["Python", "Pandas", "ECharts"],
    image: "/images/projects/project-cover.svg",
    featured: false,
    status: "draft",
  },
] satisfies Project[];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
