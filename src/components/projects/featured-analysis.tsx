import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { localizePath, type Locale } from "@/i18n/config";
import type { ProjectSummary } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

import { ProjectCoverImage } from "./project-cover-image";

const rankingPreview = [82, 67, 54, 39];

export function FeaturedAnalysis({
  locale,
  project,
  strings,
  coverStrings,
}: {
  locale: Locale;
  project: ProjectSummary;
  strings: PublicDictionary["home"]["featured"];
  coverStrings: PublicDictionary["project"]["cover"];
}) {
  const href = localizePath(
    locale,
    project.href ?? `/projects/${project.slug}`,
  );
  const metadata = [project.period, ...project.tags].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <section aria-labelledby="featured-analysis-title" className="container-page section-separation">
      <div className="mb-7 space-y-3">
        <p className="text-overline">{strings.eyebrow}</p>
        <h2 id="featured-analysis-title">{strings.title}</h2>
      </div>

      <Card className="grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]" surface="elevated">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.category}</Badge>
            <Badge>{project.demo ? strings.interactiveDemo : strings.publishedProject}</Badge>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {project.title}
          </h3>
          {project.question ? (
            <p className="mt-4 text-lg font-medium leading-7 text-text-primary">
              {project.question}
            </p>
          ) : null}
          <p className="mt-3 max-w-xl leading-7 text-text-secondary">
            {project.description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label={strings.metadataLabel}>
            {metadata.map((item) => (
              <li
                className="rounded-badge border border-border bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <ButtonLink href={href} size="lg">
              {strings.exploreAnalysis}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>

        {project.coverUrl ? (
          <div className="flex items-center border-t border-border bg-surface-secondary p-5 sm:p-7 lg:border-l lg:border-t-0">
            <ProjectCoverImage
              className="w-full rounded-card border border-border shadow-elevated"
              coverUrl={project.coverUrl}
              priority
              sizes="(max-width: 1023px) 100vw, 46vw"
              title={project.title}
              strings={coverStrings}
            />
          </div>
        ) : (
          <div
            aria-label={`${strings.previewAria}: ${project.title}`}
            className="border-t border-border bg-surface-secondary p-5 sm:p-7 lg:border-l lg:border-t-0"
            role="img"
          >
            <div className="rounded-card border border-border bg-surface-primary p-5 shadow-elevated">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{strings.previewTitle}</p>
                  <p className="text-xs text-text-muted">{strings.previewContext}</p>
                </div>
                {project.period ? <Badge variant="accent">{project.period}</Badge> : null}
              </div>

              <svg aria-hidden="true" className="mb-7 h-auto w-full" viewBox="0 0 420 150">
                <path className="text-border" d="M0 30H420M0 75H420M0 120H420" fill="none" stroke="currentColor" strokeDasharray="4 7" />
                <path className="text-accent" d="M0 116C44 120 53 88 94 94C135 100 153 62 196 73C239 84 258 48 298 55C340 62 366 32 420 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
              </svg>

              <div className="space-y-3">
                {rankingPreview.map((width, index) => (
                  <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3" key={width}>
                    <span className="text-xs text-text-muted">{strings.signal} {index + 1}</span>
                    <span className="h-2.5 rounded-badge bg-surface-secondary">
                      <span className="block h-full rounded-badge bg-accent" style={{ width: `${width}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
