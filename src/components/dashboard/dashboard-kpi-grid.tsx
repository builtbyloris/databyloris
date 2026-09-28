"use client";

import {useLocale, useTranslations} from "next-intl";
import {formatDashboardValue} from "@/lib/dashboard";
import type {KPIConfig} from "@/types";

export function DashboardKpiGrid({items}: {items: {config: KPIConfig; value: number}[]}) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  return (
    <div data-dashboard-section="kpis" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map(({config, value}) => (
        <article key={config.id} className="relative overflow-hidden rounded-card border border-border bg-card p-4 shadow-soft sm:p-5">
          <div className="absolute -right-5 -top-5 size-20 rounded-full bg-primary/10 blur-2xl" />
          <p className="text-xs font-semibold text-muted">{t(config.label)}</p>
          <p className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">{formatDashboardValue(value, config.format, locale)}</p>
        </article>
      ))}
    </div>
  );
}
