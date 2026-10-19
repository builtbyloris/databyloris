"use client";

import {useEffect, useTransition} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import type {DatasetColumn, DatasetDictionary} from "@/types";
import {compareHref, type CompareState} from "./compare-url";

const selectClass = "mt-1.5 h-11 w-full min-w-0 rounded-control border border-border bg-surface px-3 text-foreground outline-none focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary";

export function CompareControls({basePath, dimensions, metrics, dictionary, options, state, locale}: {
  basePath: string;
  dimensions: DatasetColumn[];
  metrics: DatasetColumn[];
  dictionary: DatasetDictionary;
  options: string[];
  state: CompareState;
  locale: "it" | "en";
}) {
  const t = useTranslations("Compare");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const canonicalHref = compareHref(basePath, state);
  const label = (name: string) => dictionary[name]?.label[locale]?.trim() || name;

  useEffect(() => {
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== canonicalHref) window.history.replaceState(null, "", canonicalHref);
  }, [canonicalHref]);

  const update = (next: CompareState) => {
    const href = compareHref(basePath, next);
    if (href !== `${window.location.pathname}${window.location.search}`) {
      startTransition(() => router.push(href, {scroll: false}));
    }
  };

  return (
    <section aria-labelledby="compare-controls-title" className="mt-8 rounded-card border border-border bg-card p-4 sm:p-5">
      <h2 id="compare-controls-title" className="text-lg font-bold">{t("configure")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="min-w-0 text-sm font-semibold">{t("dimension")}
          <select value={state.dimension} onChange={(event) => update({...state, dimension: event.target.value, a: "", b: ""})} className={selectClass}>
            {dimensions.length === 0 ? <option value="">{t("noDimensions")}</option> : null}
            {dimensions.map((column) => <option key={column.name} value={column.name}>{label(column.name)}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-semibold">{t("segmentA")}
          <select value={state.a} onChange={(event) => update({...state, a: event.target.value})} disabled={!state.dimension || options.length === 0} className={selectClass}>
            <option value="">{t("selectValue")}</option>
            {options.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-semibold">{t("segmentB")}
          <select value={state.b} onChange={(event) => update({...state, b: event.target.value})} disabled={!state.dimension || options.length === 0} className={selectClass}>
            <option value="">{t("selectValue")}</option>
            {options.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-semibold">{t("metric")}
          <select value={state.metric} onChange={(event) => update({...state, metric: event.target.value})} className={selectClass}>
            {metrics.length === 0 ? <option value="">{t("noMetrics")}</option> : null}
            {metrics.map((column) => <option key={column.name} value={column.name}>{label(column.name)}</option>)}
          </select>
        </label>
      </div>
      {pending ? <p role="status" className="mt-3 text-sm text-muted">{t("loading")}</p> : null}
    </section>
  );
}
