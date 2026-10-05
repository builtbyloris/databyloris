import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {RecruiterMode} from "@/components/recruiter/recruiter-mode";
import type {AppLocale} from "@/i18n/routing";
import {listPublishedProjects} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata} from "@/lib/seo";
import type {Project} from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: {params: Promise<{locale: AppLocale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Recruiter"});

  return createLocalizedMetadata({
    locale,
    pathname: "/recruiter",
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  });
}

export default async function RecruiterPage({params}: {params: Promise<{locale: AppLocale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  let projects: Project[] = [];

  try {
    projects = await listPublishedProjects(locale);
  } catch {
    projects = [];
  }

  return <RecruiterMode projects={projects} />;
}
