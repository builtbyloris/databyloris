import type {AdminDatasetDraft, DashboardConfig, DashboardRecord, LocalizedText, Project, ProjectDetail, ProjectDraft} from "@/types";

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

export function createEmptyProjectDetail(): ProjectDetail {
  return {
    context: {it: "", en: ""},
    objective: {it: "", en: ""},
    methodology: [],
    dataset: {
      name: "",
      source: {it: "", en: ""},
      description: {it: "", en: ""},
    },
    insights: [],
  };
}

export function createProjectDraft(project: Project, options?: {
  config?: DashboardConfig | null;
  dataset?: AdminDatasetDraft | null;
  data?: DashboardRecord[];
  localizedTitle?: LocalizedText;
  localizedDescription?: LocalizedText;
  projectDetail?: ProjectDetail | null;
}): ProjectDraft {
  const records = options?.data ?? [];
  const registryFields = Array.from(new Set(records.flatMap((record) => Object.keys(record)))).sort();
  return {
    project: structuredClone(project),
    localizedTitle: structuredClone(options?.localizedTitle ?? {it: project.title, en: project.title}),
    localizedDescription: structuredClone(options?.localizedDescription ?? {it: project.description, en: project.description}),
    projectDetail: structuredClone(options?.projectDetail ?? createEmptyProjectDetail()),
    dashboardConfig: options?.config ? structuredClone(options.config) : createEmptyDashboardConfig(project.slug),
    dataset: options?.dataset ?? (options?.data ? {
      id: options.config?.datasetId ?? project.slug,
      projectId: project.id,
      name: project.title,
      originalFilename: null,
      storagePath: null,
      grain: "",
      recordCount: records.length,
      columns: registryFields.map((name) => ({name, type: "string" as const, nullable: false})),
      records: structuredClone(records),
      fields: registryFields,
      source: "registry" as const,
      updatedAt: null,
    } : null),
  };
}
