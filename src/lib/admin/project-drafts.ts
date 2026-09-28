import type {DashboardConfig, DashboardRecord, Project, ProjectDraft} from "@/types";

export function slugifyProjectTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptyDashboardConfig(slug: string): DashboardConfig {
  return {
    id: `${slug || "new-project"}-dashboard`,
    title: "Dashboard",
    description: "",
    datasetId: "",
    filters: [],
    kpis: [],
    charts: [],
    rankings: [],
    layout: {featuredChartId: ""},
  };
}

export function createProjectDraft(project: Project, definition?: {config: DashboardConfig; data: DashboardRecord[]}): ProjectDraft {
  const records = definition?.data ?? [];
  return {
    project: structuredClone(project),
    dashboardConfig: definition ? structuredClone(definition.config) : createEmptyDashboardConfig(project.slug),
    dataset: definition ? {
      id: definition.config.datasetId,
      records: structuredClone(records),
      fields: Array.from(new Set(records.flatMap((record) => Object.keys(record)))).sort(),
    } : null,
  };
}

export function createNewProjectDraft(sequence: number): ProjectDraft {
  const id = `session-draft-${sequence}`;
  return {
    project: {
      id,
      slug: "",
      title: "",
      description: "",
      category: "",
      technologies: [],
      image: "/images/projects/project-cover.svg",
      featured: false,
      status: "draft",
      publishedAt: null,
      dashboardAvailable: false,
    },
    dashboardConfig: createEmptyDashboardConfig("new-project"),
    dataset: null,
  };
}
