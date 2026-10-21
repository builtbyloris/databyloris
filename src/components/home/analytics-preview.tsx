"use client";

import {useLocale, useTranslations} from "next-intl";
import {useState} from "react";
import {AnalyticsPreviewMotion} from "./analytics-preview-motion";

// Illustrative figures for this self-contained demo; they are not project or live data.
const metricKeys = ["revenue", "orders", "units"] as const;
type MetricKey = (typeof metricKeys)[number];

const channels = ["web", "store", "marketplace"] as const;
const colors = ["blue", "cyan", "violet"] as const;

const sampleMetrics: Record<MetricKey, {value: number; change: number; trend: number[]; mix: [number, number, number]}> = {
  revenue: {value: 128640, change: 0.124, trend: [72, 81, 75, 87, 92, 85, 100], mix: [53, 28, 19]},
  orders: {value: 2846, change: 0.081, trend: [63, 71, 68, 76, 81, 84, 92], mix: [47, 34, 19]},
  units: {value: 4312, change: 0.067, trend: [60, 73, 69, 82, 79, 88, 94], mix: [49, 31, 20]},
};

export function AnalyticsPreview() {
  const locale = useLocale();
  const t = useTranslations("Home.Preview");
  const [selected, setSelected] = useState<MetricKey>("revenue");
  const metric = sampleMetrics[selected];
  const number = new Intl.NumberFormat(locale, {useGrouping: "always"});
  const currency = new Intl.NumberFormat(locale, {style: "currency", currency: "EUR", maximumFractionDigits: 0});
  const percent = new Intl.NumberFormat(locale, {style: "percent", maximumFractionDigits: 1, signDisplay: "always"});
  const value = selected === "revenue" ? currency.format(metric.value) : number.format(metric.value);
  const change = percent.format(metric.change);

  return (
    <AnalyticsPreviewMotion>
      <div className="preview-console">
        <div className="preview-console-toolbar flex h-11 items-center justify-between gap-3 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="preview-console-mark flex size-6 shrink-0 items-end gap-0.5 rounded-md p-1.5" aria-hidden="true">
              <span className="h-1.5 flex-1 rounded-[1px]" /><span className="h-3 flex-1 rounded-[1px]" /><span className="h-2 flex-1 rounded-[1px]" />
            </span>
            <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.13em]"><span className="hidden sm:inline">databyloris / </span>{t("workspace")}</span>
          </div>
          <span className="preview-console-muted inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
            <span className="preview-console-status size-1.5 rounded-full" aria-hidden="true" />
            {t("demo")}
          </span>
        </div>

        <div className="flex min-h-[30rem]">
          <div className="preview-console-rail hidden w-11 shrink-0 flex-col items-center gap-4 border-r py-6 sm:flex" aria-hidden="true">
            <span className="preview-console-rail-active flex size-7 items-center justify-center rounded-md font-mono text-xs font-bold">01</span>
            <span className="font-mono text-xs">◫</span>
            <span className="font-mono text-xs">⌗</span>
            <span className="mt-auto h-8 w-px" />
          </div>

          <div className="min-w-0 flex-1 px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
            <p className="preview-console-overline">{t("eyebrow")}</p>
            <h2 className="font-editorial mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02]">{t("title")}</h2>
            <p className="preview-console-muted mt-2 text-xs leading-5">{t("description")}</p>

            <div role="group" aria-label={t("metricChooser")} className="mt-5 flex flex-wrap gap-2">
              {metricKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected === key}
                  data-active={selected === key}
                  onClick={() => setSelected(key)}
                  className="preview-console-tab min-h-9 rounded-md border px-3 py-1.5 text-xs font-semibold"
                >
                  {t(`metrics.${key}`)}
                </button>
              ))}
            </div>

            <div className="preview-console-stats mt-6 flex flex-wrap items-end justify-between gap-4 rounded-control border p-4 sm:p-5">
              <div className="min-w-0">
                <p className="preview-console-overline">{t(`metrics.${selected}`)}</p>
                <p className="preview-console-number mt-1 text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tabular-nums tracking-[-0.065em]">{value}</p>
              </div>
              <div className="text-right">
                <p className="preview-console-change text-lg font-semibold tabular-nums">{change}</p>
                <p className="preview-console-muted text-[11px] leading-4">{t("comparison")}</p>
              </div>
            </div>
            <span className="sr-only" aria-live="polite" aria-atomic="true">{t("selectionSummary", {metric: t(`metrics.${selected}`), value, change})}</span>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="preview-console-overline">{t("analysis")}</p>
                  <h3 className="mt-1 text-sm font-semibold">{t("trend")}</h3>
                </div>
                <span className="preview-console-muted font-mono text-[10px]">{t("periods")}</span>
              </div>
              <div className="preview-console-chart mt-4 flex h-26 items-end gap-2 rounded-control border px-3 pt-4 pb-2 sm:gap-3" aria-hidden="true">
                {metric.trend.map((height, index) => (
                  <span key={index} className="flex h-full min-w-0 flex-1 items-end">
                    <span className="preview-console-chart-bar block w-full rounded-t-sm" style={{height: `${height}%`}} />
                  </span>
                ))}
              </div>
              <div className="preview-console-muted mt-1.5 flex justify-between px-1 font-mono text-[10px]" aria-hidden="true">
                <span>{t("firstPeriod")}</span><span>{t("lastPeriod")}</span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex items-end justify-between gap-3">
                <p className="preview-console-overline">{t("channelMix")}</p>
                <span className="preview-console-muted font-mono text-[10px]">100%</span>
              </div>
              <div className="preview-console-bar mt-3 flex h-2.5 overflow-hidden rounded-full" aria-hidden="true">
                {channels.map((channel, index) => (
                  <span key={channel} className={`preview-console-segment preview-console-segment-${colors[index]} h-full`} style={{width: `${metric.mix[index]}%`}} />
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {channels.map((channel, index) => (
                  <div key={channel} className="flex min-w-0 items-center gap-1.5 text-[11px]">
                    <span className={`preview-console-key preview-console-key-${colors[index]} size-2 shrink-0 rounded-sm`} aria-hidden="true" />
                    <span className="preview-console-muted truncate">{t(`channels.${channel}`)}</span>
                    <span className="ml-auto font-semibold tabular-nums">{metric.mix[index]}%</span>
                  </div>
                ))}
              </div>
              <p className="preview-console-muted mt-4 text-[11px] leading-4">{t("sampleNote")}</p>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsPreviewMotion>
  );
}
