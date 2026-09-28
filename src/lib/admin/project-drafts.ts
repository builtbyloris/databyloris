import type {DashboardConfig, DashboardRecord, LocalizedText, Project, ProjectDraft} from "@/types";

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

export function createProjectDraft(project: Project, options?: {
  config?: DashboardConfig | null;
  data?: DashboardRecord[];
  localizedTitle?: LocalizedText;
  localizedDescription?: LocalizedText;
}): ProjectDraft {
  const records = options?.data ?? [];
  return {
    project: structuredClone(project),
    localizedTitle: structuredClone(options?.localizedTitle ?? {it: project.title, en: project.title}),
    localizedDescription: structuredClone(options?.localizedDescription ?? {it: project.description, en: project.description}),
    dashboardConfig: options?.config ? structuredClone(options.config) : createEmptyDashboardConfig(project.slug),
    dataset: options?.data ? {
      id: options.config?.datasetId ?? project.slug,
      records: structuredClone(records),
      fields: Array.from(new Set(records.flatMap((record) => Object.keys(record)))).sort(),
    } : null,
  };
}
