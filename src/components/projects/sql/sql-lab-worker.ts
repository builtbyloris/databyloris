import initSqlJs from "sql.js/dist/sql-wasm-browser.js";
import type {Database} from "sql.js";
import type {DashboardValue} from "@/types";
import {prepareReadOnlySql, quoteSqlIdentifier, type SqlLabData, type SqlWorkerInput, type SqlWorkerOutput} from "./sql-lab-protocol";

const context = self as unknown as {
  onmessage: ((event: MessageEvent<SqlWorkerInput>) => void) | null;
  postMessage: (message: SqlWorkerOutput) => void;
};

let db: Database | null = null;

function sqlType(type: string, values: DashboardValue[]): "INTEGER" | "NUMERIC" | "BOOLEAN" | "TEXT" {
  const nonNull = values.filter((value) => value !== null);
  if (type === "number" && nonNull.every((value) => typeof value === "number" && Number.isFinite(value))) {
    return nonNull.every((value) => typeof value === "number" && Number.isInteger(value) && Number.isSafeInteger(value))
      ? "INTEGER" : "NUMERIC";
  }
  if (type === "boolean" && nonNull.every((value) => typeof value === "boolean")) return "BOOLEAN";
  // Dates and anomalous values stay as text; no unverified type coercion.
  return "TEXT";
}

async function initialize(data: SqlLabData) {
  if (!Array.isArray(data.columns) || !data.columns.length || !Array.isArray(data.rows)
    || data.totalCount !== data.rows.length || data.rows.length > 10_000
    || data.rows.some((row) => !Array.isArray(row) || row.length !== data.columns.length)) {
    throw new Error("Invalid public dataset");
  }
  if (db) db.close();
  const SQL = await initSqlJs({locateFile: () => "/sql-lab/sql-wasm-browser.wasm"});
  db = new SQL.Database();
  const types = data.columns.map((column, index) => sqlType(column.type, data.rows.map((row) => row[index])));
  const columnNames = data.columns.map((column) => quoteSqlIdentifier(column.name));
  db.run(`CREATE TABLE dataset (${data.columns.map((column, index) => `${columnNames[index]} ${types[index]}`).join(", ")})`);
  const placeholders = columnNames.map(() => "?").join(", ");
  const insert = db.prepare(`INSERT INTO dataset (${columnNames.join(", ")}) VALUES (${placeholders})`);
  db.run("BEGIN TRANSACTION");
  try {
    for (const row of data.rows) {
      insert.bind(row.map((value, index) => {
        if (value === null) return null;
        if (types[index] === "TEXT") return String(value);
        return typeof value === "boolean" ? Number(value) : value;
      }));
      insert.step();
      insert.reset();
    }
    db.run("COMMIT");
  } catch (error) {
    db.run("ROLLBACK");
    throw error;
  } finally {
    insert.free();
  }
  db.run("PRAGMA query_only = ON");
  context.postMessage({type: "ready", rowCount: data.rows.length});
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function run(input: string) {
  const prepared = prepareReadOnlySql(input);
  if ("error" in prepared) {
    context.postMessage({type: "error", code: prepared.error});
    return;
  }
  if (!db) {
    context.postMessage({type: "error", code: "unavailable"});
    return;
  }
  const start = performance.now();
  try {
    // Wrapping the SELECT prevents non-query statements; query_only is the DB-level read-only guard.
    const statement = db.prepare(`SELECT * FROM (${prepared.sql}) AS sql_lab_result LIMIT 501`);
    try {
      const columns = statement.getColumnNames();
      const rows: string[][] = [];
      while (statement.step()) rows.push(statement.get().map(displayValue));
      context.postMessage({
        type: "result", columns, truncated: rows.length > 500,
        rows: rows.slice(0, 500), elapsedMs: Math.round(performance.now() - start),
      });
    } finally {
      statement.free();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const missing = /no such column: ([^\n]+)/i.exec(message);
    if (missing) context.postMessage({type: "error", code: "missingColumn", field: missing[1].slice(0, 80)});
    else context.postMessage({type: "error", code: "sqlError"});
  }
}

context.onmessage = (event) => {
  const message = event.data;
  if (message.type === "init") void initialize(message.data).catch(() => context.postMessage({type: "error", code: "unavailable"}));
  if (message.type === "run") run(message.sql);
};
