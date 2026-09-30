"use client";

import {useLocale} from "next-intl";
import {formatCompactDashboardValue, formatDashboardValue} from "@/lib/dashboard";
import type {KPIConfig} from "@/types";
import {useDashboardText} from "./use-dashboard-text";

export function DashboardKpiGrid({items}: {items: {config: KPIConfig; value: number}[]}) {
  const locale = useLocale();
  const dashboardText = useDashboardText();

  return (
    <div data-dashboard-section="kpis" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map(({config, value}) => {
        const itemLabel = dashboardText(config.label);
        const description = dashboardText(config.description).trim();
        const fullValue = formatDashboardValue(value, config.format, locale);
        const compactValue = formatCompactDashboardValue(value, config.format, locale);
        return (
          <article key={config.id} className="relative min-w-0 overflow-hidden rounded-card border border-border bg-card p-4 shadow-soft sm:p-5">
            <div className="absolute -right-5 -top-5 size-20 rounded-full bg-primary/10 blur-2xl" />
            <p className="break-words text-xs font-semibold text-muted">{itemLabel}</p>
            {description ? <p className="mt-1 break-words text-xs leading-5 text-muted">{description}</p> : null}
            <p
              title={fullValue}
              aria-label={`${itemLabel}: ${fullValue}`}
              className="mt-3 break-words text-[clamp(1.25rem,7vw,1.875rem)] font-black leading-none tracking-[-0.04em] sm:text-3xl"
            >
              <span aria-hidden="true">{compactValue}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
