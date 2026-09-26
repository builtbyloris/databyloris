"use client";

import { useParams } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { defaultLocale, isLocale, localizePath } from "@/i18n/config";
import { projectNotFoundLabels } from "@/i18n/project-not-found-labels";

export default function ProjectNotFound() {
  const params = useParams<{ lang?: string }>();
  const locale = params.lang && isLocale(params.lang) ? params.lang : defaultLocale;
  const labels = projectNotFoundLabels[locale];

  return (
    <div className="container-story page-frame">
      <p className="text-overline">{labels.eyebrow}</p>
      <h1 className="mt-4">{labels.title}</h1>
      <p className="text-lead mt-5 max-w-2xl">
        {labels.description}
      </p>
      <div className="mt-8">
        <ButtonLink href={localizePath(locale, "/explore")} size="lg">
          {labels.action}
          <span aria-hidden="true">→</span>
        </ButtonLink>
      </div>
    </div>
  );
}
