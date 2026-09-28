import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {connection} from "next/server";
import {getTranslations} from "next-intl/server";
import {AdminShell} from "@/components/admin";
import {dashboardRegistry} from "@/data/dashboards/registry";
import {projects} from "@/data/projects";
import {createProjectDraft} from "@/lib/admin";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin");
  return {title: t("title"), description: t("description")};
}

export default async function AdminPage() {
  await connection();
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") notFound();
  const initialDrafts = projects.map((project) => createProjectDraft(project, dashboardRegistry[project.slug]));
  return <AdminShell initialDrafts={initialDrafts} />;
}
