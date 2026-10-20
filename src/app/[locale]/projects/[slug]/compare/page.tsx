import type {Metadata} from "next";
import {Suspense} from "react";
import Link from "next/link";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CompareControls} from "@/components/projects/compare/compare-controls";
import {CompareResults} from "@/components/projects/compare/compare-results";
import {compareHref, type CompareState} from "@/components/projects/compare/compare-url";
import {ExportButton} from "@/components/ui/export-button";
import {Container, ShareButton} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {getPublishedDatasetComparison, getPublishedCompareOptions} from "@/lib/repositories/public-dataset-compare-repository";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";
import {getPublishedProjectBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata, getLocalizedPath} from "@/lib/seo";
import type {DatasetColumn} from "@/types";

interface ComparePageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

function scalar(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export async function generateMetadata({params}: ComparePageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "Compare"});
  try {
    const [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale), getPublishedExplorerDatasetId(slug),
    ]);
    if (!project || !datasetId) notFound();
    return createLocalizedMetadata({
      locale,
      pathname: `/projects/${slug}/compare`,
      title: `${t("title")} · ${project.title}`,
      description: t("metadataDescription", {project: project.title}),
    });
  } catch {
    return {robots: {index: false, follow: false}};
  }
}

export default async function ComparePage({params, searchParams}: ComparePageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Compare");
  const raw = await searchParams;
  let project;
  let datasetId;
  try {
    [project, datasetId] = await Promise.all([
      getPublishedProjectBySlug(slug, locale), getPublishedExplorerDatasetId(slug),
    ]);
  } catch {
    return <CompareError standalone />;
  }
  if (!project || !datasetId) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <nav aria-label={t("breadcrumbLabel")} className="text-sm text-muted">
        <Link href={getLocalizedPath(locale, `/projects/${slug}`)} className="font-semibold hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{t("backToCaseStudy")}</Link>
        <span className="mx-2" aria-hidden="true">/</span>{t("title")}
      </nav>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl min-w-0">
          <p className="site-overline text-primary-strong">{t("eyebrow")}</p>
          <h1 className="font-editorial mt-3 text-4xl sm:text-6xl">{t("title")}</h1>
          <p className="mt-3 text-muted">{t("intro", {project: project.title})}</p>
        </div>
        <ShareButton projectTitle={project.title} context="compare" />
      </div>
      <Suspense fallback={<div role="status" className="mt-8 rounded-card border border-border bg-card p-6 text-muted">{t("loading")}</div>}>
        <Comparison slug={slug} datasetId={datasetId} locale={locale} raw={raw} />
      </Suspense>
    </Container>
  );
}

async function CompareError({standalone = false}: {standalone?: boolean} = {}) {
  const t = await getTranslations("Compare");
  const content = <div role="alert" className="mt-8 rounded-card border border-border bg-card p-6">
    {standalone ? <h1 className="text-xl font-bold">{t("errorTitle")}</h1> : <h2 className="text-xl font-bold">{t("errorTitle")}</h2>}
    <p className="mt-2 text-muted">{t("errorDescription")}</p>
  </div>;
  return standalone ? <Container className="py-section">{content}</Container> : content;
}

async function Comparison({slug, datasetId, locale, raw}: {
  slug: string;
  datasetId: string;
  locale: AppLocale;
  raw: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations("Compare");
  const basePath = getLocalizedPath(locale, `/projects/${slug}/compare`);
  let baseline;
  try {
    baseline = await getPublishedExplorerPage(slug, datasetId, {
      offset: 0, search: null, filterField: null, filterValue: null,
      sortField: null, sortDirection: "asc",
    });
  } catch {
    return <CompareError />;
  }
  if (!baseline) notFound();

  const dimensions = baseline.columns.filter((column: DatasetColumn) => column.type === "string" || column.type === "boolean");
  const metrics = baseline.columns.filter((column: DatasetColumn) => column.type === "number");
  const dimension = dimensions.find((column) => column.name === scalar(raw.dimension))?.name ?? dimensions[0]?.name ?? "";
  const metric = metrics.find((column) => column.name === scalar(raw.metric))?.name ?? metrics[0]?.name ?? "";
  let options: string[] | null = [];
  try {
    if (dimension) {
      options = await getPublishedCompareOptions(slug, dimension);
    }
  } catch {
    return <CompareError />;
  }
  if (!options) return <CompareError />;
  const state: CompareState = {
    dimension,
    metric,
    a: options.includes(scalar(raw.a)) ? scalar(raw.a) : "",
    b: options.includes(scalar(raw.b)) ? scalar(raw.b) : "",
  };

  let comparison = null;
  const readyToCompare = Boolean(state.a && state.b && state.a !== state.b && state.metric);
  if (readyToCompare) {
    try {
      comparison = await getPublishedDatasetComparison(slug, state.dimension, state.a, state.b, state.metric);
    } catch {
      return <CompareError />;
    }
  }
  if (readyToCompare && !comparison) return <CompareError />;

  const metricMetadata = baseline.dictionary[state.metric];
  const exportHref = compareHref(`${basePath}/export`, state);
  return (
    <>
      <CompareControls basePath={basePath} dimensions={dimensions} metrics={metrics} dictionary={baseline.dictionary} options={options} state={state} locale={locale} />
      {!dimension || !metric ? <CompareMessage title={t("unavailableTitle")} description={t("unavailableDescription")} />
        : state.a && state.b && state.a === state.b ? <CompareMessage title={t("sameTitle")} description={t("sameDescription")} />
          : !comparison ? <CompareMessage title={t("incompleteTitle")} description={t("incompleteDescription")} />
            : <>
              <div className="mt-6 flex justify-end">
                <ExportButton key={exportHref} href={exportHref} fileName={`${slug}-compare.csv`} />
              </div>
              <CompareResults comparison={comparison} valueA={state.a} valueB={state.b} locale={locale} unit={metricMetadata?.unit} format={metricMetadata?.format} />
            </>}
    </>
  );
}

function CompareMessage({title, description}: {title: string; description: string}) {
  return <div role="status" className="mt-8 rounded-card border border-border bg-card p-6"><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm text-muted">{description}</p></div>;
}
