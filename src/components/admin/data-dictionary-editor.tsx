"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {updateDatasetDictionaryAction} from "@/app/[locale]/admin/actions";
import {Button} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import type {AdminDatasetDraft, DatasetDictionary, DatasetFieldMetadata} from "@/types";
import {AdminSaveStatus} from "./admin-save-status";

const inputClass = "mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";
const emptyMetadata: DatasetFieldMetadata = {
  label: {it: "", en: ""},
  description: {it: "", en: ""},
};

export function DataDictionaryEditor({locale, projectId, dataset, onDatasetChange, onDirtyChange}: {
  locale: AppLocale;
  projectId: string;
  dataset: AdminDatasetDraft;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const t = useTranslations("Admin.dictionary");
  const [entries, setEntries] = useState<DatasetDictionary>(dataset.dictionary);
  const [selected, setSelected] = useState(dataset.explorerFields[0] ?? dataset.columns[0]?.name ?? "");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{error: boolean; text: string} | null>(null);
  const column = dataset.columns.find((item) => item.name === selected);
  const entry = entries[selected] ?? emptyMetadata;
  const dirty = JSON.stringify(entries) !== JSON.stringify(dataset.dictionary);
  const publicColumns = dataset.columns.filter((item) => dataset.explorerFields.includes(item.name));
  const privateColumns = dataset.columns.filter((item) => !dataset.explorerFields.includes(item.name));
  const isApproved = dataset.explorerFields.includes(selected);
  const isPublic = dataset.explorerEnabled && isApproved;

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const update = (change: Partial<DatasetFieldMetadata>) => {
    setEntries((current) => ({...current, [selected]: {...emptyMetadata, ...current[selected], ...change}}));
    setFeedback(null);
  };
  const save = async () => {
    setPending(true);
    setFeedback(null);
    const result = await updateDatasetDictionaryAction(locale, projectId, dataset.id, entries);
    setPending(false);
    if (!result.ok) {
      setFeedback({error: true, text: t(result.error === "invalidDataset" ? "invalid" : "saveError")});
      return;
    }
    onDatasetChange(result.data);
    setEntries(result.data.dictionary);
    setFeedback({error: false, text: t("saved")});
  };

  return (
    <section aria-labelledby="data-dictionary-heading" className="mt-6 border-t border-border pt-5">
      <h3 id="data-dictionary-heading" tabIndex={-1} className="scroll-mt-24 font-bold">{t("title")}</h3>
      <p className="mt-1 text-sm text-muted">{t("description")}</p>
      <label className="mt-4 block max-w-xl text-sm font-semibold">{t("field")}
        <select value={selected} onChange={(event) => setSelected(event.target.value)} className={`${inputClass} h-11`}>
          {publicColumns.length > 0 ? <optgroup label={t("publicFields")}>{publicColumns.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</optgroup> : null}
          {privateColumns.length > 0 ? <optgroup label={t("privateFields")}>{privateColumns.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</optgroup> : null}
        </select>
      </label>
      {column ? (
        <div className="mt-4 rounded-control border border-border bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="break-all font-semibold">{column.name}</h4>
            <p className="text-xs text-muted">{t(isPublic ? "publicField" : isApproved ? "approvedField" : "privateField")} · {t("schemaType", {type: t(`types.${column.type}`)})}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["it", "en"] as const).map((language) => (
              <label key={`label-${language}`} className="text-sm font-semibold">{t(`label.${language}`)}
                <input className={inputClass} maxLength={120} value={entry.label[language]}
                  onChange={(event) => update({label: {...entry.label, [language]: event.target.value}})} />
              </label>
            ))}
            {(["it", "en"] as const).map((language) => (
              <label key={`description-${language}`} className="text-sm font-semibold">{t(`descriptionField.${language}`)}
                <textarea className={`${inputClass} min-h-24 resize-y`} maxLength={500} value={entry.description[language]}
                  onChange={(event) => update({description: {...entry.description, [language]: event.target.value}})} />
              </label>
            ))}
            <label className="text-sm font-semibold">{t("dataType")}
              <select className={`${inputClass} h-11`} value={entry.dataType ?? column.type}
                onChange={(event) => update({dataType: event.target.value as DatasetFieldMetadata["dataType"]})}>
                {(["string", "number", "boolean", "date"] as const).map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">{t("unit")}
              <input className={inputClass} maxLength={40} value={entry.unit ?? ""}
                onChange={(event) => update({unit: event.target.value})} />
            </label>
            <label className="text-sm font-semibold">{t("format")}
              <input className={inputClass} maxLength={40} value={entry.format ?? ""}
                onChange={(event) => update({format: event.target.value})} />
            </label>
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={save} disabled={!dirty || pending}>{pending ? t("saving") : t("save")}</Button>
        {(dirty || pending || feedback) ? <AdminSaveStatus phase={pending ? "saving" : feedback?.error ? "error" : dirty ? "dirty" : "saved"} detail={feedback?.text} /> : null}
      </div>
    </section>
  );
}
