import "server-only";

import {validateDashboardConfig} from "@/lib/admin";
import {getAvailableDatasetFields} from "@/lib/datasets/field-names";
import {dashboardConfigFromJson} from "@/lib/mappers/dashboard-config-mapper";
import {datasetSchemaFromJson} from "@/lib/mappers/dataset-mapper";
import {createClient} from "@/lib/supabase/server";
import type {DashboardConfig, DashboardRecord, Project} from "@/types";
import {getDatasetRows} from "./datasets-repository";
import {getPublishedProjectBySlug} from "./projects-repository";
import {RepositoryError} from "./repository-error";

type SupportedLocale = "it" | "en";

export type PublishedDashboardResult =
  | {kind: "not-found"}
  | {kind: "missing-config"; project: Project}
  | {kind: "missing-dataset"; project: Project}
  | {kind: "invalid-config"; project: Project}
  | {
      kind: "ready";
      project: Project;
      config: DashboardConfig;
      records: DashboardRecord[];
    };

export async function getPublishedDashboardBySlug(
  slug: string,
  locale: SupportedLocale,
): Promise<PublishedDashboardResult> {
  const project = await getPublishedProjectBySlug(slug, locale);
  if (!project?.dashboardAvailable) return {kind: "not-found"};

  const supabase = await createClient();
  const {data: configRow, error: configError} = await supabase
    .from("dashboard_configs")
    .select("config")
    .eq("project_id", project.id)
    .maybeSingle();
  if (configError) throw new RepositoryError("database");
  if (!configRow) return {kind: "missing-config", project};

  let config: DashboardConfig | null;
  try {
    config = dashboardConfigFromJson(configRow.config);
  } catch {
    config = null;
  }
  if (!config) return {kind: "invalid-config", project};

  const {data: datasets, error: datasetError} = await supabase
    .from("datasets")
    .select("id, schema")
    .eq("project_id", project.id)
    .order("updated_at", {ascending: false})
    .limit(2);
  if (datasetError) throw new RepositoryError("database");
  if (datasets.length !== 1) return {kind: "missing-dataset", project};

  let schemaFields: string[];
  try {
    schemaFields = datasetSchemaFromJson(datasets[0].schema).map((column) => column.name);
  } catch {
    throw new RepositoryError("invalid_data");
  }
  const records = await getDatasetRows(datasets[0].id);
  const fields = getAvailableDatasetFields(schemaFields, records);

  if (validateDashboardConfig(config, fields).length > 0) {
    return {kind: "invalid-config", project};
  }

  return {
    kind: "ready",
    project,
    config,
    records,
  };
}
