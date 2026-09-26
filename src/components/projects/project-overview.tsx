import { InsightCard } from "@/components/analytics/insight-card";
import { KPICard } from "@/components/analytics/kpi-card";
import { TrendVisualization } from "@/components/analytics/trend-visualization";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

interface ProjectOverviewProps {
  project: ProjectDetail;
  strings: PublicDictionary["project"]["overview"];
}

export function ProjectOverview({ project, strings }: ProjectOverviewProps) {
  return (
    <section
      aria-labelledby="overview-title"
      className="scroll-mt-32 border-b border-border pb-14 sm:pb-20"
      id="overview"
    >
      <div className="max-w-2xl">
        <p className="text-overline">{strings.eyebrow}</p>
        <h2 className="mt-3" id="overview-title">
          {strings.title}
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
          <p className="text-overline">{strings.glance}</p>
          <h3 className="mt-2 text-xl sm:text-2xl">{strings.snapshot}</h3>
        </div>
        <p className="text-sm text-text-muted">{strings.disclaimer}</p>
      </div>

      <div
        aria-label={strings.kpiAria}
        className="mt-5 grid scroll-mt-32 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-tour-target="overview-kpis"
        tabIndex={-1}
      >
        {project.overview.kpis.map((kpi) => (
          <KPICard demoLabel={strings.demoBadge} key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <TrendVisualization data={project.overview.trend} strings={strings} />

      <Card
        className="mt-5 flex flex-col gap-4 border-accent/25 p-5 sm:flex-row sm:items-start sm:p-6"
        surface="secondary"
      >
        <Badge className="self-start" variant="accent">
          {strings.takeaway}
        </Badge>
        <div>
          <p className="font-semibold leading-7 text-text-primary">
            {project.overview.takeaway}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            {strings.takeawayDisclaimer}
          </p>
        </div>
      </Card>

      <div className="mt-12">
        <div className="max-w-2xl">
          <p className="text-overline">{strings.previewEyebrow}</p>
          <h3 className="mt-2 text-xl sm:text-2xl">{strings.previewTitle}</h3>
          <p className="mt-3 leading-7 text-text-secondary">
            {strings.previewDescription}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {project.overview.insights.map((insight) => (
            <InsightCard insight={insight} key={insight.label} strings={strings} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-text-secondary">
          {strings.continueText}
        </p>
        <ButtonLink className="shrink-0" href="#insights" size="lg">
          {strings.continueCta}
          <span aria-hidden="true">↓</span>
        </ButtonLink>
      </div>
    </section>
  );
}
