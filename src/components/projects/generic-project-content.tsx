import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicProjectMetadata } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

import { ProjectHero } from "./project-hero";

export function GenericProjectContent({
  project,
  dictionary,
}: {
  project: PublicProjectMetadata;
  dictionary: PublicDictionary;
}) {
  const datasetFacts = [
    { label: dictionary.project.dataset.period, value: project.period },
    { label: dictionary.project.dataset.records, value: project.dataset?.records },
    { label: dictionary.project.dataset.grain, value: project.dataset?.grain },
    { label: dictionary.project.dataset.source, value: project.dataset?.source },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <article>
      <div className="container-page page-frame grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-14">
        <ProjectHero coverStrings={dictionary.project.cover} ctaHref={null} project={project} strings={dictionary.project.hero} />

        {datasetFacts.length > 0 ? (
          <Card className="p-5 sm:p-6" surface="elevated">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-overline">{dictionary.project.dataset.eyebrow}</p>
                <h2 className="mt-2 text-xl">{dictionary.project.generic.availableMetadata}</h2>
              </div>
              <Badge variant="neutral">{dictionary.project.generic.published}</Badge>
            </div>
            <dl className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
              {datasetFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-text-primary">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}
      </div>

      <div className="container-story pb-16 sm:pb-24">
        <Card className="p-6 sm:p-8" surface="secondary">
          <p className="text-overline">{dictionary.project.generic.availability}</p>
          <h2 className="mt-3 text-2xl">{dictionary.project.generic.comingTitle}</h2>
          <p className="mt-3 leading-7 text-text-secondary">
            {dictionary.project.generic.comingDescription}
          </p>
        </Card>
      </div>
    </article>
  );
}
