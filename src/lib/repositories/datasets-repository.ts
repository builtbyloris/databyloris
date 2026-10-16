import "server-only";

import {
  datasetRecordFromJson,
  datasetRecordToJson,
  datasetRowToAdminDraft,
  datasetSchemaFromJson,
  datasetSchemaToJson,
} from "@/lib/mappers/dataset-mapper";
import {getAvailableDatasetFields} from "@/lib/datasets/field-names";
import {createClient} from "@/lib/supabase/server";
import type {AdminDatasetDraft, DashboardRecord, DatasetColumn, DatasetColumnType, DatasetDictionary} from "@/types";
import type {Json} from "@/types/database";
import {DATASET_MAX_ROWS, DATASET_ROW_BATCH_SIZE, DATASET_STORAGE_BUCKET} from "@/lib/datasets";
import {RepositoryError} from "./repository-error";

export interface CreateDatasetInput {
  projectId: string;
  name: string;
  originalFilename: string;
  storagePath: string;
  grain: string;
  columns: DatasetColumn[];
  records: DashboardRecord[];
}

export async function listProjectDatasets(projectId: string) {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from("datasets")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", {ascending: false});
  if (error) throw new RepositoryError("database");
  return data;
}

export async function getAdminProjectDataset(projectId: string): Promise<AdminDatasetDraft | null> {
  const datasets = await listProjectDatasets(projectId);
  const row = datasets[0];
  if (!row) return null;
  const records = await getDatasetRows(row.id);

  try {
    return datasetRowToAdminDraft(row, records);
  } catch {
    throw new RepositoryError("invalid_data");
  }
}

export async function getAdminProjectDatasetFields(projectId: string): Promise<string[] | null> {
  const datasets = await listProjectDatasets(projectId);
  if (!datasets[0]) return null;
  let schemaFields: string[];
  try {
    schemaFields = datasetSchemaFromJson(datasets[0].schema).map((column) => column.name);
  } catch {
    throw new RepositoryError("invalid_data");
  }
  return getAvailableDatasetFields(schemaFields, await getDatasetRows(datasets[0].id));
}

export async function getDatasetRows(datasetId: string): Promise<DashboardRecord[]> {
  const supabase = await createClient();
  const pageSize = 1_000;
  const records: DashboardRecord[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const {data, error} = await supabase
      .from("dataset_rows")
      .select("data")
      .eq("dataset_id", datasetId)
      .order("row_index", {ascending: true})
      .range(offset, offset + pageSize - 1);
    if (error) throw new RepositoryError("database");
    try {
      records.push(...data.map(({data: record}) => datasetRecordFromJson(record)));
    } catch {
      throw new RepositoryError("invalid_data");
    }
    if (data.length < pageSize) return records;
    if (records.length >= DATASET_MAX_ROWS) {
      const {data: overflow, error: overflowError} = await supabase
        .from("dataset_rows")
        .select("id")
        .eq("dataset_id", datasetId)
        .order("row_index", {ascending: true})
        .range(DATASET_MAX_ROWS, DATASET_MAX_ROWS);
      if (overflowError) throw new RepositoryError("database");
      if (overflow.length > 0) throw new RepositoryError("invalid_data");
      return records;
    }
  }
}

export async function createDatasetWithRows(input: CreateDatasetInput): Promise<AdminDatasetDraft> {
  const supabase = await createClient();
  const {data: row, error} = await supabase
    .from("datasets")
    .insert({
      project_id: input.projectId,
      name: input.name,
      storage_path: input.storagePath,
      grain: input.grain || null,
      record_count: input.records.length,
      schema: datasetSchemaToJson(input.columns, input.originalFilename),
    })
    .select("*")
    .single();
  if (error) throw new RepositoryError("database");

  try {
    for (let offset = 0; offset < input.records.length; offset += DATASET_ROW_BATCH_SIZE) {
      const batch = input.records.slice(offset, offset + DATASET_ROW_BATCH_SIZE).map((record, index) => ({
        dataset_id: row.id,
        row_index: offset + index,
        data: datasetRecordToJson(record),
      }));
      const {error: rowsError} = await supabase.from("dataset_rows").insert(batch);
      if (rowsError) throw new RepositoryError("database");
    }
    return datasetRowToAdminDraft(row, input.records);
  } catch (error) {
    await supabase.from("datasets").delete().eq("id", row.id);
    throw error;
  }
}

export async function updateDatasetGrain(datasetId: string, grain: string): Promise<AdminDatasetDraft> {
  const supabase = await createClient();
  const {data: row, error} = await supabase
    .from("datasets")
    .update({grain: grain || null})
    .eq("id", datasetId)
    .select("*")
    .maybeSingle();
  if (error) throw new RepositoryError("database");
  if (!row) throw new RepositoryError("not_found");

  const records = await getDatasetRows(datasetId);
  try {
    return datasetRowToAdminDraft(row, records);
  } catch {
    throw new RepositoryError("invalid_data");
  }
}

export async function updateDatasetExplorer(
  projectId: string,
  datasetId: string,
  enabled: boolean,
  fields: string[],
): Promise<AdminDatasetDraft> {
  const supabase = await createClient();
  const {data: existing, error: readError} = await supabase
    .from("datasets")
    .select("schema")
    .eq("id", datasetId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (readError) throw new RepositoryError("database");
  if (!existing) throw new RepositoryError("not_found");

  let schemaFields: string[];
  try {
    schemaFields = datasetSchemaFromJson(existing.schema).map((column) => column.name);
  } catch {
    throw new RepositoryError("invalid_data");
  }
  if (new Set(schemaFields).size !== schemaFields.length
    || new Set(fields).size !== fields.length
    || fields.some((field) => !schemaFields.includes(field))) {
    throw new RepositoryError("invalid_data");
  }

  const {data: row, error} = await supabase
    .from("datasets")
    .update({explorer_enabled: enabled, explorer_fields: fields})
    .eq("id", datasetId)
    .eq("project_id", projectId)
    .select("*")
    .maybeSingle();
  if (error) throw new RepositoryError("database");
  if (!row) throw new RepositoryError("not_found");
  return datasetRowToAdminDraft(row, await getDatasetRows(datasetId));
}

export async function updateDatasetDictionary(
  projectId: string,
  datasetId: string,
  input: DatasetDictionary,
): Promise<AdminDatasetDraft> {
  const supabase = await createClient();
  const {data: existing, error: readError} = await supabase.from("datasets")
    .select("schema").eq("id", datasetId).eq("project_id", projectId).maybeSingle();
  if (readError) throw new RepositoryError("database");
  if (!existing) throw new RepositoryError("not_found");

  let columns: DatasetColumn[];
  try {
    columns = datasetSchemaFromJson(existing.schema);
  } catch {
    throw new RepositoryError("invalid_data");
  }
  const byName = new Map(columns.map((column) => [column.name, column]));
  if (byName.size !== columns.length || Object.keys(input).length > columns.length) {
    throw new RepositoryError("invalid_data");
  }
  const dictionary: Record<string, Json> = {};
  for (const [name, metadata] of Object.entries(input)) {
    const column = byName.get(name);
    if (!column || !metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      throw new RepositoryError("invalid_data");
    }
    const {label, description, dataType, unit, format} = metadata;
    if (!label || !description || typeof label.it !== "string" || typeof label.en !== "string"
      || typeof description.it !== "string" || typeof description.en !== "string"
      || [label.it, label.en].some((text) => text.length > 120)
      || [description.it, description.en].some((text) => text.length > 500)
      || (dataType !== undefined && !(["string", "number", "boolean", "date"] as DatasetColumnType[]).includes(dataType))
      || (unit !== undefined && (typeof unit !== "string" || unit.length > 40))
      || (format !== undefined && (typeof format !== "string" || format.length > 40))) {
      throw new RepositoryError("invalid_data");
    }
    const normalized = {
      label: {it: label.it.trim(), en: label.en.trim()},
      description: {it: description.it.trim(), en: description.en.trim()},
      ...(dataType && dataType !== column.type ? {dataType} : {}),
      ...(unit?.trim() ? {unit: unit.trim()} : {}),
      ...(format?.trim() ? {format: format.trim()} : {}),
    };
    if (normalized.label.it || normalized.label.en || normalized.description.it || normalized.description.en
      || "dataType" in normalized || "unit" in normalized || "format" in normalized) {
      dictionary[name] = normalized;
    }
  }
  if (!existing.schema || typeof existing.schema !== "object" || Array.isArray(existing.schema)) {
    throw new RepositoryError("invalid_data");
  }
  const {data: row, error} = await supabase.from("datasets")
    .update({schema: {...existing.schema, dictionary}})
    .eq("id", datasetId).eq("project_id", projectId).select("*").maybeSingle();
  if (error) throw new RepositoryError("database");
  if (!row) throw new RepositoryError("not_found");
  return datasetRowToAdminDraft(row, await getDatasetRows(datasetId));
}

export async function deleteDataset(datasetId: string) {
  const supabase = await createClient();
  const {error} = await supabase.from("datasets").delete().eq("id", datasetId);
  if (error) throw new RepositoryError("database");
}

export async function downloadDatasetFile(storagePath: string) {
  const supabase = await createClient();
  const {data, error} = await supabase.storage.from(DATASET_STORAGE_BUCKET).download(storagePath);
  if (error) throw new RepositoryError("database");
  return data;
}

export async function removeDatasetFile(storagePath: string) {
  const supabase = await createClient();
  const {error} = await supabase.storage.from(DATASET_STORAGE_BUCKET).remove([storagePath]);
  if (error) throw new RepositoryError("database");
}
