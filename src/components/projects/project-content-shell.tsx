import type { ProjectDetail } from "@/types/project";
import type { GuidedTourStep } from "@/types/onboarding";
import { GuidedTourProvider } from "@/components/onboarding/guided-tour-provider";
import type { PublicDictionary } from "@/i18n/types";

import { DatasetSnapshot } from "./dataset-snapshot";
import { ProjectExplore } from "./project-explore";
import { ProjectHero } from "./project-hero";
import { ProjectInsights } from "./project-insights";
import { ProjectMethodology } from "./project-methodology";
import { ProjectNavigation } from "./project-navigation";
import { ProjectOverview } from "./project-overview";

interface ProjectContentShellProps {
  dictionary: PublicDictionary;
  project: ProjectDetail;
  projectPath: string;
  tour?: {
    sessionKey: string;
    steps: readonly GuidedTourStep[];
    storageKey: string;
  };
}

export function ProjectContentShell({
  dictionary,
  project,
  projectPath,
  tour,
}: ProjectContentShellProps) {
  const content = (
    <article>
      <div className="container-page page-frame grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-14">
        <ProjectHero coverStrings={dictionary.project.cover} project={project} strings={dictionary.project.hero} />
        <DatasetSnapshot dataset={project.dataset} strings={dictionary.project.dataset} />
      </div>

      <ProjectNavigation labels={dictionary.projectNavigation} />

      <div className="container-story py-14 sm:py-20">
        <ProjectOverview project={project} strings={dictionary.project.overview} />
        <ProjectInsights project={project} projectPath={projectPath} strings={dictionary.project.insights} />
        <ProjectExplore dashboardStrings={dictionary.dashboard} project={project} strings={dictionary.project.explore} />

        <ProjectMethodology methodology={project.methodology} strings={dictionary.project.methodology} />
      </div>
    </article>
  );

  if (!tour) {
    return content;
  }

  return (
    <GuidedTourProvider
      enabled
      sessionKey={tour.sessionKey}
      steps={tour.steps}
      storageKey={tour.storageKey}
      strings={dictionary.onboarding}
    >
      {content}
    </GuidedTourProvider>
  );
}
