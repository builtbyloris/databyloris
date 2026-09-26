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
  project: ProjectDetail;
  projectNavigationLabels: PublicDictionary["projectNavigation"];
  projectPath: string;
  tour?: {
    sessionKey: string;
    steps: readonly GuidedTourStep[];
    storageKey: string;
  };
}

export function ProjectContentShell({
  project,
  projectNavigationLabels,
  projectPath,
  tour,
}: ProjectContentShellProps) {
  const content = (
    <article>
      <div className="container-page page-frame grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:gap-14">
        <ProjectHero project={project} />
        <DatasetSnapshot dataset={project.dataset} />
      </div>

      <ProjectNavigation labels={projectNavigationLabels} />

      <div className="container-story py-14 sm:py-20">
        <ProjectOverview project={project} />
        <ProjectInsights project={project} projectPath={projectPath} />
        <ProjectExplore project={project} />

        <ProjectMethodology methodology={project.methodology} />
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
    >
      {content}
    </GuidedTourProvider>
  );
}
