import {parse} from "csv-parse/sync";
import type {DashboardRecord, DatasetColumn, DatasetColumnType} from "@/types";
import {DATASET_MAX_ROWS} from "./constants";

export type DatasetParseErrorCode = "invalidDataset" | "tooManyRows";

export class DatasetParseError extends Error {
  constructor(public readonly code: DatasetParseErrorCode) {
    super(code);
    this.name = "DatasetParseError";
  }
}

export interface ParsedDataset {
  columns: DatasetColumn[];
  records: DashboardRecord[];
}

const numberPattern = /^[-+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[-+]?\d+)?$/i;
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function isIsoDate(value: string) {
  const match = isoDatePattern.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() === Number(month) - 1
    && date.getUTCDate() === Number(day);
}

function inferType(values: string[]): DatasetColumnType {
  const present = values.map((value) => value.trim()).filter(Boolean);
  if (present.length === 0) return "string";
  if (present.every((value) => value === "true" || value === "false")) return "boolean";
  if (present.every((value) => numberPattern.test(value) && Number.isFinite(Number(value)))) return "number";
  if (present.every(isIsoDate)) return "date";
  return "string";
}

function normalizeValue(value: string, type: DatasetColumnType) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (type === "boolean") return trimmed.toLowerCase() === "true";
  if (type === "number") return Number(trimmed);
  if (type === "date") return trimmed;
  return value;
}

export function parseCsvDataset(content: string): ParsedDataset {
  let rows: string[][];
  try {
    rows = parse(content, {
      bom: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
    }) as string[][];
  } catch {
    throw new DatasetParseError("invalidDataset");
  }

  if (rows.length < 2) throw new DatasetParseError("invalidDataset");
  const [rawHeaders, ...dataRows] = rows;
  const headers = rawHeaders;

  if (headers.length === 0 || headers.some((header) => !header.trim()) || new Set(headers).size !== headers.length) {
    throw new DatasetParseError("invalidDataset");
  }
  if (dataRows.length > DATASET_MAX_ROWS) throw new DatasetParseError("tooManyRows");
  if (dataRows.some((row) => row.length !== headers.length)) throw new DatasetParseError("invalidDataset");

  const columns = headers.map((name, columnIndex) => {
    const values = dataRows.map((row) => row[columnIndex] ?? "");
    return {
      name,
      type: inferType(values.map((value) => value.trim().toLowerCase())),
      nullable: values.some((value) => !value.trim()),
    } satisfies DatasetColumn;
  });

  const records = dataRows.map((row) => Object.fromEntries(
    columns.map((column, index) => [column.name, normalizeValue(row[index] ?? "", column.type)]),
  ));

  return {columns, records};
}
