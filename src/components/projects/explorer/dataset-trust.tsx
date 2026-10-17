import {getTranslations} from "next-intl/server";
import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {DatasetQuality} from "@/lib/repositories/public-dataset-quality-repository";
import type {DatasetTrustMetadata} from "@/lib/repositories/public-dataset-trust-repository";
import {getLocalizedPath} from "@/lib/seo";
import type {DatasetSummary} from "@/types";

export async function DatasetTrust({locale, slug, source, metadata, quality, publicFieldCount}: {
  locale: AppLocale;
  slug: string;
  source: DatasetSummary | null;
  metadata: DatasetTrustMetadata | null;
  quality: DatasetQuality | null;
  publicFieldCount: number;
}) {
  const t = await getTranslations("DatasetExplorer.trust");
  const count = (value: number) => new Intl.NumberFormat(locale).format(value);
  const completeFields = quality?.fields.filter((field) => field.completenessPercent === 100).length;
  const fieldsWithMissing = quality?.fields.filter((field) => field.missingCount > 0).length;
  const invalidTypes = quality?.fields.reduce((total, field) => total + (field.invalidTypeCount ?? 0), 0);

  return (
    <section aria-labelledby="dataset-trust-title" className="mt-12 border-t border-border pt-8">
      <h2 id="dataset-trust-title" className="text-xl font-bold">{t("title")}</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">{t("intro")}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="min-w-0">
          <h3 className="font-bold">{t("provenance")}</h3>
          <dl className="mt-3 space-y-4 border-t border-border pt-4 text-sm">
            {metadata ? <div><dt className="text-muted">{t("datasetName")}</dt><dd className="mt-1 break-words font-semibold">{metadata.name}</dd></div> : null}
            {source?.sourceUrl ? (
              <div><dt className="text-muted">{t("caseStudySource")}</dt><dd className="mt-1 min-w-0 break-words font-semibold">
                <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">
                  {localize(source.source, locale)} <span aria-hidden="true">↗</span>
                </a>
              </dd></div>
            ) : null}
            {metadata?.originalFilename ? <div><dt className="text-muted">{t("originalFilename")}</dt><dd className="mt-1 break-all font-semibold">{metadata.originalFilename}</dd></div> : null}
            {metadata ? <div><dt className="text-muted">{t("datasetUpdated")}</dt><dd className="mt-1 font-semibold"><time dateTime={metadata.updatedAt}>{new Intl.DateTimeFormat(locale, {dateStyle: "medium", timeStyle: "short"}).format(new Date(metadata.updatedAt))}</time></dd></div> : null}
            <div><dt className="text-muted">{t("methodology")}</dt><dd className="mt-1"><a href={getLocalizedPath(locale, `/projects/${slug}#methodology`)} className="font-semibold text-primary-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary">{t("viewMethodology")} <span aria-hidden="true">→</span></a></dd></div>
          </dl>
        </div>

        <div className="min-w-0">
          <h3 className="font-bold">{t("publicExposure")}</h3>
          <dl className="mt-3 space-y-4 border-t border-border pt-4 text-sm">
            {metadata ? <div><dt className="text-muted">{t("schemaFields")}</dt><dd className="mt-1 font-semibold">{count(metadata.schemaFieldCount)}</dd></div> : null}
            <div><dt className="text-muted">{t("publicFields")}</dt><dd className="mt-1 font-semibold">{count(publicFieldCount)}</dd></div>
            {metadata ? <div><dt className="text-muted">{t("exposure")}</dt><dd className="mt-1 font-semibold">{t("exposureValue", {publicCount: metadata.publicFieldCount, totalCount: metadata.schemaFieldCount})}</dd></div> : null}
            {metadata?.explorerEnabled ? <div><dt className="text-muted">{t("explorerStatus")}</dt><dd className="mt-1 font-semibold">{t("published")}</dd></div> : null}
          </dl>
        </div>

        <div className="min-w-0">
          <h3 className="font-bold">{t("qualityEvidence")}</h3>
          {quality ? (
            <>
              <dl className="mt-3 space-y-4 border-t border-border pt-4 text-sm">
                <div><dt className="text-muted">{t("rowsAnalyzed")}</dt><dd className="mt-1 font-semibold">{count(quality.totalRows)}</dd></div>
                <div><dt className="text-muted">{t("fieldsAnalyzed")}</dt><dd className="mt-1 font-semibold">{count(quality.publicFieldCount)}</dd></div>
                <div><dt className="text-muted">{t("completeFields")}</dt><dd className="mt-1 font-semibold">{count(completeFields ?? 0)}</dd></div>
                <div><dt className="text-muted">{t("fieldsWithMissing")}</dt><dd className="mt-1 font-semibold">{count(fieldsWithMissing ?? 0)}</dd></div>
                <div><dt className="text-muted">{t("invalidTypes")}</dt><dd className="mt-1 font-semibold">{count(invalidTypes ?? 0)}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-muted">{t("typeScope")}</p>
            </>
          ) : <p className="mt-3 border-t border-border pt-4 text-sm text-muted">{t("qualityUnavailable")}</p>}
        </div>
      </div>
    </section>
  );
}
