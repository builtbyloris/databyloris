"use client";

import {useTranslations} from "next-intl";
import type {LocalizedText} from "@/types";

const inputClass = "mt-1.5 w-full rounded-control border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary";

export function LocalizedTextEditor({
  label,
  value,
  onChange,
  multiline = true,
}: {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) {
  const t = useTranslations("Admin.caseStudy");
  const Field = multiline ? "textarea" : "input";

  return (
    <fieldset className="grid gap-4 md:grid-cols-2">
      <legend className="mb-1 text-sm font-bold">{label}</legend>
      {(["it", "en"] as const).map((language) => (
        <label key={language} className="text-sm font-semibold text-muted">
          {t(`languages.${language}`)}
          <Field
            className={`${inputClass} ${multiline ? "min-h-24 resize-y" : "h-11"}`}
            value={value[language]}
            onChange={(event) => onChange({...value, [language]: event.target.value})}
          />
        </label>
      ))}
    </fieldset>
  );
}
