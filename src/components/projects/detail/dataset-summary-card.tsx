import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {DatasetSummary} from "@/types";

export async function DatasetSummaryCard({dataset, locale}: {dataset: DatasetSummary; locale: AppLocale}) {
  const t = await getTranslations("ProjectDetail.dataset");
  const recordCount = dataset.records !== undefined
    ? new Intl.NumberFormat(locale).format(dataset.records)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.7fr)] lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("label")}</p>
        <h3 className="mt-3 font-editorial text-2xl sm:text-3xl">{dataset.name}</h3>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">{localize(dataset.description, locale)}</p>
        {dataset.sourceUrl ? (
          <a href={dataset.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong hover:underline">
            {t("viewSource")} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
      <dl className="border-t border-border lg:border-t-0">
        <div className="border-b border-border py-4 first:pt-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("source")}</dt>
          <dd className="mt-2 text-sm font-semibold leading-6">{localize(dataset.source, locale)}</dd>
        </div>
        {recordCount !== null ? (
          <div className="border-b border-border py-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("records")}</dt>
            <dd className="mt-2 text-lg font-semibold tabular-nums">{recordCount}</dd>
          </div>
        ) : null}
        {dataset.period ? (
          <div className="border-b border-border py-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{t("period")}</dt>
            <dd className="mt-2 text-sm font-semibold leading-6">{localize(dataset.period, locale)}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
