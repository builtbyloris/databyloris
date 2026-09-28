import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {DashboardShell} from "@/components/dashboard";
import {getDashboardBySlug} from "@/data/dashboards/registry";
import {getProjectBySlug} from "@/data/projects";

interface DashboardPageProps {
  params: Promise<{slug: string}>;
}

export async function generateMetadata({params}: DashboardPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  const t = await getTranslations("Dashboard");
  return project ? {title: `${t("breadcrumb.dashboard")} · ${project.title}`, description: t("metadataDescription")} : {};
}

export default async function DashboardPage({params}: DashboardPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project?.dashboardAvailable) notFound();
  const dashboard = getDashboardBySlug(project.slug);
  if (!dashboard) notFound();

  return (
    <DashboardShell
      project={{slug: project.slug, title: project.title}}
      config={dashboard.config}
      records={dashboard.data}
    />
  );
}
