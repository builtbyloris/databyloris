import {getTranslations} from "next-intl/server";
import Link from "next/link";
import {buttonStyles, Container, ShareButton} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import type {ExplorerPage} from "@/lib/repositories/public-explorer-repository";
import type {DatasetQuality} from "@/lib/repositories/public-dataset-quality-repository";
import type {DatasetTrustMetadata} from "@/lib/repositories/public-dataset-trust-repository";
import {getLocalizedPath} from "@/lib/seo";
import type {DashboardValue, DatasetSummary, Project} from "@/types";
import {DatasetTrust} from "./dataset-trust";
import {ExplorerControls} from "./explorer-controls";
import {explorerHref, type ExplorerControlsState} from "./explorer-url";

function cellText(value: DashboardValue | undefined, locale: AppLocale, yes: string, no: string) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? yes : no;
  if (typeof value === "number") return new Intl.NumberFormat(locale).format(value);
  return value;
}

export async function DatasetExplorer({project, locale, page, quality, trust, source, pageNumber, controls}: {
  project: Project;
  locale: AppLocale;
  page: ExplorerPage;
  quality: DatasetQuality | null;
  trust: DatasetTrustMetadata | null;
  source: DatasetSummary | null;
  pageNumber: number;
  controls: ExplorerControlsState;
}) {
  const t = await getTranslations("DatasetExplorer");
  const basePath = getLocalizedPath(locale, `/projects/${project.slug}/dataset`);
  const projectPath = getLocalizedPath(locale, `/projects/${project.slug}`);
  const formatCount = (value: number) => new Intl.NumberFormat(locale).format(value);
  const formatPercent = (value: number) => `${new Intl.NumberFormat(locale, {maximumFractionDigits: 2}).format(value)}%`;
  const active = Boolean(controls.search || controls.filterField || controls.sortField || pageNumber > 1);

  return (
    <Container className="py-10 sm:py-14">
      <nav aria-label={t("breadcrumbLabel")} className="text-sm text-muted">
        <a href={projectPath} className="font-semibold hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">{project.title}</a>
        <span className="mx-2" aria-hidden="true">/</span>{t("title")}
      </nav>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{t("eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-muted">{t("intro", {project: project.title})}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={getLocalizedPath(locale, `/projects/${project.slug}/compare`)} className={buttonStyles({variant: "secondary", size: "sm"})}>{t("compare")}</Link>
          <ShareButton projectTitle={project.title} context="datasetExplorer" />
        </div>
      </div>

      <ExplorerControls key={explorerHref(basePath, controls, pageNumber)} basePath={basePath} columns={page.columns} controls={controls} page={pageNumber} />

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{t("results")}</h2>
        <p aria-live="polite" className="text-sm font-semibold text-muted">{t("count", {count: page.totalCount})}</p>
      </div>
      {page.rows.length > 0 ? (
        <div role="region" aria-label={t("tableLabel")} tabIndex={0} className="mt-4 max-w-full overflow-x-auto rounded-card border border-border focus-visible:outline-2 focus-visible:outline-primary">
          <table className="min-w-full w-max border-collapse text-left text-sm">
            <thead className="bg-surface-raised"><tr>{page.columns.map((column) => <th scope="col" key={column.name} className="whitespace-nowrap border-b border-border px-4 py-3 font-bold">{column.name}</th>)}</tr></thead>
            <tbody>{page.rows.map((row) => <tr key={row.rowIndex} className="border-t border-border first:border-0">{page.columns.map((column) => <td key={column.name} className="max-w-72 break-words px-4 py-3 align-top text-muted">{cellText(row.data[column.name], locale, t("yes"), t("no"))}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : (
        <div role="status" className="mt-4 rounded-card border border-border bg-card p-7">
          <h3 className="font-bold">{page.totalCount === 0 && !active ? t("emptyTitle") : t("zeroTitle")}</h3>
          <p className="mt-2 text-sm text-muted">{page.totalCount === 0 && !active ? t("emptyDescription") : t("zeroDescription")}</p>
          {active ? <Link href={basePath} scroll={false} className={`${buttonStyles({variant: "secondary", size: "sm"})} mt-4`}>{t("reset")}</Link> : null}
        </div>
      )}
      {page.totalCount > 0 ? (
        <nav aria-label={t("paginationLabel")} className="mt-5 flex items-center justify-between gap-3">
          {pageNumber > 1 ? <Link href={explorerHref(basePath, controls, pageNumber - 1)} scroll={false} className={buttonStyles({variant: "secondary", size: "sm"})}>{t("previous")}</Link> : <span />}
          <span className="text-sm text-muted">{t("pageOf", {page: pageNumber, pages: Math.max(1, Math.ceil(page.totalCount / 25))})}</span>
          {page.hasMore && pageNumber < 401 ? <Link href={explorerHref(basePath, controls, pageNumber + 1)} scroll={false} className={buttonStyles({variant: "secondary", size: "sm"})}>{t("next")}</Link> : <span />}
        </nav>
      ) : null}
      <section aria-labelledby="data-dictionary-title" className="mt-12 border-t border-border pt-8">
        <h2 id="data-dictionary-title" className="text-xl font-bold">{t("dictionary.title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("dictionary.intro")}</p>
        <dl className="mt-5 divide-y divide-border border-y border-border">
          {page.columns.map((column) => {
            const metadata = page.dictionary[column.name];
            const label = metadata?.label[locale]?.trim();
            const description = metadata?.description[locale]?.trim();
            const dataType = metadata?.dataType ?? column.type;
            return (
              <div key={column.name} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6">
                <dt className="min-w-0">
                  {label ? <span className="block font-semibold">{label}</span> : null}
                  <code className="break-all text-sm text-muted">{column.name}</code>
                </dt>
                <dd className="min-w-0 text-sm">
                  {description ? <p className="leading-6">{description}</p> : null}
                  <div className={`flex flex-wrap gap-x-4 gap-y-1 text-muted ${description ? "mt-2" : ""}`}>
                    <span>{t("dictionary.type")}: {t(`dictionary.types.${dataType}`)}</span>
                    {metadata?.unit ? <span>{t("dictionary.unit")}: {metadata.unit}</span> : null}
                    {metadata?.format ? <span>{t("dictionary.format")}: {metadata.format}</span> : null}
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
      <section aria-labelledby="data-quality-title" className="mt-12 border-t border-border pt-8">
        <h2 id="data-quality-title" className="text-xl font-bold">{t("quality.title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("quality.intro")}</p>
        {quality ? (
          <>
            <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-5">
              <div><dt className="text-sm text-muted">{t("quality.totalRows")}</dt><dd className="mt-1 text-2xl font-bold">{formatCount(quality.totalRows)}</dd></div>
              <div><dt className="text-sm text-muted">{t("quality.publicFields")}</dt><dd className="mt-1 text-2xl font-bold">{formatCount(quality.publicFieldCount)}</dd></div>
            </dl>
            <div className="divide-y divide-border">
              {quality.fields.map((field) => {
                const label = page.dictionary[field.name]?.label[locale]?.trim();
                return (
                  <article key={field.name} className="grid min-w-0 gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6">
                    <div className="min-w-0">
                      {label ? <h3 className="font-semibold">{label}</h3> : null}
                      <code className="break-all text-sm text-muted">{field.name}</code>
                      <p className="mt-1 text-sm text-muted">{t("dictionary.type")}: {t(`dictionary.types.${field.type}`)}</p>
                    </div>
                    <dl className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                      <div><dt className="text-muted">{t("quality.nonNull")}</dt><dd className="mt-0.5 font-semibold">{formatCount(field.nonNullCount)}</dd></div>
                      <div><dt className="text-muted">{t("quality.missing")}</dt><dd className="mt-0.5 font-semibold">{formatCount(field.missingCount)}</dd></div>
                      {field.completenessPercent !== null ? <div><dt className="text-muted">{t("quality.completeness")}</dt><dd className="mt-0.5 font-semibold">{formatPercent(field.completenessPercent)}</dd></div> : null}
                      {field.invalidTypeCount !== null ? <div><dt className="text-muted">{t("quality.invalidType")}</dt><dd className="mt-0.5 font-semibold">{formatCount(field.invalidTypeCount)}</dd></div> : null}
                      {field.validityPercent !== null ? <div><dt className="text-muted">{t("quality.validity")}</dt><dd className="mt-0.5 font-semibold">{formatPercent(field.validityPercent)}</dd></div> : null}
                    </dl>
                  </article>
                );
              })}
            </div>
          </>
        ) : <p role="status" className="mt-5 text-sm text-muted">{t("quality.unavailable")}</p>}
      </section>
      <DatasetTrust locale={locale} slug={project.slug} source={source} metadata={trust} quality={quality} publicFieldCount={page.columns.length} />
    </Container>
  );
}
