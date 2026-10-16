import "server-only";

import {datasetRecordFromJson} from "@/lib/mappers/dataset-mapper";
import {createClient} from "@/lib/supabase/server";
import type {DashboardRecord, DatasetColumn, DatasetDictionary, DatasetFieldMetadata} from "@/types";
import type {Json} from "@/types/database";
import {RepositoryError} from "./repository-error";

export interface ExplorerPage {
  columns: DatasetColumn[];
  rows: {rowIndex: number; data: DashboardRecord}[];
  totalCount: number;
  hasMore: boolean;
  dictionary: DatasetDictionary;
}

export interface ExplorerQuery {
  offset: number;
  search: string | null;
  filterField: string | null;
  filterValue: string | null;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}

function isObject(value: Json | undefined): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseExplorerPage(value: Json | null): ExplorerPage | null {
  if (value === null) return null;
  if (!isObject(value) || !Array.isArray(value.columns) || !Array.isArray(value.rows)
    || !Number.isSafeInteger(value.totalCount) || (value.totalCount as number) < 0
    || typeof value.hasMore !== "boolean") throw new RepositoryError("invalid_data");

  const columns = value.columns.map((column) => {
    if (!isObject(column) || typeof column.name !== "string"
      || !["string", "number", "boolean", "date"].includes(String(column.type))
      || typeof column.nullable !== "boolean") throw new RepositoryError("invalid_data");
    return {name: column.name, type: column.type, nullable: column.nullable} as DatasetColumn;
  });
  const fields = columns.map((column) => column.name);
  if (fields.length === 0 || new Set(fields).size !== fields.length) throw new RepositoryError("invalid_data");
  const rows = value.rows.map((row) => {
    if (!isObject(row) || !Number.isSafeInteger(row.rowIndex) || !isObject(row.data)) {
      throw new RepositoryError("invalid_data");
    }
    const data = datasetRecordFromJson(row.data);
    if (Object.keys(data).some((field) => !fields.includes(field))) throw new RepositoryError("invalid_data");
    return {rowIndex: row.rowIndex as number, data};
  });
  return {columns, rows, totalCount: value.totalCount as number, hasMore: value.hasMore, dictionary: {}};
}

function parseDictionary(value: Json | null, columns: DatasetColumn[]): DatasetDictionary | null {
  if (value === null) return null;
  if (!isObject(value)) throw new RepositoryError("invalid_data");
  const allowed = new Set(columns.map((column) => column.name));
  const dictionary: DatasetDictionary = {};
  for (const [name, raw] of Object.entries(value)) {
    if (!allowed.has(name) || !isObject(raw)) throw new RepositoryError("invalid_data");
    const label = isObject(raw.label) ? raw.label : {};
    const description = isObject(raw.description) ? raw.description : {};
    dictionary[name] = {
      label: {it: typeof label.it === "string" ? label.it : "", en: typeof label.en === "string" ? label.en : ""},
      description: {it: typeof description.it === "string" ? description.it : "", en: typeof description.en === "string" ? description.en : ""},
      ...(["string", "number", "boolean", "date"].includes(String(raw.dataType))
        ? {dataType: raw.dataType as DatasetFieldMetadata["dataType"]} : {}),
      ...(typeof raw.unit === "string" ? {unit: raw.unit} : {}),
      ...(typeof raw.format === "string" ? {format: raw.format} : {}),
    };
  }
  return dictionary;
}

export async function getPublishedExplorerDatasetId(slug: string): Promise<string | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_explorer_dataset_id", {p_slug: slug});
  if (error) throw new RepositoryError("database");
  return data;
}

export async function getPublishedExplorerPage(
  slug: string,
  datasetId: string,
  query: ExplorerQuery,
): Promise<ExplorerPage | null> {
  const supabase = await createClient();
  const [pageResult, dictionaryResult] = await Promise.all([supabase.rpc("get_published_explorer_page", {
    p_slug: slug,
    p_dataset_id: datasetId,
    p_offset: query.offset,
    p_page_size: 25,
    p_sort_field: query.sortField,
    p_sort_direction: query.sortDirection,
    p_search: query.search,
    p_filter_field: query.filterField,
    p_filter_value: query.filterValue,
  }), supabase.rpc("get_published_explorer_dictionary", {p_slug: slug, p_dataset_id: datasetId})]);
  if (pageResult.error) throw new RepositoryError("database");
  const page = parseExplorerPage(pageResult.data);
  if (!page) return null;
  // Keep the existing Explorer available while the additive dictionary RPC is deployed.
  if (dictionaryResult.error?.code === "PGRST202") return page;
  if (dictionaryResult.error) throw new RepositoryError("database");
  const dictionary = parseDictionary(dictionaryResult.data, page.columns);
  return dictionary ? {...page, dictionary} : null;
}
