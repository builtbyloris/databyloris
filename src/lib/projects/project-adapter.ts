import type { ProjectDatabaseRow } from "@/types/project-database";
import type {
  ProjectCoverType,
  ProjectAnalyticsImplementation,
  ProjectDetail,
  PublicProjectMetadata,
} from "@/types/project";

const categoryCovers: Record<string, ProjectCoverType> = {
  music: "listening",
  entertainment: "catalog",
  gaming: "market",
  travel: "geography",
  business: "economy",
};

function coverForCategory(category: string): ProjectCoverType {
  return categoryCovers[category.trim().toLowerCase()] ?? "generic";
}

export function projectRowToPublicProject(
  row: ProjectDatabaseRow,
): PublicProjectMetadata {
  const dataset = {
    records: row.dataset_records ?? undefined,
    grain: row.dataset_grain ?? undefined,
    source: row.dataset_source ?? undefined,
  };
  const hasDatasetMetadata = Object.values(dataset).some(Boolean);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    category: row.category,
    description: row.description,
    question: row.question ?? undefined,
    coverType: coverForCategory(row.category),
    period: row.period ?? undefined,
    tags: row.tags,
    featured: row.featured,
    demo: row.demo,
    status: "published",
    href: `/projects/${row.slug}`,
    dataset: hasDatasetMetadata ? dataset : undefined,
  };
}

export function mergeProjectImplementation(
  metadata: PublicProjectMetadata,
  implementation: ProjectAnalyticsImplementation,
): ProjectDetail {
  return {
    ...metadata,
    href: `/projects/${metadata.slug}`,
    dataset: {
      ...implementation.dataset,
      period: metadata.period,
      records: metadata.dataset?.records,
      grain: metadata.dataset?.grain,
      source: metadata.dataset?.source,
    },
    dashboard: implementation.dashboard,
    overview: implementation.overview,
    insights: implementation.insights,
    methodology: implementation.methodology,
  };
}
