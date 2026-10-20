import type {DatasetColumn} from "@/types";
import type {DashboardValue} from "@/types";

export interface SqlLabData {
  columns: DatasetColumn[];
  rows: DashboardValue[][];
  totalCount: number;
}

export type SqlWorkerInput =
  | {type: "init"; data: SqlLabData}
  | {type: "run"; sql: string};

export type SqlWorkerOutput =
  | {type: "ready"; rowCount: number}
  | {type: "result"; columns: string[]; rows: string[][]; truncated: boolean; elapsedMs: number}
  | {type: "error"; code: "readOnly" | "multiple" | "queryRequired" | "sqlError" | "unavailable" | "missingColumn"; field?: string};

// A single prepared statement plus a read-only transaction remain the enforcement layer.
// This scan only supplies early, legible feedback for multiple statements and unsupported comments.
export function prepareReadOnlySql(input: string): {sql: string} | {error: "readOnly" | "multiple" | "queryRequired"} {
  const sql = input.trim();
  if (!sql) return {error: "queryRequired"};
  let quote: "'" | '"' | null = null;
  let semicolon = -1;
  for (let index = 0; index < sql.length; index++) {
    const char = sql[index];
    const next = sql[index + 1];
    if (quote) {
      if (char === quote) {
        if (next === quote) index++;
        else quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"') { quote = char; continue; }
    if ((char === "-" && next === "-") || (char === "/" && next === "*")) return {error: "readOnly"};
    if (char === ";") {
      if (semicolon !== -1) return {error: "multiple"};
      semicolon = index;
    }
  }
  if (quote) return {error: "readOnly"};
  if (semicolon !== -1 && sql.slice(semicolon + 1).trim()) return {error: "multiple"};
  const statement = semicolon === -1 ? sql : sql.slice(0, semicolon).trim();
  if (!/^(SELECT|WITH)\b/i.test(statement)) return {error: "readOnly"};
  return {sql: statement};
}

export function quoteSqlIdentifier(name: string) {
  return `"${name.replaceAll('"', '""')}"`;
}
