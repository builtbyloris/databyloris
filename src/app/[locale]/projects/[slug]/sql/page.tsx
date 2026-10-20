import type {Metadata} from "next";
import Link from "next/link";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {SqlLab} from "@/components/projects/sql/sql-lab";
import {Container, ShareButton} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";
import {getPublishedProjectBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata, getLocalizedPath} from "@/lib/seo";

interface SqlPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({params}: SqlPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "SqlLab"});
  try {
    const [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale), getPublishedExplorerDatasetId(slug),
    ]);
    if (!project || !datasetId) notFound();
    return createLocalizedMetadata({
      locale,
      pathname: `/projects/${slug}/sql`,
      title: `${t("title")} · ${project.title}`,
      description: t("metadataDescription", {project: project.title}),
    });
  } catch {
    return {robots: {index: false, follow: false}};
  }
}

export default async function SqlPage({params}: SqlPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SqlLab");
  let project;
  let datasetId;
  let baseline;
  try {
    [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale), getPublishedExplorerDatasetId(slug),
    ]);
    if (project && datasetId) {
      baseline = await getPublishedExplorerPage(slug, datasetId, {
        offset: 0, search: null, filterField: null, filterValue: null,
        sortField: null, sortDirection: "asc",
      });
    }
  } catch {
    return <Container className="py-section"><div role="alert" className="rounded-card border border-border bg-card p-6"><h1 className="text-xl font-bold">{t("unavailable")}</h1></div></Container>;
  }
  if (!project || !datasetId || !baseline) notFound();

  return <Container className="py-10 sm:py-14">
    <nav aria-label={t("breadcrumbLabel")} className="text-sm text-muted">
      <Link href={getLocalizedPath(locale, `/projects/${slug}/dataset`)} className="font-semibold hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{t("backToExplorer")}</Link>
      <span className="mx-2" aria-hidden="true">/</span>{t("title")}
    </nav>
    <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{t("eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-3 text-muted">{t("intro", {project: project.title})}</p>
        <p className="mt-2 text-sm text-muted">{t("dialectNote")}</p>
      </div>
      <ShareButton projectTitle={project.title} context="sqlLab" />
    </div>
    <SqlLab dataUrl={getLocalizedPath(locale, `/projects/${slug}/sql/data`)} locale={locale} columns={baseline.columns} dictionary={baseline.dictionary} />
  </Container>;
}
