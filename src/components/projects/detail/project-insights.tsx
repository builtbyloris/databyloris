import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {ProjectInsight} from "@/types";

export function ProjectInsights({insights, locale}: {insights: ProjectInsight[]; locale: AppLocale}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {insights.map((insight, index) => (
        <article key={insight.id} className="relative overflow-hidden rounded-card border border-border bg-card p-6 shadow-soft">
          <div className="absolute -right-8 -top-8 size-24 rounded-full bg-cyan/10 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan">Insight {String(index + 1).padStart(2, "0")}</p>
          {insight.title ? <h3 className="mt-3 text-lg font-bold">{localize(insight.title, locale)}</h3> : null}
          <p className="mt-2 text-sm leading-6 text-muted">{localize(insight.description, locale)}</p>
        </article>
      ))}
    </div>
  );
}
