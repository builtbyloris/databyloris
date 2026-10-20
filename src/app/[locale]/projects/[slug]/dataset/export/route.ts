import {hasLocale} from "next-intl";
import {routing} from "@/i18n/routing";
import {createCsv, csvDownloadResponse} from "@/lib/export/csv";
import {EXPLORER_EXPORT_LIMIT, ExplorerExportLimitError} from "@/lib/export/explorer-limit";
import {
  getPublishedExplorerDatasetId,
  getPublishedExplorerExport,
  getPublishedExplorerPage,
} from "@/lib/repositories/public-explorer-repository";

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

    const params = new URL(request.url).searchParams;
    const search = (params.get("search") ?? "").trim();
    const filterField = params.get("filter") ?? "";
    const filterValue = params.get("value") ?? "";
    const sortField = params.get("sort") ?? "";
    const direction = params.get("dir") ?? "asc";
    const allowed = new Set(baseline.columns.map((column) => column.name));
    if (search.length > 100 || filterValue.length > 200
      || (filterField && !allowed.has(filterField))
      || (sortField && !allowed.has(sortField))
      || (filterValue && !filterField)
      || (direction !== "asc" && direction !== "desc")) {
      return new Response(null, {status: 400});
    }

    const exportPage = await getPublishedExplorerExport(slug, datasetId, {
      search: search || null,
      filterField: filterField || null,
      filterValue: filterField && filterValue ? filterValue : null,
      sortField: sortField || null,
      sortDirection: direction,
    });
    if (!exportPage) return new Response(null, {status: 404});
    const headers = exportPage.columns.map((column) => exportPage.dictionary[column.name]?.label[locale]?.trim() || column.name);
    const rows = exportPage.rows.map((row) => exportPage.columns.map((column) => row.data[column.name]));
    const csv = createCsv(headers, rows);
    const safeSlug = slug.replaceAll(/[^a-z0-9-]/g, "-");
    return csvDownloadResponse(csv, `${safeSlug}-dataset.csv`);
  } catch (error) {
    if (error instanceof ExplorerExportLimitError) {
      return new Response(null, {status: 413, headers: {"X-Export-Limit": String(EXPLORER_EXPORT_LIMIT)}});
    }
    return new Response(null, {status: 500});
  }
}
