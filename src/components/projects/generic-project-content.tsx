import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicProjectMetadata } from "@/types/project";

import { ProjectHero } from "./project-hero";

export function GenericProjectContent({
  project,
}: {
  project: PublicProjectMetadata;
}) {
  const datasetFacts = [
    { label: "Period", value: project.period },
    { label: "Records", value: project.dataset?.records },
    { label: "Grain", value: project.dataset?.grain },
    { label: "Source", value: project.dataset?.source },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <article>
      <div className="container-page page-frame grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-14">
        <ProjectHero ctaHref={null} project={project} />

        {datasetFacts.length > 0 ? (
          <Card className="p-5 sm:p-6" surface="elevated">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-overline">Dataset snapshot</p>
                <h2 className="mt-2 text-xl">Available metadata</h2>
              </div>
              <Badge variant="neutral">Published</Badge>
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
          <p className="text-overline">Project availability</p>
          <h2 className="mt-3 text-2xl">Interactive analysis is coming later.</h2>
          <p className="mt-3 leading-7 text-text-secondary">
            Interactive analysis for this project is not available yet. This page
            intentionally shows only its published metadata; no findings or
            visualizations have been inferred.
          </p>
        </Card>
      </div>
    </article>
  );
}
