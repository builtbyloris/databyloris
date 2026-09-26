import type { PublicDictionary } from "../types";

const dictionary = {
  navigation: {
    explore: "Explore",
    demo: "Demo",
    about: "About",
    primaryLabel: "Primary navigation",
    mobileLabel: "Mobile navigation",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    skipToContent: "Skip to main content",
  },
  languageSwitcher: {
    label: "Language",
    english: "English",
    italian: "Italian",
  },
  footer: {
    description: "A modular platform for clear, interactive data stories.",
    navigationLabel: "Footer navigation",
  },
  home: {
    exploreProjects: "Explore projects",
    tryDemo: "Try interactive demo",
  },
  explore: {
    eyebrow: "Project catalog",
    title: "Explore data stories",
    description: "Discover interactive analyses built from real-world datasets.",
    catalog: {
      searchLabel: "Search projects",
      searchPlaceholder: "Search titles, topics or tags",
      categoryLabel: "Filter by category",
      allCategories: "All",
      projectSingular: "project",
      projectPlural: "projects",
      emptyTitle: "No projects found",
      emptyDescription:
        "Try a different search or reset the category filter to see every project.",
      resetFilters: "Reset filters",
      interactiveDemo: "Interactive demo",
      exploreProject: "Explore project",
      exploreProjectAriaPrefix: "Explore",
    },
  },
  about: {
    badge: "About databyloris",
    title: "Data analysis should be explored, not just presented.",
    description:
      "databyloris transforms datasets into interactive stories, clear insights and explorable dashboards—so the path from a question to the underlying evidence remains visible.",
    ctaEyebrow: "Continue",
    ctaTitle: "Explore the stories behind the data.",
    ctaLabel: "Explore data stories",
  },
  projectNavigation: {
    label: "Project sections",
    overview: "Overview",
    insights: "Insights",
    explore: "Explore",
    methodology: "Methodology",
  },
} satisfies PublicDictionary;

export default dictionary;
