"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {updateDatasetExplorerAction} from "@/app/[locale]/admin/actions";
import {Button} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import type {AdminDatasetDraft} from "@/types";

export function DatasetExplorerSettings({locale, projectId, dataset, onDatasetChange}: {
  locale: AppLocale;
  projectId: string;
  dataset: AdminDatasetDraft;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
}) {
  const t = useTranslations("Admin.explorer");
  const [enabled, setEnabled] = useState(dataset.explorerEnabled);
  const [fields, setFields] = useState(dataset.explorerFields);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{error: boolean; text: string} | null>(null);
  const dirty = enabled !== dataset.explorerEnabled
    || fields.length !== dataset.explorerFields.length
    || fields.some((field, index) => field !== dataset.explorerFields[index]);

  const toggle = (name: string) => setFields((current) => current.includes(name)
    ? current.filter((field) => field !== name)
    : dataset.columns.map((column) => column.name).filter((field) => current.includes(field) || field === name));

  const save = async () => {
    setPending(true);
    setFeedback(null);
    const result = await updateDatasetExplorerAction(locale, projectId, dataset.id, enabled, fields);
    setPending(false);
    if (!result.ok) {
      setFeedback({error: true, text: t(result.error === "invalidDataset" ? "invalidFields" : "saveError")});
      return;
    }
    onDatasetChange(result.data);
    setEnabled(result.data.explorerEnabled);
    setFields(result.data.explorerFields);
    setFeedback({error: false, text: t("saved")});
  };

  return (
    <section aria-labelledby="dataset-explorer-heading" className="mt-6 border-t border-border pt-5">
      <h3 id="dataset-explorer-heading" className="font-bold">{t("title")}</h3>
      <p className="mt-1 text-sm text-muted">{t("description")}</p>
      <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        {t("enable")}
      </label>
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">{t("fields")}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {dataset.columns.map((column) => (
            <label key={column.name} className="flex min-w-0 items-center gap-2 rounded-control border border-border px-3 py-2 text-sm">
              <input type="checkbox" checked={fields.includes(column.name)} onChange={() => toggle(column.name)} />
              <span className="min-w-0 break-words">{column.name}</span>
              <span className="ml-auto text-xs text-muted">{column.type}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 text-sm text-muted">{fields.length === 0 ? t("emptyWarning") : t("selected", {count: fields.length})}</p>
      <div className="mt-4 flex items-center gap-3">
        <Button variant="secondary" onClick={save} disabled={!dirty || pending}>{pending ? t("saving") : t("save")}</Button>
        {feedback ? <p role={feedback.error ? "alert" : "status"} className={`text-sm ${feedback.error ? "text-red-600 dark:text-red-300" : "text-muted"}`}>{feedback.text}</p> : null}
      </div>
    </section>
  );
}
