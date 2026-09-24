import { Suspense } from "react";

import { DashboardShell } from "@/components/analytics/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/project";

interface ProjectExploreProps {
  project: ProjectDetail;
}

function DashboardFallback() {
  return (
    <Card className="mt-8 p-6" surface="secondary">
      <p className="text-sm text-text-muted">Preparing the interactive demo workspace…</p>
    </Card>
  );
}

export function ProjectExplore({ project }: ProjectExploreProps) {
  return (
    <section
      aria-labelledby="explore-title"
      className="scroll-mt-32 border-b border-border py-14 sm:py-20"
      id="explore"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-overline">Explore</p>
          <h2 className="mt-3" id="explore-title">
            Investigate your own questions
          </h2>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Apply global filters to update the current data selection and headline measures.
            Chart modules will build on this shared state in the next phase.
          </p>
        </div>
        {project.dashboard.synthetic ? (
          <Badge className="self-start" variant="warning">
            Synthetic demo dataset
          </Badge>
        ) : null}
      </div>

      <div className="mt-5 rounded-control border border-border bg-surface-secondary px-4 py-3">
        <p className="text-sm font-medium text-text-primary">{project.dashboard.datasetLabel}</p>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          {project.dashboard.datasetDescription}
        </p>
      </div>

      <Suspense fallback={<DashboardFallback />}>
        <DashboardShell configuration={project.dashboard} />
      </Suspense>
    </section>
  );
}
