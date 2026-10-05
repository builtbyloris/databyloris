import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {MethodologyStep} from "@/types";

export function MethodologySteps({steps, locale}: {steps: MethodologyStep[]; locale: AppLocale}) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {steps.map((step, index) => (
        <li key={step.id} className="grid gap-4 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
          <span className="text-sm font-bold tabular-nums text-primary-strong">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="text-lg font-bold">{localize(step.title, locale)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{localize(step.description, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
