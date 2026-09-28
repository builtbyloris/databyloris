import "server-only";

import {
  dashboardConfigFromJson,
  dashboardConfigToJson,
} from "@/lib/mappers/dashboard-config-mapper";
import {createClient} from "@/lib/supabase/server";
import type {DashboardConfig} from "@/types";
import {RepositoryError} from "./repository-error";

export async function getDashboardConfig(projectId: string): Promise<DashboardConfig | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("dashboard_configs")
    .select("config")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) throw new RepositoryError("database");
  if (!data) return null;

  const config = dashboardConfigFromJson(data.config);
  if (!config) throw new RepositoryError("invalid_data");
  return config;
}

export async function upsertDashboardConfig(
  projectId: string,
  config: DashboardConfig,
): Promise<DashboardConfig> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("dashboard_configs")
    .upsert(
      {project_id: projectId, config: dashboardConfigToJson(config)},
      {onConflict: "project_id"},
    )
    .select("config")
    .single();

  if (error) throw new RepositoryError("database");

  const saved = dashboardConfigFromJson(data.config);
  if (!saved) throw new RepositoryError("invalid_data");
  return saved;
}
