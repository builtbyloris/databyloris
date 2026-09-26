import { Suspense } from "react";

import { DashboardShell } from "@/components/analytics/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

interface ProjectExploreProps {
  project: ProjectDetail;
  strings: PublicDictionary["project"]["explore"];
  dashboardStrings: PublicDictionary["dashboard"];
}

function DashboardFallback({ text }: { text: string }) {
  return (
    <Card className="mt-8 p-6" surface="secondary">
      <p className="text-sm text-text-muted">{text}</p>
    </Card>
  );
}

export function ProjectExplore({ dashboardStrings, project, strings }: ProjectExploreProps) {
  return (
    <section
      aria-labelledby="explore-title"
      className="scroll-mt-32 border-b border-border py-14 sm:py-20"
      id="explore"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-overline">{strings.eyebrow}</p>
          <h2 className="mt-3" id="explore-title">
            {strings.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            {strings.description}
          </p>
        </div>
        {project.dashboard.synthetic ? (
          <Badge className="self-start whitespace-nowrap" variant="warning">
            {strings.syntheticBadge}
          </Badge>
        ) : null}
      </div>

      <div className="mt-5 rounded-control border border-border bg-surface-secondary px-4 py-3">
        <p className="text-sm font-medium text-text-primary">{project.dashboard.datasetLabel}</p>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          {project.dashboard.datasetDescription}
        </p>
      </div>

      <Suspense fallback={<DashboardFallback text={strings.loading} />}>
        <DashboardShell configuration={project.dashboard} strings={dashboardStrings} />
      </Suspense>
    </section>
  );
}
