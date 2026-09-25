import "server-only";

import { SPOTIFY_PROJECT_SUMMARY } from "@/data/projects";
import { createClient } from "@/lib/supabase/server";
import type { ProjectDatabaseRow } from "@/types/project-database";
import type { PublicProjectMetadata } from "@/types/project";

import { projectRowToPublicProject } from "./project-adapter";

const spotifySlug = "spotify-listening-trends";

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
  const projects = (await queryPublishedProjects()).map(projectRowToPublicProject);

  // Transitional fallback: keep the implemented demo public until its persisted
  // published record exists. Remove this branch after Spotify is seeded.
  if (!projects.some((project) => project.slug === spotifySlug)) {
    projects.push(SPOTIFY_PROJECT_SUMMARY);
  }

  return projects.sort(
    (left, right) => Number(right.featured) - Number(left.featured),
  );
}

export async function listFeaturedPublishedProjects() {
  const projects = await listPublishedProjects();
  const featured = projects.filter((project) => project.featured);

  if (featured.length > 0) return featured;

  const spotify = projects.find((project) => project.slug === spotifySlug);
  return spotify ? [spotify] : [SPOTIFY_PROJECT_SUMMARY];
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
    // The isolated Spotify fallback below remains available during outages.
  }

  return slug === spotifySlug ? SPOTIFY_PROJECT_SUMMARY : null;
}
