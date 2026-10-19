import type {Metadata} from "next";
import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {DatasetExplorer} from "@/components/projects/explorer/dataset-explorer";
import type {ExplorerControlsState} from "@/components/projects/explorer/explorer-url";
import {Container} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";
import {getPublishedDatasetQuality} from "@/lib/repositories/public-dataset-quality-repository";
import {getPublishedExplorerTrustMetadata} from "@/lib/repositories/public-dataset-trust-repository";
import {getPublishedProjectBySlug, getPublishedProjectWithDetailBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata} from "@/lib/seo";
import type {DatasetSummary} from "@/types";

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
    search: scalar(raw.search ?? raw.q).trim().slice(0, 100),
    filterField: scalar(raw.filter ?? raw.field),
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

  let projectResult;
  let datasetId;
  try {
    [projectResult, datasetId] = await Promise.all([
      getPublishedProjectWithDetailBySlug(slug, locale),
      getPublishedExplorerDatasetId(slug),
    ]);
  } catch {
    return errorState;
  }
  if (!projectResult || !datasetId) notFound();

  return (
    <Suspense fallback={<Container className="py-section"><div role="status" className="h-72 animate-pulse rounded-card border border-border bg-surface-raised p-6"><span className="sr-only">{t("loading")}</span></div></Container>}>
      <ExplorerResults
        slug={slug}
        datasetId={datasetId}
        locale={locale}
        project={projectResult.project}
        source={projectResult.detail?.dataset ?? null}
        pageNumber={pageNumber}
        controls={controls}
        errorState={errorState}
      />
    </Suspense>
  );
}

async function ExplorerResults({slug, datasetId, locale, project, source, pageNumber, controls, errorState}: {
  slug: string;
  datasetId: string;
  locale: AppLocale;
  project: NonNullable<Awaited<ReturnType<typeof getPublishedProjectBySlug>>>;
  source: DatasetSummary | null;
  pageNumber: number;
  controls: ExplorerControlsState;
  errorState: React.ReactNode;
}) {
  let result;
  let safeControls = controls;
  let safePageNumber = pageNumber;
  try {
    const query = (input: ExplorerControlsState, number = pageNumber) => ({
      offset: (number - 1) * 25,
      search: input.search || null,
      filterField: input.filterField || null,
      filterValue: input.filterField && input.filterValue ? input.filterValue : null,
      sortField: input.sortField || null,
      sortDirection: input.sortDirection,
    });
    result = await getPublishedExplorerPage(slug, datasetId, query(controls));
    if (!result) {
      // The RPC denies invalid field names. Retry only after discovering the approved columns.
      const baseline = await getPublishedExplorerPage(slug, datasetId, {
        offset: 0, search: null, filterField: null, filterValue: null,
        sortField: null, sortDirection: "asc",
      });
      if (!baseline) notFound();
      const allowed = new Set(baseline.columns.map((column) => column.name));
      safeControls = {
        ...controls,
        filterField: allowed.has(controls.filterField) ? controls.filterField : "",
        filterValue: allowed.has(controls.filterField) ? controls.filterValue : "",
        sortField: allowed.has(controls.sortField) ? controls.sortField : "",
      };
      if (!safeControls.sortField) safeControls.sortDirection = "asc";
      result = await getPublishedExplorerPage(slug, datasetId, query(safeControls));
    }
    if (result) {
      safePageNumber = Math.min(pageNumber, Math.max(1, Math.ceil(result.totalCount / 25)));
      if (safePageNumber !== pageNumber) {
        result = await getPublishedExplorerPage(slug, datasetId, query(safeControls, safePageNumber));
      }
    }
  } catch {
    return errorState;
  }
  if (!result) notFound();
  if (!safeControls.filterField) safeControls = {...safeControls, filterValue: ""};
  if (!safeControls.sortField) safeControls = {...safeControls, sortDirection: "asc"};
  const [qualityResult, trustResult] = await Promise.allSettled([
    getPublishedDatasetQuality(slug, result.columns),
    getPublishedExplorerTrustMetadata(slug, datasetId, result.columns.length),
  ]);
  // Supplemental evidence must not make the existing Explorer unavailable.
  const quality = qualityResult.status === "fulfilled" ? qualityResult.value : null;
  const trust = trustResult.status === "fulfilled" ? trustResult.value : null;
  return <DatasetExplorer project={project} locale={locale} page={result} quality={quality} trust={trust} source={source} pageNumber={safePageNumber} controls={safeControls} />;
}
