import Image from "next/image";
import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {PublicDatasetRights} from "@/lib/repositories/public-dataset-rights-repository";
import type {ProjectDetail} from "@/types";
import {DatasetRightsFacts} from "./dataset-rights-facts";
import {DatasetSummaryCard} from "./dataset-summary-card";
import {MethodologySteps} from "./methodology-steps";
import {ProjectDetailNav} from "./project-detail-nav";
import {ProjectDetailSection} from "./project-detail-section";
import {ProjectInsights} from "./project-insights";

const figures = [
  {id: "retailer", file: "retailer_revenue.png"},
  {id: "monthly", file: "monthly.png"},
  {id: "region", file: "region_revenue.png"},
  {id: "product", file: "product_revenue.png"},
  {id: "channel", file: "channel_margin.png"},
  {id: "holiday", file: "holiday.png"},
] as const;

const metrics = [
  {id: "rows", value: 9648, format: "integer"},
  {id: "units", value: 2478861, format: "integer"},
  {id: "revenue", value: 120.17, format: "millions"},
  {id: "profit", value: 47.22, format: "millions"},
  {id: "margin", value: 39.3, format: "percent"},
] as const;

function formatMetric(value: number, format: string, locale: AppLocale) {
  if (format === "millions") {
    const amount = new Intl.NumberFormat(locale, {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(value);
    return locale === "it" ? `${amount} M$` : `$${amount}M`;
  }
  if (format === "percent") return new Intl.NumberFormat(locale, {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(value / 100);
  return new Intl.NumberFormat(locale, {useGrouping: true}).format(value);
}

export async function AdidasStory({detail, locale, datasetRights}: {
  detail: ProjectDetail;
  locale: AppLocale;
  datasetRights: PublicDatasetRights | null;
}) {
  const t = await getTranslations("AdidasStory");

  return <>
    <ProjectDetailNav variant="adidas" />
    <div className="mx-auto w-full max-w-6xl px-gutter">
      <ProjectDetailSection id="overview" title={t("overview.title")}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="border-l-2 border-primary/60 pl-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">{t("overview.context")}</h3>
            <p className="mt-4 max-w-prose text-base leading-8 text-muted">{localize(detail.context, locale)}</p>
          </div>
          <div className="border-l-2 border-border pl-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">{t("overview.objective")}</h3>
            <p className="mt-4 max-w-prose text-base leading-8 text-muted">{localize(detail.objective, locale)}</p>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-7">
          <h3 className="font-editorial text-2xl">{t("overview.data")}</h3>
          <div className="mt-5"><DatasetSummaryCard dataset={detail.dataset} locale={locale} /></div>
          {datasetRights ? <DatasetRightsFacts dataset={datasetRights} locale={locale} /> : null}
        </div>
      </ProjectDetailSection>

      <ProjectDetailSection id="kpis" title={t("kpis.title")}>
        <p className="max-w-3xl text-base leading-7 text-muted">{t("kpis.intro")}</p>
        <dl className="mt-8 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map(({id, value, format}) => <div key={id} className="min-w-0 bg-surface p-5 sm:p-6">
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{t(`kpis.${id}.label`)}</dt>
            <dd className="mt-4 font-editorial text-3xl tabular-nums tracking-tight sm:text-4xl">{formatMetric(value, format, locale)}</dd>
            <p className="mt-3 text-xs leading-5 text-muted">{t(`kpis.${id}.note`)}</p>
          </div>)}
        </dl>
        <aside className="mt-7 max-w-4xl border-l-2 border-cyan pl-5 text-sm leading-7 text-muted">
          <strong className="text-foreground">{t("kpis.caveatTitle")}</strong> {t("kpis.caveat")}
        </aside>
      </ProjectDetailSection>

      <ProjectDetailSection id="methodology" title={t("methodology.title")}>
        <MethodologySteps steps={detail.methodology} locale={locale} />
      </ProjectDetailSection>

      <ProjectDetailSection id="analysis" title={t("analysis.title")}>
        <p className="max-w-3xl text-base leading-7 text-muted">{t("analysis.intro")}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-14">
          {figures.map(({id, file}) => <figure key={id} className="min-w-0 border-t border-border pt-5">
            <figcaption className="mb-5">
              <h3 className="text-xl font-semibold leading-snug">{t(`analysis.figures.${id}.title`)}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{t(`analysis.figures.${id}.caption`)}</p>
            </figcaption>
            <div className="overflow-hidden rounded-card border border-border bg-white p-2 sm:p-3">
              <Image src={`/images/projects/adidas/${file}`} width={1518} height={752} sizes="(max-width: 1023px) 100vw, 50vw" alt={t(`analysis.figures.${id}.alt`)} className="h-auto w-full" />
            </div>
            <a href={`/images/projects/adidas/${file}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary-strong underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary">
              {t("analysis.openFigure", {title: t(`analysis.figures.${id}.title`)})} ↗
            </a>
            <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted">{t(`analysis.figures.${id}.interpretation`)}</p>
          </figure>)}
        </div>
        <p className="mt-9 text-xs leading-6 text-muted">{t("analysis.credit")}</p>
      </ProjectDetailSection>

      <ProjectDetailSection id="insights" title={t("insights.title")}>
        <ProjectInsights insights={detail.insights} locale={locale} />
      </ProjectDetailSection>

      <ProjectDetailSection id="conclusions" title={t("conclusions.title")}>
        <p className="max-w-3xl font-editorial text-2xl leading-snug sm:text-3xl">{t("conclusions.lead")}</p>
        <ol className="mt-9 grid gap-7 md:grid-cols-3">
          {(["reconcile", "compare", "validate"] as const).map((id, index) => <li key={id} className="border-t border-border pt-5">
            <span className="text-xs font-bold tabular-nums tracking-widest text-cyan">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-lg font-semibold">{t(`conclusions.${id}.title`)}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{t(`conclusions.${id}.description`)}</p>
          </li>)}
        </ol>
        <p className="mt-8 max-w-3xl border-l-2 border-border pl-5 text-sm leading-7 text-muted">{t("conclusions.limit")}</p>
      </ProjectDetailSection>
    </div>
  </>;
}
