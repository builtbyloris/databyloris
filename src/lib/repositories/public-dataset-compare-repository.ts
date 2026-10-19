import "server-only";

import {createClient} from "@/lib/supabase/server";
import type {Json} from "@/types/database";
import {RepositoryError} from "./repository-error";

export interface CompareSegment {
  recordCount: number;
  average: number | null;
  min: number | null;
  max: number | null;
  missingMetricCount: number;
}

export interface DatasetComparison {
  segments: {a: CompareSegment; b: CompareSegment};
  deltaAbsolute: number | null;
  deltaPercent: number | null;
}

function isObject(value: Json | undefined): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: Json | undefined): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isOptionalNumber(value: Json | undefined): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function parseSegment(value: Json | undefined): CompareSegment {
  if (!isObject(value) || !isCount(value.recordCount)
    || !isCount(value.missingMetricCount) || value.missingMetricCount > value.recordCount
    || !isOptionalNumber(value.average) || !isOptionalNumber(value.min)
    || !isOptionalNumber(value.max)) throw new RepositoryError("invalid_data");
  return value as unknown as CompareSegment;
}

export async function getPublishedCompareOptions(slug: string, dimensionField: string): Promise<string[] | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_dataset_compare_options", {
    p_slug: slug,
    p_dimension_field: dimensionField,
  });
  if (error) throw new RepositoryError("database");
  if (data === null) return null;
  if (!isObject(data) || !Array.isArray(data.values)
    || data.values.length > 100
    || data.values.some((value) => typeof value !== "string" || !value || value.length > 200)) {
    throw new RepositoryError("invalid_data");
  }
  return data.values as string[];
}

export async function getPublishedDatasetComparison(
  slug: string,
  dimensionField: string,
  valueA: string,
  valueB: string,
  metricField: string,
): Promise<DatasetComparison | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_dataset_compare", {
    p_slug: slug,
    p_dimension_field: dimensionField,
    p_value_a: valueA,
    p_value_b: valueB,
    p_metric_field: metricField,
  });
  if (error) throw new RepositoryError("database");
  if (data === null) return null;
  if (!isObject(data) || !isObject(data.segments)
    || !isOptionalNumber(data.deltaAbsolute) || !isOptionalNumber(data.deltaPercent)) {
    throw new RepositoryError("invalid_data");
  }
  return {
    segments: {a: parseSegment(data.segments.a), b: parseSegment(data.segments.b)},
    deltaAbsolute: data.deltaAbsolute,
    deltaPercent: data.deltaPercent,
  };
}
