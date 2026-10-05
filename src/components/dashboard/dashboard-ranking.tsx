"use client";

import {useLocale, useTranslations} from "next-intl";
import {useId, useMemo} from "react";
import {cn} from "@/lib/cn";
import {calculateRanking, formatCompactDashboardValue, formatDashboardValue} from "@/lib/dashboard";
import type {DashboardRecord, RankingConfig} from "@/types";
import {useDashboardText} from "./use-dashboard-text";

export function DashboardRanking({config, records, className}: {config: RankingConfig; records: DashboardRecord[]; className?: string}) {
  const locale = useLocale();
  const t = useTranslations("Dashboard.ranking");
  const dashboardText = useDashboardText();
  const titleId = useId();
  const rows = useMemo(() => calculateRanking(records, config), [config, records]);

  return (
    <section data-dashboard-section="ranking" className={cn("min-w-0 overflow-hidden rounded-card border border-border bg-card", className)}>
      <div className="border-b border-border px-5 py-5 sm:px-6">
        <h2 id={titleId} className="text-base font-bold tracking-tight sm:text-lg">{dashboardText(config.title)}</h2>
      </div>
      <div role="region" aria-labelledby={titleId} tabIndex={0} className="overflow-x-auto outline-none">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm sm:min-w-[38rem]">
          <thead className="bg-surface-raised text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                <span aria-hidden="true">#</span>
                <span className="sr-only">{t("position")}</span>
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">{dashboardText(config.dimensionLabel)}</th>
              {config.detailColumns.map((column) => <th key={column.field} scope="col" className="px-3 py-3 font-semibold">{dashboardText(column.label)}</th>)}
              <th scope="col" className="px-5 py-3 text-right font-semibold">{dashboardText(config.metricLabel)}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const format = config.valueFormat ?? "number";
              const fullValue = formatDashboardValue(row.value, format, locale);
              return <tr key={row.dimension} className="border-t border-border first:border-0">
                <td className="px-5 py-3 font-bold text-primary-strong">{String(index + 1).padStart(2, "0")}</td>
                <th scope="row" className="px-3 py-3 font-semibold">{row.dimension}</th>
                {config.detailColumns.map((column) => <td key={column.field} className="px-3 py-3 text-muted">{row.details[column.field]}</td>)}
                <td title={fullValue} aria-label={fullValue} className="px-5 py-3 text-right font-bold">{formatCompactDashboardValue(row.value, format, locale)}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <p aria-hidden="true" className="border-t border-border px-4 py-2 text-right text-xs font-medium text-muted sm:hidden">{t("scrollHint")}</p>
    </section>
  );
}
