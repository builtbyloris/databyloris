import type {Metadata} from "next";
import Link from "next/link";
import {Suspense} from "react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {StoryReader, type StoryStep} from "@/components/projects/story/story-reader";
import {Container, ShareButton} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";
import {getPublishedProjectWithDetailBySlug} from "@/lib/repositories/projects-repository";
import {createLocalizedMetadata, getLocalizedPath} from "@/lib/seo";

interface StoryPageProps {
  params: Promise<{locale: AppLocale; slug: string}>;
}

export const dynamic = "force-dynamic";

function safeSourceUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({params}: StoryPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "Story"});
  try {
    const result = await getPublishedProjectWithDetailBySlug(slug, locale);
    return result ? createLocalizedMetadata({
      locale,
      pathname: `/projects/${slug}/story`,
      title: `${t("title")} · ${result.project.title}`,
      description: t("metadataDescription", {project: result.project.title}),
    }) : {robots: {index: false, follow: false}};
  } catch {
    return {robots: {index: false, follow: false}};
  }
}

export default async function StoryPage({params}: StoryPageProps) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Story");
  let result;
  try {
    result = await getPublishedProjectWithDetailBySlug(slug, locale);
  } catch {
    return <Container className="py-section"><p role="alert" className="text-muted">{t("error")}</p></Container>;
  }
  if (!result) notFound();

  const {project, detail} = result;
  const steps: StoryStep[] = [];
  const context = detail ? localize(detail.context, locale).trim() : "";
  const contextBody = context || project.description.trim();
  if (contextBody) steps.push({id: "context", title: t("context"), kind: "text", body: contextBody});

  const objective = detail ? localize(detail.objective, locale).trim() : "";
  if (objective) steps.push({id: "objective", title: t("objective"), kind: "text", body: objective});

  if (detail) {
    const dataset = detail.dataset;
    const name = dataset.name.trim();
    const description = localize(dataset.description, locale).trim();
    const source = localize(dataset.source, locale).trim();
    const period = dataset.period ? localize(dataset.period, locale).trim() : "";
    const sourceUrl = safeSourceUrl(dataset.sourceUrl);
    if (name || description || source || sourceUrl || period || dataset.records !== undefined) {
      steps.push({
        id: "data", title: t("data"), kind: "data",
        name: name || undefined,
        description: description || undefined,
        source: source || undefined,
        sourceUrl,
        records: dataset.records !== undefined ? new Intl.NumberFormat(locale).format(dataset.records) : undefined,
        period: period || undefined,
      });
    }

    const methodology = detail.methodology.map((item) => ({
      id: item.id,
      title: localize(item.title, locale).trim(),
      description: localize(item.description, locale).trim(),
    })).filter((item) => item.title || item.description);
    if (methodology.length) steps.push({id: "method", title: t("method"), kind: "items", items: methodology});

    const insights = detail.insights.map((item) => ({
      id: item.id,
      title: item.title ? localize(item.title, locale).trim() : "",
      description: localize(item.description, locale).trim(),
    })).filter((item) => item.title || item.description);
    if (insights.length) steps.push({id: "insights", title: t("insights"), kind: "items", items: insights});
  }

  const links: {href: string; label: string}[] = [];
  if (project.dashboardAvailable) links.push({href: getLocalizedPath(locale, `/projects/${slug}/dashboard`), label: t("dashboard")});
  try {
    const datasetId = await getPublishedExplorerDatasetId(slug);
    if (datasetId) {
      links.push({href: getLocalizedPath(locale, `/projects/${slug}/dataset`), label: t("explorer")});
      const page = await getPublishedExplorerPage(slug, datasetId, {
        offset: 0, search: null, filterField: null, filterValue: null,
        sortField: null, sortDirection: "asc",
      });
      if (page?.columns.some((column) => column.type === "number")
        && page.columns.some((column) => column.type === "string" || column.type === "boolean")) {
        links.push({href: getLocalizedPath(locale, `/projects/${slug}/compare`), label: t("compare")});
      }
    }
  } catch {
    // Optional exploration links must not prevent the Story from rendering.
  }
  if (links.length) steps.push({id: "explore", title: t("explore"), kind: "links", links});

  return <Container className="max-w-5xl py-10 sm:py-14">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href={getLocalizedPath(locale, `/projects/${slug}`)} className="inline-flex min-h-11 items-center text-sm font-semibold text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">
        <span className="mr-2" aria-hidden="true">←</span>{t("back")}
      </Link>
      <ShareButton projectTitle={project.title} context="story" />
    </div>
    <header className="mt-9 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{t("title")}</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{project.title}</h1>
      {context ? <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">{project.description}</p> : null}
    </header>
    {steps.length ? <Suspense fallback={null}>
      <StoryReader steps={steps} labels={{
        progress: String(t.raw("progress")),
        progressLabel: t("progressLabel"), jumpLabel: t("jumpLabel"),
        previous: t("previous"), next: t("next"),
        source: t("source"), records: t("records"), period: t("period"), openSource: t("openSource"),
      }} />
    </Suspense> : null}
  </Container>;
}
