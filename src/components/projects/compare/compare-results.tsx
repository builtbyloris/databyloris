import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import type {DatasetComparison, CompareSegment} from "@/lib/repositories/public-dataset-compare-repository";

function formatValue(value: number | null, locale: AppLocale, unit: string | undefined, fallback: string, fixedDecimals = false) {
  if (value === null) return fallback;
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fixedDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
  return unit ? `${number} ${unit}` : number;
}

async function SegmentResult({name, value, result, locale, unit}: {
  name: string;
  value: string;
  result: CompareSegment;
  locale: AppLocale;
  unit?: string;
}) {
  const t = await getTranslations("Compare");
  const count = (number: number) => new Intl.NumberFormat(locale).format(number);

  return (
    <article className="min-w-0 rounded-card border border-border bg-card p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-strong">{name}</p>
      <h3 className="mt-2 break-words text-xl font-bold">{value}</h3>
      {result.recordCount === 0 ? <p className="mt-3 text-sm text-muted">{t("emptySegment")}</p> : null}
      {result.recordCount > 0 && result.average === null ? <p className="mt-3 text-sm text-muted">{t("missingMetric")}</p> : null}
      <dl className="mt-5 divide-y divide-border border-t border-border text-sm">
        <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-muted">{t("records")}</dt><dd className="font-semibold">{count(result.recordCount)}</dd></div>
        <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-muted">{t("average")}</dt><dd className="font-semibold">{formatValue(result.average, locale, unit, t("notAvailable"), true)}</dd></div>
        <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-muted">{t("minimum")}</dt><dd className="font-semibold">{formatValue(result.min, locale, unit, t("notAvailable"))}</dd></div>
        <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-muted">{t("maximum")}</dt><dd className="font-semibold">{formatValue(result.max, locale, unit, t("notAvailable"))}</dd></div>
        <div className="flex items-baseline justify-between gap-3 py-3"><dt className="text-muted">{t("missing")}</dt><dd className="font-semibold">{count(result.missingMetricCount)}</dd></div>
      </dl>
    </article>
  );
}

export async function CompareResults({comparison, valueA, valueB, locale, unit, format}: {
  comparison: DatasetComparison;
  valueA: string;
  valueB: string;
  locale: AppLocale;
  unit?: string;
  format?: string;
}) {
  const t = await getTranslations("Compare");
  return (
    <section aria-labelledby="compare-results-title" className="mt-8">
      <h2 id="compare-results-title" className="sr-only">{t("title")}</h2>
      {format ? <p className="mb-3 text-sm text-muted">{t("format", {format})}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <SegmentResult name={t("segmentA")} value={valueA} result={comparison.segments.a} locale={locale} unit={unit} />
        <SegmentResult name={t("segmentB")} value={valueB} result={comparison.segments.b} locale={locale} unit={unit} />
      </div>
      <div className="mt-5 border-t border-border pt-5">
        <h3 className="font-bold">{t("deltaTitle")}</h3>
        <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div><dt className="text-muted">{t("deltaAbsolute")}</dt><dd className="mt-1 text-lg font-semibold">{formatValue(comparison.deltaAbsolute, locale, unit, t("notAvailable"), true)}</dd></div>
          <div><dt className="text-muted">{t("deltaPercent")}</dt><dd className="mt-1 text-lg font-semibold">{comparison.deltaPercent === null ? t("notAvailable") : `${new Intl.NumberFormat(locale, {maximumFractionDigits: 2}).format(comparison.deltaPercent)}%`}</dd></div>
        </dl>
      </div>
    </section>
  );
}
