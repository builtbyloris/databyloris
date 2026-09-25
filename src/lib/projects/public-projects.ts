import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ProjectDatabaseRow } from "@/types/project-database";
import type { PublicProjectMetadata } from "@/types/project";

import { projectRowToPublicProject } from "./project-adapter";

async function queryPublishedProjects(): Promise<ProjectDatabaseRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) return [];
    return (data ?? []) as ProjectDatabaseRow[];
  } catch {
    return [];
  }
}

export async function listPublishedProjects(): Promise<PublicProjectMetadata[]> {
  return (await queryPublishedProjects()).map(projectRowToPublicProject);
}

export async function listFeaturedPublishedProjects() {
  const projects = await listPublishedProjects();
  return projects.filter((project) => project.featured);
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<PublicProjectMetadata | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return projectRowToPublicProject(data as ProjectDatabaseRow);
    }
  } catch {
    // Public metadata is unavailable; never substitute a local project record.
  }

  return null;
}
