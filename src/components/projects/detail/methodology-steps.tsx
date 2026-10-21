import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {MethodologyStep} from "@/types";

export function MethodologySteps({steps, locale}: {steps: MethodologyStep[]; locale: AppLocale}) {
  return (
    <ol className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.id} className="grid gap-4 border-t border-border pt-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-4">
          <span className="text-xs font-bold tabular-nums tracking-[0.14em] text-primary-strong">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="text-lg font-bold">{localize(step.title, locale)}</h3>
            <p className="mt-3 max-w-prose text-sm leading-7 text-muted">{localize(step.description, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
