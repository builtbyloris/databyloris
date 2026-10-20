import {hasLocale} from "next-intl";
import {getTranslations} from "next-intl/server";
import {routing} from "@/i18n/routing";
import {createCsv, csvDownloadResponse} from "@/lib/export/csv";
import {getPublishedCompareOptions, getPublishedDatasetComparison} from "@/lib/repositories/public-dataset-compare-repository";
import {getPublishedExplorerDatasetId, getPublishedExplorerPage} from "@/lib/repositories/public-explorer-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request, {params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  if (!hasLocale(routing.locales, locale)) return new Response(null, {status: 404});

  try {
    const datasetId = await getPublishedExplorerDatasetId(slug);
    if (!datasetId) return new Response(null, {status: 404});
    const baseline = await getPublishedExplorerPage(slug, datasetId, {
      offset: 0, search: null, filterField: null, filterValue: null,
      sortField: null, sortDirection: "asc",
    });
    if (!baseline) return new Response(null, {status: 404});

    const query = new URL(request.url).searchParams;
    const dimension = query.get("dimension") ?? "";
    const valueA = query.get("a") ?? "";
    const valueB = query.get("b") ?? "";
    const metric = query.get("metric") ?? "";
    if (valueA === valueB || !valueA || !valueB || valueA.length > 200 || valueB.length > 200
      || !baseline.columns.some((column) => column.name === dimension && (column.type === "string" || column.type === "boolean"))
      || !baseline.columns.some((column) => column.name === metric && column.type === "number")) {
      return new Response(null, {status: 400});
    }
    const options = await getPublishedCompareOptions(slug, dimension);
    if (!options || !options.includes(valueA) || !options.includes(valueB)) return new Response(null, {status: 400});
    const comparison = await getPublishedDatasetComparison(slug, dimension, valueA, valueB, metric);
    if (!comparison) return new Response(null, {status: 404});

    const t = await getTranslations({locale, namespace: "Export.compare"});
    const headers = [
      t("dimension"), t("valueA"), t("valueB"), t("metric"),
      t("aRecords"), t("aAverage"), t("aMin"), t("aMax"), t("aMissing"),
      t("bRecords"), t("bAverage"), t("bMin"), t("bMax"), t("bMissing"),
      t("deltaAbsolute"), t("deltaPercent"),
    ];
    const a = comparison.segments.a;
    const b = comparison.segments.b;
    const csv = createCsv(headers, [[
      dimension, valueA, valueB, metric,
      a.recordCount, a.average, a.min, a.max, a.missingMetricCount,
      b.recordCount, b.average, b.min, b.max, b.missingMetricCount,
      comparison.deltaAbsolute, comparison.deltaPercent,
    ]]);
    const safeSlug = slug.replaceAll(/[^a-z0-9-]/g, "-");
    return csvDownloadResponse(csv, `${safeSlug}-compare.csv`);
  } catch {
    return new Response(null, {status: 500});
  }
}
