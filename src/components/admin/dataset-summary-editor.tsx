"use client";

import {useTranslations} from "next-intl";
import type {DatasetSummary, LocalizedText} from "@/types";
import {LocalizedTextEditor} from "./localized-text-editor";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const emptyLocalized: LocalizedText = {it: "", en: ""};

export function DatasetSummaryEditor({value, onChange}: {
  value: DatasetSummary;
  onChange: (value: DatasetSummary) => void;
}) {
  const t = useTranslations("Admin.caseStudy");
  const set = <K extends keyof DatasetSummary>(key: K, next: DatasetSummary[K]) => onChange({...value, [key]: next});
  const setPeriod = (period: LocalizedText) => set("period", period.it || period.en ? period : undefined);

  return (
    <section className="space-y-5 rounded-panel border border-border bg-surface-raised/45 p-4 sm:p-5">
      <h3 className="text-base font-bold">{t("dataset.title")}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">{t("dataset.name")}
          <input className={inputClass} value={value.name} onChange={(event) => set("name", event.target.value)} />
        </label>
        <label className="text-sm font-semibold">{t("dataset.sourceUrl")}
          <input type="url" className={inputClass} value={value.sourceUrl ?? ""} onChange={(event) => set("sourceUrl", event.target.value || undefined)} />
        </label>
        <label className="text-sm font-semibold">{t("dataset.records")}
          <input type="number" min="0" step="1" className={inputClass} value={value.records ?? ""} onChange={(event) => set("records", event.target.value === "" ? undefined : Number(event.target.value))} />
        </label>
      </div>
      <LocalizedTextEditor label={t("dataset.source")} value={value.source} onChange={(source) => set("source", source)} multiline={false} />
      <LocalizedTextEditor label={t("dataset.period")} value={value.period ?? emptyLocalized} onChange={setPeriod} multiline={false} />
      <LocalizedTextEditor label={t("dataset.description")} value={value.description} onChange={(description) => set("description", description)} />
    </section>
  );
}
