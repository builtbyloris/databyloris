"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {registerDatasetAction, updateDatasetGrainAction} from "@/app/[locale]/admin/actions";
import {Badge, Button, Card} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {validateDashboardConfig} from "@/lib/admin";
import {
  DATASET_MAX_FILE_BYTES,
  DATASET_MAX_GRAIN_LENGTH,
  DATASET_MAX_NAME_LENGTH,
  DATASET_MAX_ROWS,
  DATASET_PREVIEW_ROWS,
  DATASET_STORAGE_BUCKET,
} from "@/lib/datasets";
import {createClient} from "@/lib/supabase/client";
import type {AdminActionError, AdminDatasetDraft, DashboardConfig} from "@/types";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

export function DatasetManager({
  projectId,
  projectTitle,
  locale,
  dataset,
  dashboardConfig,
  onDatasetChange,
}: {
  projectId: string;
  projectTitle: string;
  locale: AppLocale;
  dataset: AdminDatasetDraft | null;
  dashboardConfig: DashboardConfig;
  onDatasetChange: (dataset: AdminDatasetDraft) => void;
}) {
  const t = useTranslations("Admin.dataset");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(dataset?.name ?? projectTitle);
  const [grain, setGrain] = useState(dataset?.grain ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [pending, setPending] = useState<"upload" | "grain" | null>(null);
  const [message, setMessage] = useState<{kind: "success" | "error"; value: string} | null>(null);

  const dbDataset = dataset?.source === "database" ? dataset : null;
  const configIssues = dataset ? validateDashboardConfig(dashboardConfig, dataset.fields) : [];

  const upload = async () => {
    setMessage(null);
    if (!file || file.name.length > 255 || !file.name.toLowerCase().endsWith(".csv")) {
      setMessage({kind: "error", value: t("errors.csvRequired")});
      return;
    }
    if (file.size > DATASET_MAX_FILE_BYTES) {
      setMessage({kind: "error", value: t("errors.datasetTooLarge")});
      return;
    }
    if (!name.trim() || name.trim().length > DATASET_MAX_NAME_LENGTH || grain.trim().length > DATASET_MAX_GRAIN_LENGTH) {
      setMessage({kind: "error", value: t("errors.invalidDataset")});
      return;
    }
    if (dbDataset && !confirmed) {
      setMessage({kind: "error", value: t("errors.confirmReplacement")});
      return;
    }

    setPending("upload");
    const supabase = createClient();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const storagePath = `projects/${projectId}/${crypto.randomUUID()}/${safeFilename}`;
    const {error: uploadError} = await supabase.storage
      .from(DATASET_STORAGE_BUCKET)
      .upload(storagePath, file, {contentType: file.type || "text/csv", upsert: false});

    if (uploadError) {
      setPending(null);
      setMessage({kind: "error", value: t("errors.datasetUploadFailed")});
      return;
    }

    try {
      const result = await registerDatasetAction(locale, {
        projectId,
        storagePath,
        originalFilename: file.name,
        name: name.trim(),
        grain: grain.trim(),
        replaceExisting: Boolean(dbDataset && confirmed),
      });
      if (!result.ok) {
        await supabase.storage.from(DATASET_STORAGE_BUCKET).remove([storagePath]);
        setMessage({kind: "error", value: errorMessage(result.error, t)});
        return;
      }
      onDatasetChange(result.data);
      setFile(null);
      setConfirmed(false);
      setMessage({kind: "success", value: t(dbDataset ? "feedback.replaced" : "feedback.uploaded")});
    } catch {
      await supabase.storage.from(DATASET_STORAGE_BUCKET).remove([storagePath]);
      setMessage({kind: "error", value: t("errors.datasetProcessingFailed")});
    } finally {
      setPending(null);
    }
  };

  const saveGrain = async () => {
    if (!dbDataset || grain.trim().length > DATASET_MAX_GRAIN_LENGTH) return;
    setPending("grain");
    setMessage(null);
    const result = await updateDatasetGrainAction(locale, projectId, dbDataset.id, grain);
    setPending(null);
    if (!result.ok) {
      setMessage({kind: "error", value: errorMessage(result.error, t)});
      return;
    }
    onDatasetChange(result.data);
    setMessage({kind: "success", value: t("feedback.grainSaved")});
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("description")}</p>
        </div>
        {dataset ? <Badge>{t(`source.${dataset.source}`)}</Badge> : null}
      </div>

      {dataset ? <DatasetSummary dataset={dataset} locale={locale} /> : (
        <div className="mt-5 rounded-control border border-dashed border-border bg-surface-raised p-5">
          <p className="font-semibold">{t("none")}</p>
          <p className="mt-2 text-sm text-muted">{t("emptyDescription")}</p>
        </div>
      )}

      {configIssues.length > 0 ? (
        <div role="alert" className="mt-5 rounded-control border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          {t("configWarning", {count: configIssues.length})}
        </div>
      ) : null}

      <div className="mt-6 border-t border-border pt-5">
        <h3 className="font-bold">{t(dbDataset ? "replaceTitle" : "uploadTitle")}</h3>
        {dataset?.source === "registry" ? <p className="mt-2 text-sm text-muted">{t("registryNotice")}</p> : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">{t("file")}
            <input type="file" accept=".csv,text/csv" className={`${inputClass} py-2`} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
          <label className="text-sm font-semibold">{t("name")}
            <input className={inputClass} maxLength={DATASET_MAX_NAME_LENGTH} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="text-sm font-semibold md:col-span-2">{t("grain")}
            <input className={inputClass} maxLength={DATASET_MAX_GRAIN_LENGTH} value={grain} onChange={(event) => setGrain(event.target.value)} placeholder={t("grainPlaceholder")} />
          </label>
        </div>
        <p className="mt-3 text-xs text-muted">{t("limits", {megabytes: DATASET_MAX_FILE_BYTES / 1024 / 1024, rows: DATASET_MAX_ROWS})}</p>
        {dbDataset ? (
          <label className="mt-4 flex items-start gap-2 rounded-control border border-violet/20 bg-violet/10 p-3 text-sm font-semibold">
            <input type="checkbox" className="mt-0.5" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            {t("confirmReplacement")}
          </label>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={upload} disabled={!file || pending !== null || Boolean(dbDataset && !confirmed)}>
            {pending === "upload" ? t("processing") : t(dbDataset ? "replace" : "upload")}
          </Button>
          {dbDataset ? <Button variant="secondary" onClick={saveGrain} disabled={pending !== null || grain === dbDataset.grain}>{pending === "grain" ? t("savingGrain") : t("saveGrain")}</Button> : null}
        </div>
        {message ? <p role={message.kind === "error" ? "alert" : "status"} className={`mt-3 text-sm font-semibold ${message.kind === "error" ? "text-red-600 dark:text-red-300" : "text-cyan"}`}>{message.value}</p> : null}
      </div>
    </Card>
  );
}

function DatasetSummary({dataset, locale}: {dataset: AdminDatasetDraft; locale: AppLocale}) {
  const t = useTranslations("Admin.dataset");
  const preview = dataset.records.slice(0, DATASET_PREVIEW_ROWS);
  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DatasetFact label={t("name")} value={dataset.name} />
        <DatasetFact label={t("originalFile")} value={dataset.originalFilename ?? dataset.storagePath?.split("/").at(-1) ?? "—"} />
        <DatasetFact label={t("records")} value={String(dataset.recordCount)} />
        <DatasetFact label={t("fields")} value={String(dataset.fields.length)} />
        <DatasetFact label={t("grain")} value={dataset.grain || "—"} />
        <DatasetFact label={t("updatedAt")} value={dataset.updatedAt ? new Intl.DateTimeFormat(locale, {dateStyle: "medium", timeStyle: "short"}).format(new Date(dataset.updatedAt)) : "—"} />
      </div>
      <div>
        <h3 className="text-sm font-bold">{t("schema")}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {dataset.columns.map((column) => <span key={column.name} className="rounded-control border border-border bg-surface-raised px-3 py-2 text-xs"><strong>{column.name}</strong> · {column.type}{column.nullable ? " · nullable" : ""}</span>)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold">{t("preview", {count: Math.min(DATASET_PREVIEW_ROWS, dataset.recordCount)})}</h3>
        <div className="mt-2 overflow-x-auto rounded-control border border-border">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-surface-raised"><tr>{dataset.fields.map((field) => <th key={field} className="whitespace-nowrap px-3 py-2 font-bold">{field}</th>)}</tr></thead>
            <tbody>{preview.map((record, index) => <tr key={index} className="border-t border-border">{dataset.fields.map((field) => <td key={field} className="max-w-56 truncate px-3 py-2 text-muted">{formatCell(record[field])}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DatasetFact({label, value}: {label: string; value: string}) {
  return <div className="rounded-control bg-surface-raised p-4"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 break-words font-bold">{value}</p></div>;
}

function formatCell(value: string | number | boolean | null) {
  if (value === null) return "—";
  return String(value);
}

function errorMessage(error: AdminActionError, t: ReturnType<typeof useTranslations>) {
  const key = `errors.${error}`;
  return t.has(key) ? t(key) : t("errors.unknown");
}
