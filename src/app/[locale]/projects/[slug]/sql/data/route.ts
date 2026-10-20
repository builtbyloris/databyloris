import {hasLocale} from "next-intl";
import {routing} from "@/i18n/routing";
import {EXPLORER_EXPORT_LIMIT, ExplorerExportLimitError} from "@/lib/export/explorer-limit";
import {getPublishedExplorerDatasetId, getPublishedExplorerExport} from "@/lib/repositories/public-explorer-repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, {params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  if (!hasLocale(routing.locales, locale)) return new Response(null, {status: 404});
  try {
    const datasetId = await getPublishedExplorerDatasetId(slug);
    if (!datasetId) return new Response(null, {status: 404});
    const page = await getPublishedExplorerExport(slug, datasetId, {
      search: null, filterField: null, filterValue: null,
      sortField: null, sortDirection: "asc",
    });
    if (!page) return new Response(null, {status: 404});
    return Response.json({
      columns: page.columns,
      rows: page.rows.map((row) => page.columns.map((column) => row.data[column.name] ?? null)),
      totalCount: page.totalCount,
    }, {headers: {"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"}});
  } catch (error) {
    if (error instanceof ExplorerExportLimitError) {
      return new Response(null, {status: 413, headers: {"X-Sql-Lab-Limit": String(EXPLORER_EXPORT_LIMIT)}});
    }
    return new Response(null, {status: 500});
  }
}
