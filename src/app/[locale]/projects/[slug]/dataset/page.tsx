import type {Metadata} from "next";
import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {DatasetExplorer} from "@/components/projects/explorer/dataset-explorer";
import {Container} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";
import {getPublishedDatasetQuality} from "@/lib/repositories/public-dataset-quality-repository";
import {getPublishedProjectBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata} from "@/lib/seo";

interface DatasetPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

function scalar(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export async function generateMetadata({params}: DatasetPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "DatasetExplorer"});
  let project;
  let datasetId;
  try {
    [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale),
      getPublishedExplorerDatasetId(slug),
    ]);
  } catch {
    return {robots: {index: false, follow: false}};
  }
  if (!project || !datasetId) notFound();
  return createLocalizedMetadata({
    locale,
    pathname: `/projects/${slug}/dataset`,
    title: `${t("title")} · ${project.title}`,
    description: t("metadataDescription", {project: project.title}),
  });
}

export default async function DatasetPage({params, searchParams}: DatasetPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("DatasetExplorer");
  const raw = await searchParams;
  const requestedPage = Number(scalar(raw.page));
  const pageNumber = Number.isSafeInteger(requestedPage) && requestedPage >= 1
    ? Math.min(requestedPage, 401) : 1;
  const controls = {
    search: scalar(raw.q).trim().slice(0, 100),
    filterField: scalar(raw.field),
    filterValue: scalar(raw.value).slice(0, 200),
    sortField: scalar(raw.sort),
    sortDirection: scalar(raw.dir) === "desc" ? "desc" as const : "asc" as const,
  };

  const errorState = (
    <Container className="py-section">
      <div role="alert" className="mx-auto max-w-3xl rounded-card border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">{t("errorTitle")}</h1>
        <p className="mt-2 text-muted">{t("errorDescription")}</p>
      </div>
    </Container>
  );

  let project;
  let datasetId;
  try {
    [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale),
      getPublishedExplorerDatasetId(slug),
    ]);
  } catch {
    return errorState;
  }
  if (!project || !datasetId) notFound();

  return (
    <Suspense fallback={<Container className="py-section"><div role="status" className="h-72 animate-pulse rounded-card border border-border bg-surface-raised p-6"><span className="sr-only">{t("loading")}</span></div></Container>}>
      <ExplorerResults
        slug={slug}
        datasetId={datasetId}
        locale={locale}
        project={project}
        pageNumber={pageNumber}
        controls={controls}
        errorState={errorState}
      />
    </Suspense>
  );
}

async function ExplorerResults({slug, datasetId, locale, project, pageNumber, controls, errorState}: {
  slug: string;
  datasetId: string;
  locale: AppLocale;
  project: NonNullable<Awaited<ReturnType<typeof getPublishedProjectBySlug>>>;
  pageNumber: number;
  controls: {search: string; filterField: string; filterValue: string; sortField: string; sortDirection: "asc" | "desc"};
  errorState: React.ReactNode;
}) {
  let result;
  try {
    result = await getPublishedExplorerPage(slug, datasetId, {
      offset: (pageNumber - 1) * 25,
      search: controls.search || null,
      filterField: controls.filterField || null,
      filterValue: controls.filterField && controls.filterValue ? controls.filterValue : null,
      sortField: controls.sortField || null,
      sortDirection: controls.sortDirection,
    });
  } catch {
    return errorState;
  }
  if (!result) notFound();
  let quality = null;
  try {
    quality = await getPublishedDatasetQuality(slug, result.columns);
  } catch {
    // Quality metrics are supplemental; the existing Explorer remains usable.
  }
  return <DatasetExplorer project={project} locale={locale} page={result} quality={quality} pageNumber={pageNumber} controls={controls} />;
}
