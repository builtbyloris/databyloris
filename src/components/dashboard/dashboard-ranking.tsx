"use client";

import {useLocale} from "next-intl";
import {useMemo} from "react";
import {Card} from "@/components/ui";
import {cn} from "@/lib/cn";
import {calculateRanking, formatCompactDashboardValue, formatDashboardValue} from "@/lib/dashboard";
import type {DashboardRecord, RankingConfig} from "@/types";
import {useDashboardText} from "./use-dashboard-text";

export function DashboardRanking({config, records, className}: {config: RankingConfig; records: DashboardRecord[]; className?: string}) {
  const locale = useLocale();
  const dashboardText = useDashboardText();
  const rows = useMemo(() => calculateRanking(records, config), [config, records]);

  return (
    <Card data-dashboard-section="ranking" className={cn("min-w-0 overflow-hidden", className)}>
      <div className="border-b border-border px-5 py-5 sm:px-6">
        <h2 className="text-base font-bold tracking-tight sm:text-lg">{dashboardText(config.title)}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead className="bg-surface-raised text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">#</th>
              <th className="px-3 py-3 font-semibold">{dashboardText(config.dimensionLabel)}</th>
              {config.detailColumns.map((column) => <th key={column.field} className="px-3 py-3 font-semibold">{dashboardText(column.label)}</th>)}
              <th className="px-5 py-3 text-right font-semibold">{dashboardText(config.metricLabel)}</th>
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
    </Card>
  );
}
