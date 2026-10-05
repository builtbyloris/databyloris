import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {ProjectInsight} from "@/types";

export function ProjectInsights({insights, locale}: {insights: ProjectInsight[]; locale: AppLocale}) {
  return (
    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {insights.map((insight, index) => (
        <article key={insight.id} className="border-t border-border pt-5">
          <p className="text-xs font-bold tabular-nums tracking-[0.14em] text-cyan">{String(index + 1).padStart(2, "0")}</p>
          {insight.title ? <h3 className="mt-3 text-lg font-bold">{localize(insight.title, locale)}</h3> : null}
          <p className="mt-2 text-sm leading-6 text-muted">{localize(insight.description, locale)}</p>
        </article>
      ))}
    </div>
  );
}
