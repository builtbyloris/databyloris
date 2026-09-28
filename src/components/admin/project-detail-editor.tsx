"use client";

import {useLocale, useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import {isValidProjectDetail} from "@/lib/admin";
import type {ProjectDetail} from "@/types";
import {DatasetSummaryEditor} from "./dataset-summary-editor";
import {InsightsEditor} from "./insights-editor";
import {LocalizedTextEditor} from "./localized-text-editor";
import {MethodologyEditor} from "./methodology-editor";

export function ProjectDetailEditor({detail, dirty, saving, onChange, onSave}: {
  detail: ProjectDetail;
  dirty: boolean;
  saving: boolean;
  onChange: (detail: ProjectDetail) => void;
  onSave: () => void;
}) {
  const t = useTranslations("Admin.caseStudy");
  const locale = useLocale() === "en" ? "en" : "it";
  const valid = isValidProjectDetail(detail);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">{t("eyebrow")}</p>
          <h2 className="mt-2 text-xl font-bold">{t("title")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{t("description")}</p>
          <p aria-live="polite" className={`mt-2 text-sm font-semibold ${dirty ? "text-violet" : "text-muted"}`}>
            {dirty ? t("unsaved") : t("saved")}
          </p>
        </div>
        <Button type="button" onClick={onSave} disabled={!dirty || saving || !valid}>
          {saving ? t("saving") : t("save")}
        </Button>
      </div>

      {!valid ? <p role="alert" className="mt-4 rounded-control border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{t("invalid")}</p> : null}

      <div className="mt-6 space-y-5">
        <section className="space-y-5 rounded-panel border border-border bg-surface-raised/45 p-4 sm:p-5">
          <LocalizedTextEditor label={t("context")} value={detail.context} onChange={(context) => onChange({...detail, context})} />
          <LocalizedTextEditor label={t("objective")} value={detail.objective} onChange={(objective) => onChange({...detail, objective})} />
        </section>
        <DatasetSummaryEditor value={detail.dataset} onChange={(dataset) => onChange({...detail, dataset})} />
        <MethodologyEditor value={detail.methodology} onChange={(methodology) => onChange({...detail, methodology})} />
        <InsightsEditor value={detail.insights} onChange={(insights) => onChange({...detail, insights})} />

        <section className="rounded-panel border border-border bg-background/55 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">{t("preview.eyebrow")}</p>
          <h3 className="mt-2 text-lg font-bold">{t("preview.title")}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PreviewItem label={t("context")} value={detail.context[locale]} empty={t("preview.empty")} />
            <PreviewItem label={t("objective")} value={detail.objective[locale]} empty={t("preview.empty")} />
            <PreviewItem label={t("dataset.title")} value={detail.dataset.name} empty={t("preview.empty")} />
            <PreviewItem label={t("preview.blocks")} value={t("preview.counts", {methodology: detail.methodology.length, insights: detail.insights.length})} empty={t("preview.empty")} />
          </div>
        </section>
      </div>
    </Card>
  );
}

function PreviewItem({label, value, empty}: {label: string; value: string; empty: string}) {
  return (
    <div className="rounded-control bg-surface-raised p-4">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{value || empty}</p>
    </div>
  );
}
