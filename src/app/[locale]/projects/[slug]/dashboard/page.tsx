import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {DashboardShell, DashboardState} from "@/components/dashboard";
import type {AppLocale} from "@/i18n/routing";
import {getPublishedDashboardBySlug} from "@/lib/repositories/public-dashboards-repository";
import {getPublishedProjectBySlug} from "@/lib/repositories/projects-repository";

interface DashboardPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: DashboardPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "Dashboard"});

  try {
    const project = await getPublishedProjectBySlug(slug, locale);
    return project?.dashboardAvailable
      ? {title: `${t("breadcrumb.dashboard")} · ${project.title}`, description: t("metadataDescription")}
      : {};
  } catch {
    return {};
  }
}

export default async function DashboardPage({params}: DashboardPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  let result;
  try {
    result = await getPublishedDashboardBySlug(slug, locale);
  } catch {
    return <DashboardState kind="error" retryHref={`/projects/${slug}/dashboard`} />;
  }

  if (result.kind === "not-found") notFound();
  if (result.kind !== "ready") {
    return <DashboardState kind={result.kind} project={result.project} />;
  }

  return (
    <DashboardShell
      project={{slug: result.project.slug, title: result.project.title}}
      config={result.config}
      records={result.records}
    />
  );
}
