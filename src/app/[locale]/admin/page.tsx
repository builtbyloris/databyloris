import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {AdminShell} from "@/components/admin";
import {dashboardRegistry} from "@/data/dashboards/registry";
import {projects} from "@/data/projects";
import type {AppLocale} from "@/i18n/routing";
import {createProjectDraft} from "@/lib/admin";
import {requireAdmin} from "@/lib/auth/require-admin";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin");
  return {title: t("title"), description: t("description")};
}

export default async function AdminPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  const admin = await requireAdmin(locale);
  const initialDrafts = projects.map((project) => createProjectDraft(project, dashboardRegistry[project.slug]));
  return <AdminShell initialDrafts={initialDrafts} adminEmail={admin.email} locale={locale} />;
}
