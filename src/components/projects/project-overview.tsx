import { InsightCard } from "@/components/analytics/insight-card";
import { KPICard } from "@/components/analytics/kpi-card";
import { TrendVisualization } from "@/components/analytics/trend-visualization";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/project";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <section
      aria-labelledby="overview-title"
      className="scroll-mt-32 border-b border-border pb-14 sm:pb-20"
      id="overview"
    >
      <div className="max-w-2xl">
        <p className="text-overline">Overview</p>
        <h2 className="mt-3" id="overview-title">
          Start with the question
        </h2>
      </div>

      <div className="mt-7 border-l-2 border-accent pl-5 sm:pl-6">
        <p className="text-xl font-semibold leading-8 text-text-primary sm:text-2xl">
          {project.question}
        </p>
        <p className="mt-4 text-lg leading-8 text-text-secondary">
          {project.overview.context}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-overline">At a glance</p>
          <h3 className="mt-2 text-xl sm:text-2xl">Demo performance snapshot</h3>
        </div>
        <p className="text-sm text-text-muted">All values are illustrative demo data.</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {project.overview.kpis.map((kpi) => (
          <KPICard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <TrendVisualization data={project.overview.trend} />

      <Card
        className="mt-5 flex flex-col gap-4 border-accent/25 p-5 sm:flex-row sm:items-start sm:p-6"
        surface="secondary"
      >
        <Badge className="self-start" variant="accent">
          Top takeaway
        </Badge>
        <div>
          <p className="font-semibold leading-7 text-text-primary">
            {project.overview.takeaway}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Illustrative interpretation for the Spotify demo—not a verified Spotify finding.
          </p>
        </div>
      </Card>

      <div className="mt-12">
        <div className="max-w-2xl">
          <p className="text-overline">Insight preview</p>
          <h3 className="mt-2 text-xl sm:text-2xl">Three patterns worth investigating</h3>
          <p className="mt-3 leading-7 text-text-secondary">
            These illustrative signals preview how the full story will move from a finding
            into supporting evidence.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {project.overview.insights.map((insight) => (
            <InsightCard insight={insight} key={insight.label} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-text-secondary">
          Continue into the authored story to understand what may be driving these demo
          patterns.
        </p>
        <ButtonLink className="shrink-0" href="#insights" size="lg">
          Explore the key insights
          <span aria-hidden="true">↓</span>
        </ButtonLink>
      </div>
    </section>
  );
}
