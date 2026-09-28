"use client";

import {useTranslations} from "next-intl";
import {Button} from "@/components/ui";
import type {MethodologyStep} from "@/types";
import {LocalizedTextEditor} from "./localized-text-editor";

const inputClass = "mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 text-sm outline-none focus:border-primary";

export function MethodologyEditor({value, onChange}: {
  value: MethodologyStep[];
  onChange: (value: MethodologyStep[]) => void;
}) {
  const t = useTranslations("Admin.caseStudy");
  const update = (index: number, step: MethodologyStep) => onChange(value.map((item, itemIndex) => itemIndex === index ? step : item));
  const remove = (index: number) => onChange(value.filter((_, itemIndex) => itemIndex !== index));
  const move = (index: number, offset: -1 | 1) => {
    const next = [...value];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };
  const add = () => onChange([...value, {
    id: `step-${crypto.randomUUID().slice(0, 8)}`,
    title: {it: "", en: ""},
    description: {it: "", en: ""},
  }]);

  return (
    <section className="rounded-panel border border-border bg-surface-raised/45 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-base font-bold">{t("methodology.title")}</h3><p className="mt-1 text-xs text-muted">{t("methodology.description")}</p></div>
        <Button type="button" variant="secondary" size="sm" onClick={add}>{t("actions.addStep")}</Button>
      </div>
      <div className="mt-4 space-y-4">
        {value.length === 0 ? <p className="rounded-control border border-dashed border-border p-4 text-sm text-muted">{t("methodology.empty")}</p> : null}
        {value.map((step, index) => (
          <div key={`${step.id}-${index}`} className="space-y-4 rounded-control border border-border bg-surface p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <label className="flex-1 text-sm font-semibold">{t("fields.id")}
                <input className={inputClass} value={step.id} onChange={(event) => update(index, {...step, id: event.target.value})} />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => move(index, -1)}>{t("actions.moveUp")}</Button>
                <Button type="button" variant="ghost" size="sm" disabled={index === value.length - 1} onClick={() => move(index, 1)}>{t("actions.moveDown")}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>{t("actions.remove")}</Button>
              </div>
            </div>
            <LocalizedTextEditor label={t("fields.title")} value={step.title} onChange={(title) => update(index, {...step, title})} multiline={false} />
            <LocalizedTextEditor label={t("fields.description")} value={step.description} onChange={(description) => update(index, {...step, description})} />
          </div>
        ))}
      </div>
    </section>
  );
}
