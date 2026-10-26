"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {updateDatasetRightsAction} from "@/app/[locale]/admin/actions";
import {Button} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {licenseTypes, potentiallyIdentifyingFields, sourcePlatforms} from "@/lib/datasets/rights";
import type {AdminDatasetDraft, DatasetRights} from "@/types";
import {AdminSaveStatus} from "./admin-save-status";

const input = "mt-1.5 h-10 w-full rounded-control border border-border bg-surface px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary";
const label = "text-sm font-semibold";

export function DatasetRightsEditor({locale, projectId, dataset, onDatasetChange, onDirtyChange}: {
  locale: AppLocale;
  projectId: string;
  dataset: AdminDatasetDraft;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const t = useTranslations("Admin.rights");
  const [rights, setRights] = useState(dataset.rights);
  const [dashboardFields, setDashboardFields] = useState(dataset.dashboardFields);
  const [dashboardEnabled, setDashboardEnabled] = useState(dataset.dashboardPublicEnabled);
  const [csvEnabled, setCsvEnabled] = useState(dataset.csvExportEnabled);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);
  const dirty = JSON.stringify({rights, dashboardFields, dashboardEnabled, csvEnabled}) !== JSON.stringify({
    rights: dataset.rights, dashboardFields: dataset.dashboardFields,
    dashboardEnabled: dataset.dashboardPublicEnabled, csvEnabled: dataset.csvExportEnabled,
  });
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const set = <K extends keyof DatasetRights>(key: K, value: DatasetRights[K]) => {
    setRights((current) => ({...current, [key]: value, ...(key !== "confirmed" ? {confirmed: false} : {})}));
    setFeedback(null);
  };
  const toggleDashboardField = (field: string) => {
    setDashboardFields((current) => current.includes(field)
      ? current.filter((item) => item !== field)
      : dataset.columns.map((column) => column.name).filter((name) => current.includes(name) || name === field));
    setFeedback(null);
    setRights((current) => ({...current, confirmed: false}));
  };
  const save = async () => {
    setPending(true);
    setFeedback(null);
    const result = await updateDatasetRightsAction(locale, projectId, dataset.id, rights, dashboardFields, dashboardEnabled, csvEnabled);
    setPending(false);
    if (!result.ok) { setFeedback("error"); return; }
    onDatasetChange(result.data);
    setRights(result.data.rights);
    setDashboardFields(result.data.dashboardFields);
    setDashboardEnabled(result.data.dashboardPublicEnabled);
    setCsvEnabled(result.data.csvExportEnabled);
    setFeedback("saved");
  };
  const flagged = potentiallyIdentifyingFields(dataset.columns);
  const exposed = dataset.columns.map((column) => column.name)
    .filter((name) => dataset.explorerEnabled && dataset.explorerFields.includes(name) || dashboardEnabled && dashboardFields.includes(name));
  const sample = dataset.records.slice(0, 3);

  return <section aria-labelledby="dataset-rights-heading" className="mt-6 border-t border-border pt-6">
    <h3 id="dataset-rights-heading" className="font-bold">{t("title")}</h3>
    <p className="mt-1 text-sm text-muted">{t("description")}</p>
    {dataset.rightsLegacy ? <p className="mt-3 border-l-2 border-amber-500 pl-3 text-sm text-muted">{t("legacy")}</p> : null}

    <fieldset className="mt-5 grid gap-4 sm:grid-cols-2">
      <legend className="mb-3 text-sm font-bold">{t("provenance")}</legend>
      <label className={label}>{t("sourceAuthor")}<input className={input} value={rights.sourceAuthor} maxLength={200} onChange={(e) => set("sourceAuthor", e.target.value)} /></label>
      <label className={label}>{t("sourceUrl")}<input type="url" className={input} value={rights.sourceUrl} maxLength={500} onChange={(e) => set("sourceUrl", e.target.value)} /></label>
      <label className={label}>{t("platform")}<select className={input} value={rights.platform} onChange={(e) => set("platform", e.target.value as DatasetRights["platform"])}>{sourcePlatforms.map((value) => <option key={value} value={value}>{t(`platforms.${value}`)}</option>)}</select></label>
      <label className={label}>{t("dataPeriod")}<input className={input} value={rights.dataPeriod} maxLength={120} onChange={(e) => set("dataPeriod", e.target.value)} /></label>
      <label className={label}>{t("snapshotDate")}<input type="date" className={input} value={rights.snapshotDate} onChange={(e) => set("snapshotDate", e.target.value)} /></label>
      {(["it", "en"] as const).map((language) => <label key={language} className={label}>{t("transformations", {language: language.toUpperCase()})}<textarea className={`${input} min-h-20 py-2`} value={rights.transformations[language]} maxLength={1000} onChange={(e) => set("transformations", {...rights.transformations, [language]: e.target.value})} /></label>)}
    </fieldset>

    <fieldset className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
      <legend className="text-sm font-bold">{t("license")}</legend>
      <label className={label}>{t("licenseType")}<select className={input} value={rights.licenseType} onChange={(e) => set("licenseType", e.target.value as DatasetRights["licenseType"])}>{licenseTypes.map((value) => <option key={value} value={value}>{t(`licenses.${value}`)}</option>)}</select></label>
      <label className={label}>{t("licenseUrl")}<input type="url" className={input} value={rights.licenseUrl} maxLength={500} onChange={(e) => set("licenseUrl", e.target.value)} /></label>
      <label className={label}>{t("licenseVersion")}<input className={input} value={rights.licenseVersion} maxLength={80} onChange={(e) => set("licenseVersion", e.target.value)} /></label>
      <label className={label}>{t("licenseCheckedAt")}<input type="date" className={input} value={rights.licenseCheckedAt} onChange={(e) => set("licenseCheckedAt", e.target.value)} /></label>
      <label className={label}>{t("reviewStatus")}<select className={input} value={rights.reviewStatus} onChange={(e) => set("reviewStatus", e.target.value as DatasetRights["reviewStatus"])}><option value="unverified">{t("statuses.unverified")}</option><option value="needs-review">{t("statuses.needs-review")}</option><option value="verified">{t("statuses.verified")}</option></select></label>
      <label className={label}>{t("reviewNotes")}<textarea className={`${input} min-h-20 py-2`} value={rights.reviewNotes} maxLength={1000} onChange={(e) => set("reviewNotes", e.target.value)} /></label>
      {(["it", "en"] as const).map((language) => <label key={language} className={label}>{t("restrictions", {language: language.toUpperCase()})}<textarea className={`${input} min-h-20 py-2`} value={rights.restrictions[language]} maxLength={1000} onChange={(e) => set("restrictions", {...rights.restrictions, [language]: e.target.value})} /></label>)}
    </fieldset>

    <fieldset className="mt-6 border-t border-border pt-5">
      <legend className="text-sm font-bold">{t("privacy")}</legend>
      <p className="mt-2 text-sm text-muted">{t("privacyNote")}</p>
      {flagged.length ? <p className="mt-3 break-words text-sm text-amber-700 dark:text-amber-300">{t("flaggedFields", {fields: flagged.join(", ")})}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{(["personalData", "directIdentifiers", "quasiIdentifiers", "fieldReview"] as const).map((key) => <label key={key} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={rights.privacy[key]} onChange={(e) => set("privacy", {...rights.privacy, [key]: e.target.checked})} />{t(`privacyChecks.${key}`)}</label>)}</div>
    </fieldset>

    <fieldset className="mt-6 border-t border-border pt-5">
      <legend className="text-sm font-bold">{t("publication")}</legend>
      <p className="mt-2 text-sm text-muted">{t("separateModes")}</p>
      <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={dashboardEnabled} onChange={(e) => {setDashboardEnabled(e.target.checked); setRights((current) => ({...current, confirmed: false}));}} />{t("dashboardEnabled")}</label>
      <p className="mt-4 text-sm font-semibold">{t("dashboardFields")}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{dataset.columns.map((column) => <label key={column.name} className="flex min-w-0 items-center gap-2 rounded-control border border-border p-2 text-sm"><input type="checkbox" checked={dashboardFields.includes(column.name)} onChange={() => toggleDashboardField(column.name)} /><span className="break-all">{column.name}</span></label>)}</div>
      <p className="mt-4 text-sm text-muted">{t("explorerFields", {count: dataset.explorerFields.length})}</p>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={csvEnabled} onChange={(e) => {setCsvEnabled(e.target.checked); setRights((current) => ({...current, confirmed: false}));}} />{t("csvEnabled")}</label>
      <p className="mt-2 text-xs text-muted">{t("csvExplanation")}</p>
    </fieldset>

    <div className="mt-6 border-t border-border pt-5">
      <p className="text-sm font-semibold">{t("exposurePreview", {count: exposed.length})}</p>
      {exposed.length ? <div className="mt-2 max-w-full overflow-x-auto rounded-control border border-border"><table className="min-w-max text-left text-xs"><thead><tr>{exposed.map((field) => <th key={field} className="px-3 py-2">{field}</th>)}</tr></thead><tbody>{sample.map((record, index) => <tr key={index} className="border-t border-border">{exposed.map((field) => <td key={field} className="max-w-48 truncate px-3 py-2">{String(record[field] ?? "—")}</td>)}</tr>)}</tbody></table></div> : <p className="mt-2 text-sm text-muted">{t("nothingExposed")}</p>}
      <label className="mt-5 flex items-start gap-2 text-sm font-semibold"><input type="checkbox" className="mt-1" checked={rights.confirmed} onChange={(e) => set("confirmed", e.target.checked)} />{t("confirmation")}</label>
      <div className="mt-4 flex flex-wrap items-center gap-3"><Button variant="secondary" onClick={save} disabled={!dirty || pending}>{pending ? t("saving") : t("save")}</Button>{(dirty || pending || feedback) ? <AdminSaveStatus phase={pending ? "saving" : feedback === "error" ? "error" : dirty ? "dirty" : "saved"} detail={feedback ? t(feedback) : undefined} /> : null}</div>
    </div>
  </section>;
}
