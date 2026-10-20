"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import type {DatasetColumn, DatasetDictionary} from "@/types";
import {quoteSqlIdentifier, type SqlLabData, type SqlWorkerOutput} from "./sql-lab-protocol";

interface Example {
  key: "exampleAverage" | "exampleCount" | "exampleRows";
  sql: string;
}

function examplesFor(columns: DatasetColumn[]): Example[] {
  const names = new Set(columns.map((column) => column.name));
  const categorical = columns.find((column) => column.type === "string" || column.type === "boolean");
  const metric = columns.find((column) => column.type === "number");
  const examples: Example[] = [];
  if (names.has("room_type") && names.has("price_usd")) {
    examples.push({key: "exampleAverage", sql: 'SELECT\n  "room_type",\n  COUNT(*) AS listings,\n  ROUND(AVG("price_usd"), 2) AS avg_price\nFROM dataset\nGROUP BY "room_type"\nORDER BY avg_price DESC;'});
  } else if (categorical && metric) {
    const category = quoteSqlIdentifier(categorical.name);
    const value = quoteSqlIdentifier(metric.name);
    examples.push({key: "exampleAverage", sql: `SELECT\n  ${category},\n  COUNT(*) AS records,\n  ROUND(AVG(${value}), 2) AS average_value\nFROM dataset\nGROUP BY ${category}\nORDER BY average_value DESC;`});
  }
  const countField = names.has("neighbourhood_cleansed") ? "neighbourhood_cleansed" : categorical?.name;
  if (countField) {
    const field = quoteSqlIdentifier(countField);
    examples.push({key: "exampleCount", sql: `SELECT\n  ${field},\n  COUNT(*) AS listings\nFROM dataset\nGROUP BY ${field}\nORDER BY listings DESC\nLIMIT 10;`});
  }
  if (!examples.length) examples.push({key: "exampleRows", sql: "SELECT * FROM dataset LIMIT 25;"});
  return examples;
}

interface Result {
  columns: string[];
  rows: string[][];
  truncated: boolean;
  elapsedMs: number;
}

export function SqlLab({dataUrl, locale, columns, dictionary}: {
  dataUrl: string;
  locale: AppLocale;
  columns: DatasetColumn[];
  dictionary: DatasetDictionary;
}) {
  const t = useTranslations("SqlLab");
  const tType = useTranslations("DatasetExplorer.dictionary.types");
  const examples = examplesFor(columns);
  const initialQuery = examples[0].sql;
  const [query, setQuery] = useState(initialQuery);
  const [phase, setPhase] = useState<"loading" | "ready" | "tooLarge" | "error">("loading");
  const [rowCount, setRowCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    let worker: Worker | null = null;
    async function load() {
      try {
        const response = await fetch(dataUrl, {cache: "no-store", signal: abort.signal});
        if (response.status === 413) { setPhase("tooLarge"); return; }
        if (!response.ok) throw new Error("Public data unavailable");
        const data: SqlLabData = await response.json();
        if (!Array.isArray(data.columns) || data.columns.length !== columns.length
          || data.columns.some((column, index) => column.name !== columns[index].name)
          || !Array.isArray(data.rows) || data.rows.length !== data.totalCount
          || data.rows.length > 10_000) throw new Error("Invalid public data");
        if (abort.signal.aborted) return;
        worker = new Worker(new URL("./sql-lab-worker.ts", import.meta.url));
        workerRef.current = worker;
        worker.onmessage = (event: MessageEvent<SqlWorkerOutput>) => {
          const message = event.data;
          if (message.type === "ready") { setRowCount(message.rowCount); setPhase("ready"); }
          if (message.type === "result") {
            setResult(message);
            setRunning(false);
            setQueryError(null);
          }
          if (message.type === "error") {
            if (message.code === "unavailable") setPhase("error");
            else setQueryError(message.code === "missingColumn" ? t("missingColumn", {field: message.field ?? ""}) : t(message.code));
            setRunning(false);
          }
        };
        worker.onerror = () => { setPhase("error"); setRunning(false); };
        worker.postMessage({type: "init", data});
      } catch {
        if (!abort.signal.aborted) setPhase("error");
      }
    }
    void load();
    return () => { abort.abort(); worker?.terminate(); workerRef.current = null; };
  }, [dataUrl, columns, t]);

  function run() {
    if (phase !== "ready" || running || !workerRef.current) return;
    setQueryError(null);
    setResult(null);
    setRunning(true);
    workerRef.current.postMessage({type: "run", sql: query});
  }

  return <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
    <div className="min-w-0 lg:order-1">
      <section aria-labelledby="sql-editor-title" className="min-w-0 rounded-card border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="sql-editor-title" className="text-xl font-bold">{t("editor")}</h2>
          <p className="text-xs text-muted">{t("shortcut")}</p>
        </div>
        <label htmlFor="sql-query" className="sr-only">{t("editor")}</label>
        <textarea id="sql-query" value={query} onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); run(); } }}
          spellCheck={false} rows={10} className="mt-4 block w-full min-w-0 resize-y rounded-control border border-border bg-surface p-4 font-mono text-sm leading-6 text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="button" onClick={run} disabled={phase !== "ready" || running}>{running ? t("running") : t("run")}</Button>
          <Button type="button" variant="secondary" onClick={() => {setQuery(initialQuery); setResult(null); setQueryError(null);}}>{t("reset")}</Button>
          <Button type="button" variant="ghost" onClick={() => {setQuery(""); setResult(null); setQueryError(null);}}>{t("clear")}</Button>
        </div>
        <div aria-live="polite" className="mt-3 text-sm text-muted">
          {phase === "loading" ? t("loading") : phase === "ready" ? t("ready", {count: new Intl.NumberFormat(locale).format(rowCount)}) : null}
        </div>
        {phase === "tooLarge" || phase === "error" ? <p role="alert" className="mt-3 text-sm text-foreground">{t(phase === "tooLarge" ? "tooLarge" : "unavailable")}</p> : null}
        {queryError ? <p role="alert" className="mt-3 text-sm text-foreground">{queryError}</p> : null}
      </section>
      <section aria-labelledby="sql-results-title" className="mt-6 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="sql-results-title" className="text-xl font-bold">{t("results")}</h2>
          {result ? <p className="text-sm text-muted">{t("executionTime", {milliseconds: result.elapsedMs})}</p> : null}
        </div>
        {!result ? <p role="status" className="mt-4 text-sm text-muted">{t("empty")}</p>
          : <>
            <p role="status" className="mt-2 text-sm text-muted">{result.truncated ? t("resultLimit") : t("resultCount", {count: result.rows.length})}</p>
            {result.rows.length ? <div role="region" aria-label={t("resultTable")} tabIndex={0} className="mt-4 max-w-full overflow-x-auto rounded-card border border-border focus-visible:outline-2 focus-visible:outline-primary">
              <table className="w-max min-w-full border-collapse text-left text-sm">
                <thead className="bg-surface-raised"><tr>{result.columns.map((name, index) => <th scope="col" key={`${name}-${index}`} className="whitespace-nowrap border-b border-border px-4 py-3 font-semibold">{name}</th>)}</tr></thead>
                <tbody>{result.rows.map((row, index) => <tr key={index} className="border-t border-border">{row.map((value, cellIndex) => <td key={cellIndex} className="max-w-72 break-words px-4 py-3 align-top text-muted">{value}</td>)}</tr>)}</tbody>
              </table>
            </div> : <p className="mt-4 text-sm text-muted">{t("noResults")}</p>}
          </>}
      </section>
    </div>
    <aside aria-labelledby="sql-schema-title" className="min-w-0 lg:order-2">
      <div className="rounded-card border border-border bg-card p-4 sm:p-5">
        <h2 id="sql-schema-title" className="text-lg font-bold">{t("schema")}</h2>
        <p className="mt-1 text-sm text-muted">{t("schemaIntro")}</p>
        <code className="mt-4 block font-semibold text-primary-strong">{t("tableName")}</code>
        <ul className="mt-3 divide-y divide-border border-y border-border">{columns.map((column) => <li key={column.name} className="min-w-0 py-2.5">
          <code className="block break-all text-sm">{column.name}</code>
          <span className="text-xs text-muted">{dictionary[column.name]?.label[locale]?.trim() || tType(column.type)} · {tType(column.type)}</span>
        </li>)}</ul>
      </div>
      <div className="mt-5">
        <h2 className="text-sm font-bold">{t("examples")}</h2>
        <div className="mt-2 flex flex-wrap gap-2 lg:flex-col">{examples.map((example) => <Button key={example.key} type="button" variant="secondary" size="sm" onClick={() => {setQuery(example.sql); setQueryError(null); setResult(null);}} className="justify-start text-left">{t(example.key)}</Button>)}</div>
      </div>
    </aside>
  </div>;
}
