import "server-only";

import {validateDashboardConfig} from "@/lib/admin";
import {DATASET_MAX_ROWS} from "@/lib/datasets";
import {dashboardConfigFromJson} from "@/lib/mappers/dashboard-config-mapper";
import {datasetRecordFromJson} from "@/lib/mappers/dataset-mapper";
import {createClient} from "@/lib/supabase/server";
import type {DashboardConfig, DashboardRecord, Project} from "@/types";
import type {Json} from "@/types/database";
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

function isRecord(value: Json | undefined): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDashboardPage(value: Json | null) {
  if (!isRecord(value) || !Array.isArray(value.fields) || !value.fields.every((field) => typeof field === "string")
    || !Array.isArray(value.rows) || (value.nextCursor !== null && !Number.isInteger(value.nextCursor))) {
    throw new RepositoryError("invalid_data");
  }

  const fields = value.fields as string[];
  const rows = value.rows.map((item) => {
    if (!isRecord(item) || !Number.isInteger(item.rowIndex) || !isRecord(item.data)) {
      throw new RepositoryError("invalid_data");
    }
    const record = datasetRecordFromJson(item.data);
    if (Object.keys(record).some((field) => !fields.includes(field))) throw new RepositoryError("invalid_data");
    return {rowIndex: item.rowIndex as number, record};
  });

  return {fields, rows, nextCursor: value.nextCursor as number | null};
}

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

  const records: DashboardRecord[] = [];
  let cursor = -1;
  let fields: string[] | null = null;
  while (true) {
    const {data, error} = await supabase.rpc("get_published_dashboard_page", {
      p_slug: slug,
      p_after_row_index: cursor,
      p_page_size: 1000,
    });
    if (error) throw new RepositoryError("database");
    if (data === null) return {kind: "invalid-config", project};

    let page: ReturnType<typeof parseDashboardPage>;
    try {
      page = parseDashboardPage(data);
    } catch {
      throw new RepositoryError("invalid_data");
    }
    if (fields === null) {
      fields = page.fields;
      if (validateDashboardConfig(config, fields).length > 0) return {kind: "invalid-config", project};
    } else if (fields.length !== page.fields.length || fields.some((field, index) => field !== page.fields[index])) {
      throw new RepositoryError("invalid_data");
    }
    for (const {rowIndex, record} of page.rows) {
      if (rowIndex <= cursor) throw new RepositoryError("invalid_data");
      cursor = rowIndex;
      records.push(record);
    }
    if (records.length > DATASET_MAX_ROWS) throw new RepositoryError("invalid_data");
    if (page.nextCursor === null) break;
    if (page.nextCursor !== cursor || page.rows.length === 0) throw new RepositoryError("invalid_data");
  }

  return {
    kind: "ready",
    project,
    config,
    records,
  };
}
