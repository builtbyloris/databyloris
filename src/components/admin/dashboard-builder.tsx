"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import {validateDashboardConfig} from "@/lib/admin";
import type {AggregationType, ChartConfig, ChartSort, ChartType, DashboardConfig, FilterConfig, FilterType, KPIConfig, KPIFormat, ProjectDraft, RankingConfig} from "@/types";
import {AdminPreview} from "./admin-preview";
import {JsonPreview} from "./json-preview";

const inputClass = "mt-1.5 h-10 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";
const aggregations: AggregationType[] = ["sum", "count", "distinctCount", "average"];
const formats: KPIFormat[] = ["number", "sales", "currency", "percentage", "duration"];
const chartTypes: ChartType[] = ["line", "bar", "pie", "donut"];
const chartSorts: ChartSort[] = ["category-asc", "category-desc", "value-asc", "value-desc"];

export function DashboardBuilder({draft, dirty, saving, onChange, onSave, onBack}: {
  draft: ProjectDraft;
  dirty: boolean;
  saving: boolean;
  onChange: (config: DashboardConfig) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("Admin");
  const [mode, setMode] = useState<"configure" | "preview">("configure");
  const config = draft.dashboardConfig;
  const fields = draft.dataset?.fields ?? [];
  const issues = validateDashboardConfig(config, fields);
  const set = <K extends keyof DashboardConfig>(key: K, value: DashboardConfig[K]) => onChange({...config, [key]: value});

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <button type="button" onClick={onBack} className="text-sm font-semibold text-muted hover:text-foreground">← {t("actions.backToEditor")}</button>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{t("builder.title")}</h1>
          <p className="mt-2 text-sm text-muted">{draft.project.title || t("projects.untitled")} · {dirty ? t("common.unsaved") : t("common.saved")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-control border border-border bg-surface p-1">
            <button type="button" onClick={() => setMode("configure")} aria-pressed={mode === "configure"} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "configure" ? "bg-surface-raised text-foreground" : "text-muted"}`}>{t("builder.configure")}</button>
            <button type="button" onClick={() => setMode("preview")} aria-pressed={mode === "preview"} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "preview" ? "bg-surface-raised text-foreground" : "text-muted"}`}>{t("builder.preview")}</button>
          </div>
          <Button onClick={onSave} disabled={!dirty || saving || issues.length > 0}>{saving ? t("common.saving") : t("actions.saveConfiguration")}</Button>
        </div>
      </div>

      {mode === "preview" ? <AdminPreview draft={draft} /> : (
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">{t("builder.settings")}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TextControl label={t("fields.id")} value={config.id} onChange={(value) => set("id", value)} />
              <TextControl label={t("fields.datasetId")} value={config.datasetId} onChange={(value) => set("datasetId", value)} />
              <TextControl label={t("fields.dashboardTitle")} value={config.title} onChange={(value) => set("title", value)} />
              <SelectControl label={t("fields.featuredChart")} value={config.layout.featuredChartId} options={config.charts.map((chart) => chart.id)} allowEmpty onChange={(value) => set("layout", {featuredChartId: value})} />
            </div>
          </Card>

          <BuilderSection title={t("builder.filters")} addLabel={t("builder.addFilter")} onAdd={() => set("filters", [...config.filters, {id: `filter-${config.filters.length + 1}`, label: "Filter", field: fields[0] ?? "", type: "select"}])}>
            {config.filters.map((item, index) => <FilterEditor key={`${item.id}-${index}`} item={item} fields={fields} onChange={(next) => set("filters", replace(config.filters, index, next))} onRemove={() => set("filters", remove(config.filters, index))} />)}
          </BuilderSection>

          <BuilderSection title={t("builder.kpis")} addLabel={t("builder.addKpi")} onAdd={() => set("kpis", [...config.kpis, {id: `kpi-${config.kpis.length + 1}`, label: "KPI", field: fields[0] ?? "", aggregation: "sum", format: "number"}])}>
            {config.kpis.map((item, index) => <KpiEditor key={`${item.id}-${index}`} item={item} fields={fields} onChange={(next) => set("kpis", replace(config.kpis, index, next))} onRemove={() => set("kpis", remove(config.kpis, index))} />)}
          </BuilderSection>

          <BuilderSection title={t("builder.charts")} addLabel={t("builder.addChart")} onAdd={() => {
            const id = `chart-${config.charts.length + 1}`;
            set("charts", [...config.charts, {id, title: "Chart", type: "bar", categoryField: fields[0] ?? "", valueField: fields[1] ?? fields[0] ?? "", aggregation: "sum", sort: "value-desc", valueFormat: "number"}]);
            if (!config.layout.featuredChartId) onChange({...config, charts: [...config.charts, {id, title: "Chart", type: "bar", categoryField: fields[0] ?? "", valueField: fields[1] ?? fields[0] ?? "", aggregation: "sum", sort: "value-desc", valueFormat: "number"}], layout: {featuredChartId: id}});
          }}>
            {config.charts.map((item, index) => <ChartEditor key={`${item.id}-${index}`} item={item} fields={fields} onChange={(next) => set("charts", replace(config.charts, index, next))} onRemove={() => set("charts", remove(config.charts, index))} />)}
          </BuilderSection>

          <BuilderSection title={t("builder.rankings")} addLabel={t("builder.addRanking")} onAdd={() => set("rankings", [...config.rankings, {id: `ranking-${config.rankings.length + 1}`, title: "Ranking", dimension: fields[0] ?? "", dimensionLabel: "Item", detailColumns: [], metric: fields[1] ?? fields[0] ?? "", metricLabel: "Value", aggregation: "sum", limit: 10, sortDirection: "desc", valueFormat: "number"}])}>
            {config.rankings.map((item, index) => <RankingEditor key={`${item.id}-${index}`} item={item} fields={fields} onChange={(next) => set("rankings", replace(config.rankings, index, next))} onRemove={() => set("rankings", remove(config.rankings, index))} />)}
          </BuilderSection>
        </div>
      )}
      <JsonPreview config={config} />
    </div>
  );
}

function BuilderSection({title, addLabel, onAdd, children}: {title: string; addLabel: string; onAdd: () => void; children: React.ReactNode}) {
  return <section><div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">{title}</h2><Button size="sm" variant="secondary" onClick={onAdd}>+ {addLabel}</Button></div><div className="space-y-3">{children}</div></section>;
}

function FilterEditor({item, fields, onChange, onRemove}: {item: FilterConfig; fields: string[]; onChange: (item: FilterConfig) => void; onRemove: () => void}) {
  const t = useTranslations("Admin");
  return <EditorCard onRemove={onRemove}><TextControl label={t("fields.id")} value={item.id} onChange={(id) => onChange({...item, id})} /><TextControl label={t("fields.label")} value={item.label} onChange={(label) => onChange({...item, label})} /><FieldControl label={t("fields.field")} value={item.field} fields={fields} onChange={(field) => onChange({...item, field})} /><SelectControl label={t("fields.type")} value={item.type} options={["select", "multi-select"] satisfies FilterType[]} onChange={(type) => onChange({...item, type: type as FilterType})} /></EditorCard>;
}

function KpiEditor({item, fields, onChange, onRemove}: {item: KPIConfig; fields: string[]; onChange: (item: KPIConfig) => void; onRemove: () => void}) {
  const t = useTranslations("Admin");
  return <EditorCard onRemove={onRemove}><TextControl label={t("fields.id")} value={item.id} onChange={(id) => onChange({...item, id})} /><TextControl label={t("fields.label")} value={item.label} onChange={(label) => onChange({...item, label})} /><FieldControl label={t("fields.field")} value={item.field ?? ""} fields={fields} allowEmpty={item.aggregation === "count"} onChange={(field) => onChange({...item, field: field || undefined})} /><SelectControl label={t("fields.aggregation")} value={item.aggregation} options={aggregations} onChange={(aggregation) => onChange({...item, aggregation: aggregation as AggregationType})} /><SelectControl label={t("fields.format")} value={item.format} options={formats} onChange={(format) => onChange({...item, format: format as KPIFormat})} /></EditorCard>;
}

function ChartEditor({item, fields, onChange, onRemove}: {item: ChartConfig; fields: string[]; onChange: (item: ChartConfig) => void; onRemove: () => void}) {
  const t = useTranslations("Admin");
  return <EditorCard onRemove={onRemove}><TextControl label={t("fields.id")} value={item.id} onChange={(id) => onChange({...item, id})} /><TextControl label={t("fields.chartTitle")} value={item.title} onChange={(title) => onChange({...item, title})} /><SelectControl label={t("fields.type")} value={item.type} options={chartTypes} onChange={(type) => onChange({...item, type: type as ChartType})} /><FieldControl label={t("fields.dimension")} value={item.categoryField} fields={fields} onChange={(categoryField) => onChange({...item, categoryField})} /><FieldControl label={t("fields.metric")} value={item.valueField ?? ""} fields={fields} allowEmpty={item.aggregation === "count"} onChange={(valueField) => onChange({...item, valueField: valueField || undefined})} /><SelectControl label={t("fields.aggregation")} value={item.aggregation} options={aggregations} onChange={(aggregation) => onChange({...item, aggregation: aggregation as AggregationType})} /><SelectControl label={t("fields.sort")} value={item.sort ?? "category-asc"} options={chartSorts} onChange={(sort) => onChange({...item, sort: sort as ChartSort})} /><SelectControl label={t("fields.valueFormat")} value={item.valueFormat ?? "number"} options={formats} onChange={(valueFormat) => onChange({...item, valueFormat: valueFormat as KPIFormat})} /><NumberControl label={t("fields.limit")} value={item.limit} allowEmpty onChange={(limit) => onChange({...item, limit})} /></EditorCard>;
}

function RankingEditor({item, fields, onChange, onRemove}: {item: RankingConfig; fields: string[]; onChange: (item: RankingConfig) => void; onRemove: () => void}) {
  const t = useTranslations("Admin");
  return <EditorCard onRemove={onRemove} wide><TextControl label={t("fields.id")} value={item.id} onChange={(id) => onChange({...item, id})} /><TextControl label={t("fields.rankingTitle")} value={item.title} onChange={(title) => onChange({...item, title})} /><FieldControl label={t("fields.dimension")} value={item.dimension} fields={fields} onChange={(dimension) => onChange({...item, dimension})} /><TextControl label={t("fields.dimensionLabel")} value={item.dimensionLabel} onChange={(dimensionLabel) => onChange({...item, dimensionLabel})} /><FieldControl label={t("fields.metric")} value={item.metric} fields={fields} allowEmpty={item.aggregation === "count"} onChange={(metric) => onChange({...item, metric})} /><TextControl label={t("fields.metricLabel")} value={item.metricLabel} onChange={(metricLabel) => onChange({...item, metricLabel})} /><SelectControl label={t("fields.aggregation")} value={item.aggregation} options={aggregations} onChange={(aggregation) => onChange({...item, aggregation: aggregation as AggregationType})} /><SelectControl label={t("fields.order")} value={item.sortDirection} options={["asc", "desc"]} onChange={(sortDirection) => onChange({...item, sortDirection: sortDirection as "asc" | "desc"})} /><SelectControl label={t("fields.valueFormat")} value={item.valueFormat ?? "number"} options={formats} onChange={(valueFormat) => onChange({...item, valueFormat: valueFormat as KPIFormat})} /><NumberControl label={t("fields.limit")} value={item.limit} onChange={(limit) => onChange({...item, limit: limit ?? 10})} /><div className="md:col-span-2 xl:col-span-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{t("builder.detailColumns")}</p><button type="button" onClick={() => onChange({...item, detailColumns: [...item.detailColumns, {field: fields[0] ?? "", label: "Detail"}]})} className="text-sm font-semibold text-primary-strong">+ {t("builder.addColumn")}</button></div>{item.detailColumns.map((column, index) => <div key={`${column.field}-${index}`} className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><FieldControl label={t("fields.field")} value={column.field} fields={fields} onChange={(field) => onChange({...item, detailColumns: replace(item.detailColumns, index, {...column, field})})} /><TextControl label={t("fields.label")} value={column.label} onChange={(label) => onChange({...item, detailColumns: replace(item.detailColumns, index, {...column, label})})} /><button type="button" aria-label={t("actions.removeColumn")} onClick={() => onChange({...item, detailColumns: remove(item.detailColumns, index)})} className="self-end rounded-control border border-border px-3 py-2 text-sm text-muted hover:text-foreground">×</button></div>)}</div></EditorCard>;
}

function EditorCard({onRemove, children, wide = false}: {onRemove: () => void; children: React.ReactNode; wide?: boolean}) {
  const t = useTranslations("Admin");
  return <Card className="relative p-5"><button type="button" onClick={onRemove} aria-label={t("actions.removeBlock")} className="absolute right-3 top-3 rounded-control px-3 py-2 text-sm font-bold text-muted hover:bg-surface-raised hover:text-foreground">×</button><div className={`grid gap-4 pr-9 md:grid-cols-2 ${wide ? "xl:grid-cols-3" : "xl:grid-cols-5"}`}>{children}</div></Card>;
}

function TextControl({label, value, onChange}: {label: string; value: string; onChange: (value: string) => void}) { return <label className="text-sm font-semibold">{label}<input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function SelectControl({label, value, options, onChange, allowEmpty = false}: {label: string; value: string; options: readonly string[]; onChange: (value: string) => void; allowEmpty?: boolean}) { const t = useTranslations("Admin"); return <label className="text-sm font-semibold">{label}<select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{allowEmpty ? <option value="">—</option> : null}{options.map((option) => <option key={option} value={option}>{t.has(`options.${option}`) ? t(`options.${option}`) : option}</option>)}</select></label>; }
function FieldControl({label, value, fields, onChange, allowEmpty = false}: {label: string; value: string; fields: string[]; onChange: (value: string) => void; allowEmpty?: boolean}) { return fields.length ? <SelectControl label={label} value={value} options={fields} onChange={onChange} allowEmpty={allowEmpty} /> : <TextControl label={label} value={value} onChange={onChange} />; }
function NumberControl({label, value, onChange, allowEmpty = false}: {label: string; value?: number; onChange: (value: number | undefined) => void; allowEmpty?: boolean}) { return <label className="text-sm font-semibold">{label}<input type="number" min="1" className={inputClass} value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : allowEmpty ? undefined : 1)} /></label>; }
function replace<T>(items: T[], index: number, item: T) { return items.map((current, currentIndex) => currentIndex === index ? item : current); }
function remove<T>(items: T[], index: number) { return items.filter((_, currentIndex) => currentIndex !== index); }
