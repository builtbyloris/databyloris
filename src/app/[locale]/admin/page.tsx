import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {AdminShell} from "@/components/admin";
import {dashboardRegistry} from "@/data/dashboards/registry";
import type {AppLocale} from "@/i18n/routing";
import {createProjectDraft} from "@/lib/admin";
import {requireAdmin} from "@/lib/auth/require-admin";
import {getDashboardConfig} from "@/lib/repositories/dashboard-configs-repository";
import {listAdminProjects} from "@/lib/repositories/projects-repository";
import type {ProjectDraft} from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin");
  return {title: t("title"), description: t("description")};
}

export default async function AdminPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const admin = await requireAdmin(locale);
  let initialDrafts: ProjectDraft[] = [];
  let initialLoadError = false;

  try {
    const projects = await listAdminProjects(locale);
    initialDrafts = await Promise.all(projects.map(async (record) => {
      const config = await getDashboardConfig(record.project.id);
      return createProjectDraft(record.project, {
        config,
        data: dashboardRegistry[record.project.slug]?.data,
        localizedTitle: record.localizedTitle,
        localizedDescription: record.localizedDescription,
      });
    }));
  } catch {
    initialLoadError = true;
  }

  return <AdminShell initialDrafts={initialDrafts} adminEmail={admin.email} locale={locale} initialLoadError={initialLoadError} />;
}
