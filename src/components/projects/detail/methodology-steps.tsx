import type {AppLocale} from "@/i18n/routing";
import {localize} from "@/lib/localize";
import type {MethodologyStep} from "@/types";

export function MethodologySteps({steps, locale}: {steps: MethodologyStep[]; locale: AppLocale}) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.id} className="rounded-card border border-border bg-card p-6 shadow-soft">
          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary-strong">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-5 text-lg font-bold">{localize(step.title, locale)}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{localize(step.description, locale)}</p>
        </li>
      ))}
    </ol>
  );
}
