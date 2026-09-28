import type {AdminDatasetDraft, DashboardRecord, DashboardValue, DatasetColumn, DatasetColumnType} from "@/types";
import type {Database, Json} from "@/types/database";

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
    fields: columns.map((column) => column.name),
    source: "database",
    updatedAt: row.updated_at,
  };
}
