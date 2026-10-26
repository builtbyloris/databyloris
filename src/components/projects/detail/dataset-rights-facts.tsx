import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import type {PublicDatasetRights} from "@/lib/repositories/public-dataset-rights-repository";

export async function DatasetRightsFacts({dataset, locale, compact = false}: {
  dataset: PublicDatasetRights;
  locale: AppLocale;
  compact?: boolean;
}) {
  const t = await getTranslations("DatasetRightsPublic");
  const {rights} = dataset;
  const transformations = rights.transformations[locale]?.trim();
  const restrictions = rights.restrictions[locale]?.trim();
  const facts = [
    {key: "author", value: rights.sourceAuthor},
    {key: "period", value: rights.dataPeriod},
    {key: "snapshot", value: rights.snapshotDate},
    {key: dataset.reviewed ? "license" : "sourceLicense", value: `${t(`licenses.${rights.licenseType}`)}${rights.licenseVersion ? ` ${rights.licenseVersion}` : ""}`, url: rights.licenseUrl},
    ...(!compact ? [{key: "transformations", value: transformations}, {key: "restrictions", value: restrictions}] : []),
  ].filter((item) => item.value);
  if (facts.length === 0) return null;
  return <section aria-label={t("title")} className="mt-6 border-t border-border pt-5">
    <h3 className="text-sm font-bold">{t("title")}</h3>
    <dl className="mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {facts.map((item) => <div key={item.key} className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{t(item.key)}</dt><dd className="mt-1 break-words text-sm leading-6">{item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-strong underline-offset-2 hover:underline">{item.value} ↗</a> : item.value}</dd></div>)}
    </dl>
    <a href={rights.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-primary-strong underline-offset-2 hover:underline">{t("viewSource")} ↗</a>
  </section>;
}
