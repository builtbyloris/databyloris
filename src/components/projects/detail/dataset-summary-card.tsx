import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import {getLocalizedPath} from "@/lib/seo";
import type {DatasetSummary} from "@/types";

export async function DatasetSummaryCard({dataset, locale, slug, explorerAvailable}: {dataset: DatasetSummary; locale: AppLocale; slug: string; explorerAvailable: boolean}) {
  const t = await getTranslations("ProjectDetail.dataset");
  const recordCount = dataset.records !== undefined
    ? new Intl.NumberFormat(locale).format(dataset.records)
    : null;

  return (
    <div className="border-y border-border py-6 sm:py-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("label")}</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight">{dataset.name}</h3>
          </div>
          {dataset.sourceUrl ? (
            <a href={dataset.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong hover:underline">
              {t("viewSource")} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted">{localize(dataset.description, locale)}</p>
        <dl className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("source")}</dt>
            <dd className="mt-2 text-sm font-semibold">{localize(dataset.source, locale)}</dd>
          </div>
          {recordCount !== null ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("records")}</dt>
              <dd className="mt-2 text-sm font-semibold">{recordCount}</dd>
            </div>
          ) : null}
          {dataset.period ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("period")}</dt>
              <dd className="mt-2 text-sm font-semibold">{localize(dataset.period, locale)}</dd>
            </div>
          ) : null}
        </dl>
        {explorerAvailable ? (
          <a href={getLocalizedPath(locale, `/projects/${slug}/dataset`)} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
            {t("explore")} <span className="ml-2" aria-hidden="true">→</span>
          </a>
        ) : null}
    </div>
  );
}
