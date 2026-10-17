import "server-only";

import {createClient} from "@/lib/supabase/server";
import type {DatasetColumn, DatasetColumnType} from "@/types";
import type {Json} from "@/types/database";
import {RepositoryError} from "./repository-error";

export interface DatasetFieldQuality {
  name: string;
  type: DatasetColumnType;
  missingCount: number;
  nonNullCount: number;
  completenessPercent: number | null;
  invalidTypeCount: number | null;
  validityPercent: number | null;
}

export interface DatasetQuality {
  totalRows: number;
  publicFieldCount: number;
  fields: DatasetFieldQuality[];
}

function isObject(value: Json | undefined): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: Json | undefined): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isPercent(value: Json | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function parseQuality(value: Json | null, columns: DatasetColumn[]): DatasetQuality | null {
  if (value === null) return null;
  if (!isObject(value) || !isCount(value.totalRows) || !isCount(value.publicFieldCount)
    || !Array.isArray(value.fields) || value.publicFieldCount !== columns.length
    || value.fields.length !== columns.length) throw new RepositoryError("invalid_data");

  const fields = value.fields.map((item, index) => {
    const column = columns[index];
    if (!isObject(item) || item.name !== column.name || item.type !== column.type
      || !isCount(item.missingCount) || !isCount(item.nonNullCount)
      || item.missingCount + item.nonNullCount !== value.totalRows
      || (value.totalRows > 0 ? !isPercent(item.completenessPercent) : item.completenessPercent !== null)
      || (column.type === "date"
        ? item.invalidTypeCount !== null || item.validityPercent !== null
        : !isCount(item.invalidTypeCount) || item.invalidTypeCount > item.nonNullCount
          || (item.nonNullCount > 0 ? !isPercent(item.validityPercent) : item.validityPercent !== null))) {
      throw new RepositoryError("invalid_data");
    }
    return item as unknown as DatasetFieldQuality;
  });
  return {totalRows: value.totalRows, publicFieldCount: value.publicFieldCount, fields};
}

export async function getPublishedDatasetQuality(slug: string, columns: DatasetColumn[]): Promise<DatasetQuality | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_dataset_quality", {p_slug: slug});
  // Keep the Explorer available during an additive, code-first deployment.
  if (error?.code === "PGRST202") return null;
  if (error) throw new RepositoryError("database");
  return parseQuality(data, columns);
}
