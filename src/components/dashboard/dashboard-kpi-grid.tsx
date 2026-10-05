"use client";

import {useLocale} from "next-intl";
import {formatCompactDashboardValue, formatDashboardValue} from "@/lib/dashboard";
import type {KPIConfig} from "@/types";
import {useDashboardText} from "./use-dashboard-text";

export function DashboardKpiGrid({items}: {items: {config: KPIConfig; value: number}[]}) {
  const locale = useLocale();
  const dashboardText = useDashboardText();

  return (
    <div data-dashboard-section="kpis" className="grid min-w-0 grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border min-[360px]:grid-cols-2 lg:grid-cols-4">
      {items.map(({config, value}) => {
        const itemLabel = dashboardText(config.label);
        const description = dashboardText(config.description).trim();
        const fullValue = formatDashboardValue(value, config.format, locale);
        const compactValue = formatCompactDashboardValue(value, config.format, locale);
        return (
          <article key={config.id} className="min-w-0 bg-card p-4 sm:p-5">
            <p className="break-words text-xs font-semibold text-muted">{itemLabel}</p>
            {description ? <p className="mt-1 break-words text-xs leading-5 text-muted">{description}</p> : null}
            <p
              title={fullValue}
              className="mt-3 break-words text-[clamp(1.375rem,6vw,1.875rem)] font-black leading-none tracking-[-0.04em] sm:text-3xl"
            >
              <span aria-hidden="true">{compactValue}</span>
              <span className="sr-only">{fullValue}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
