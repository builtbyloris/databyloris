"use client";

import {useTranslations} from "next-intl";
import {Button} from "@/components/ui";
import type {PublishingArea, PublishingQualityResult} from "@/lib/admin/publishing-quality-gate";

const targets: Record<Exclude<PublishingArea, "dashboard">, string> = {
  metadata: "project-metadata",
  cover: "project-cover",
  "case-study": "project-case-study",
  dataset: "project-dataset",
  rights: "dataset-rights-heading",
};

export function PublishingChecklist({quality, loading, hasUnsavedChanges, onCheck, onBuilder}: {
  quality: PublishingQualityResult | null;
  loading: boolean;
  hasUnsavedChanges: boolean;
  onCheck: () => void;
  onBuilder: () => void;
}) {
  const t = useTranslations("Admin.quality");

  return (
    <section aria-labelledby="publishing-quality-title" className="rounded-control border border-border bg-surface-raised p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 id="publishing-quality-title" className="text-base font-bold">{t("title")}</h3>
          <p id="publishing-quality-status" role="status" className={`mt-1 text-sm font-semibold ${quality ? "text-foreground" : "text-muted"}`}>{loading ? t("checking") : !quality ? t(hasUnsavedChanges ? "pending" : "unavailable") : quality.ready ? t("ready") : t("incomplete", {count: quality.issues.length})}</p>
          {quality?.totalRequirements !== undefined ? <p className="mt-1 text-xs text-muted">{t("progress", {passed: quality.totalRequirements - quality.issues.length, total: quality.totalRequirements})}</p> : null}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={onCheck} disabled={loading}>{t("check")}</Button>
      </div>
      <p className="mt-3 text-xs text-muted">{t("draftAllowed")}</p>
      {hasUnsavedChanges ? <p className="mt-3 text-xs text-muted">{t("unsaved")}</p> : null}
      {quality?.featuredDraftWarning ? <p role="note" className="mt-3 border-l-2 border-amber-600 pl-3 text-sm text-amber-800 dark:border-amber-400 dark:text-amber-200">{t("featuredDraft")}</p> : null}
      {quality?.warnings?.length ? <div className="mt-4 border-t border-border pt-3"><p className="text-sm font-semibold">{t("warningsTitle")}</p><ul className="mt-2 space-y-2 text-sm text-muted">{quality.warnings.map((warning) => <li key={warning.code}><a href={`#${targets[warning.area as Exclude<PublishingArea, "dashboard">]}`} className="hover:underline">{t(`issues.${warning.code}`)}</a></li>)}</ul></div> : null}
      {quality && !quality.ready ? (
        <ul className="mt-4 grid gap-2 text-sm">
          {quality.issues.map((issue) => (
            <li key={issue.code} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-border pt-2">
              <span>{t(`issues.${issue.code}`)}</span>
              {issue.area === "dashboard"
                ? <button type="button" onClick={onBuilder} className="shrink-0 font-semibold text-primary-strong underline-offset-2 hover:underline">{t("goTo")}</button>
                : <a href={`#${targets[issue.area]}`} className="shrink-0 font-semibold text-primary-strong underline-offset-2 hover:underline">{t("goTo")}</a>}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
