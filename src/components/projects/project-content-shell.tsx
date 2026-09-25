import type { ProjectDetail } from "@/types/project";
import { GuidedTourProvider } from "@/components/onboarding/guided-tour-provider";
import {
  SPOTIFY_TOUR_SESSION_KEY,
  SPOTIFY_TOUR_STEPS,
  SPOTIFY_TOUR_STORAGE_KEY,
} from "@/data/spotify-tour";

import { DatasetSnapshot } from "./dataset-snapshot";
import { ProjectExplore } from "./project-explore";
import { ProjectHero } from "./project-hero";
import { ProjectInsights } from "./project-insights";
import { ProjectNavigation } from "./project-navigation";
import { ProjectOverview } from "./project-overview";

interface ProjectContentShellProps {
  project: ProjectDetail;
}

interface SectionHeadingProps {
  eyebrow: string;
  id: string;
  title: string;
}

function SectionHeading({ eyebrow, id, title }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-overline">{eyebrow}</p>
      <h2 className="mt-3" id={id}>
        {title}
      </h2>
    </div>
  );
}

export function ProjectContentShell({ project }: ProjectContentShellProps) {
  const content = (
    <article>
      <div className="container-page page-frame grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-14">
        <ProjectHero project={project} />
        <DatasetSnapshot dataset={project.dataset} />
      </div>

      <ProjectNavigation />

      <div className="container-story py-14 sm:py-20">
        <ProjectOverview project={project} />
        <ProjectInsights project={project} />
        <ProjectExplore project={project} />

        <section
          aria-labelledby="methodology-title"
          className="scroll-mt-32 pt-14 sm:pt-20"
          id="methodology"
        >
          <SectionHeading
            eyebrow="Methodology"
            id="methodology-title"
            title="How to interpret the analysis"
          />
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            {project.dataset.summary}
          </p>

          <dl className="mt-8 divide-y divide-border border-y border-border">
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-text-primary">Analytical grain</dt>
              <dd className="text-sm leading-6 text-text-secondary">{project.dataset.grain}</dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-text-primary">Approach</dt>
              <dd className="text-sm leading-6 text-text-secondary">
                {project.content.methodology}
              </dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-semibold text-text-primary">Limitations</dt>
              <dd className="text-sm leading-6 text-text-secondary">
                {project.content.limitations}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </article>
  );

  if (project.slug !== "spotify-listening-trends") {
    return content;
  }

  return (
    <GuidedTourProvider
      enabled
      sessionKey={SPOTIFY_TOUR_SESSION_KEY}
      steps={SPOTIFY_TOUR_STEPS}
      storageKey={SPOTIFY_TOUR_STORAGE_KEY}
    >
      {content}
    </GuidedTourProvider>
  );
}
