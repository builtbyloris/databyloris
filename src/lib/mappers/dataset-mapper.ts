import type {AdminDatasetDraft, DashboardRecord, DashboardValue, DatasetColumn, DatasetColumnType, DatasetDictionary} from "@/types";
import type {Database, Json} from "@/types/database";
import {getAvailableDatasetFields} from "@/lib/datasets/field-names";
import {parseDatasetRights} from "@/lib/datasets/rights";

type DatasetRow = Database["public"]["Tables"]["datasets"]["Row"];

const columnTypes: DatasetColumnType[] = ["string", "number", "boolean", "date"];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseColumn(value: unknown): DatasetColumn | null {
  if (!isObject(value)
    || typeof value.name !== "string"
    || !columnTypes.includes(value.type as DatasetColumnType)
    || typeof value.nullable !== "boolean") return null;
  return {name: value.name, type: value.type as DatasetColumnType, nullable: value.nullable};
}

export function datasetSchemaFromJson(value: Json): DatasetColumn[] {
  if (!isObject(value) || !Array.isArray(value.columns)) throw new Error("Invalid dataset schema");
  const columns = value.columns.map(parseColumn);
  if (columns.some((column) => column === null)) throw new Error("Invalid dataset schema");
  return columns as DatasetColumn[];
}

function originalFilenameFromJson(value: Json) {
  return isObject(value) && typeof value.originalFilename === "string"
    ? value.originalFilename
    : null;
}

export function datasetSchemaToJson(columns: DatasetColumn[], originalFilename: string): Json {
  return {columns: columns.map((column) => ({...column})), originalFilename};
}

export function datasetDictionaryFromJson(value: Json, columns: DatasetColumn[]): DatasetDictionary {
  if (!isObject(value) || !isObject(value.dictionary)) return {};
  const allowed = new Set(columns.map((column) => column.name));
  const dictionary: DatasetDictionary = {};
  for (const [name, raw] of Object.entries(value.dictionary)) {
    if (!allowed.has(name) || !isObject(raw)) continue;
    const label = isObject(raw.label) ? raw.label : {};
    const description = isObject(raw.description) ? raw.description : {};
    dictionary[name] = {
      label: {it: typeof label.it === "string" ? label.it : "", en: typeof label.en === "string" ? label.en : ""},
      description: {it: typeof description.it === "string" ? description.it : "", en: typeof description.en === "string" ? description.en : ""},
      ...(columnTypes.includes(raw.dataType as DatasetColumnType) ? {dataType: raw.dataType as DatasetColumnType} : {}),
      ...(typeof raw.unit === "string" ? {unit: raw.unit} : {}),
      ...(typeof raw.format === "string" ? {format: raw.format} : {}),
    };
  }
  return dictionary;
}

function isDashboardValue(value: unknown): value is DashboardValue {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

export function datasetRecordFromJson(value: Json): DashboardRecord {
  if (!isObject(value)) throw new Error("Invalid dataset record");
  const entries = Object.entries(value);
  if (entries.some(([, entry]) => !isDashboardValue(entry))) throw new Error("Invalid dataset record");
  return Object.fromEntries(entries) as DashboardRecord;
}

export function datasetRecordToJson(record: DashboardRecord): Json {
  return {...record};
}

export function datasetRowToAdminDraft(
  row: DatasetRow,
  records: DashboardRecord[],
): AdminDatasetDraft {
  const columns = datasetSchemaFromJson(row.schema);
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    originalFilename: originalFilenameFromJson(row.schema),
    storagePath: row.storage_path,
    grain: row.grain ?? "",
    recordCount: row.record_count,
    columns,
    records,
    fields: getAvailableDatasetFields(columns.map((column) => column.name), records),
    explorerEnabled: row.explorer_enabled,
    explorerFields: row.explorer_fields,
    dictionary: datasetDictionaryFromJson(row.schema, columns),
    rights: parseDatasetRights(row.rights_metadata),
    dashboardFields: row.dashboard_fields ?? [],
    dashboardPublicEnabled: row.dashboard_public_enabled ?? false,
    csvExportEnabled: row.csv_export_enabled ?? false,
    rightsLegacy: row.rights_legacy ?? false,
    source: "database",
    updatedAt: row.updated_at,
  };
}
