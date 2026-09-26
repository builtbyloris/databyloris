import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectMethodologyData } from "@/types/project";
import type { PublicDictionary } from "@/i18n/types";

interface ProjectMethodologyProps {
  methodology: ProjectMethodologyData;
  strings: PublicDictionary["project"]["methodology"];
}

interface MethodologyHeadingProps {
  eyebrow: string;
  id: string;
  title: string;
}

function MethodologyHeading({ eyebrow, id, title }: MethodologyHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-overline">{eyebrow}</p>
      <h3 className="mt-2 text-xl sm:text-2xl" id={id}>{title}</h3>
    </div>
  );
}

export function ProjectMethodology({ methodology, strings }: ProjectMethodologyProps) {
  return (
    <section
      aria-labelledby="methodology-title"
      className="scroll-mt-32 pt-14 sm:pt-20"
      id="methodology"
    >
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-overline">{strings.eyebrow}</p>
        <Badge variant="warning">{strings.badge}</Badge>
      </div>
      <h2 className="mt-3" id="methodology-title">
        {methodology.title}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
        {methodology.introduction}
      </p>

      <section aria-labelledby="analysis-objective-title" className="mt-12">
        <MethodologyHeading eyebrow={strings.objectiveEyebrow} id="analysis-objective-title" title={strings.objectiveTitle} />
        <p
          className="mt-5 border-l-2 border-accent pl-5 text-lg leading-8 text-text-secondary"
        >
          {methodology.objective}
        </p>
      </section>

      <section aria-labelledby="methodology-dataset-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.datasetEyebrow} id="methodology-dataset-title" title={strings.datasetTitle} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="leading-7 text-text-secondary">
              {methodology.dataset.description}
            </p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
                <dt className="text-sm font-semibold text-text-primary">{strings.grain}</dt>
                <dd className="text-sm text-text-secondary">{methodology.dataset.grain}</dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-5">
                <dt className="text-sm font-semibold text-text-primary">{strings.period}</dt>
                <dd className="text-sm text-text-secondary">{methodology.dataset.period}</dd>
              </div>
            </dl>
          </div>

          <Card className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-1" surface="secondary">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">{strings.dimensions}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {methodology.dataset.dimensions.map((dimension) => (
                  <li key={dimension}><Badge>{dimension}</Badge></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">{strings.metrics}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {methodology.dataset.metrics.map((metric) => (
                  <li key={metric}><Badge variant="accent">{metric}</Badge></li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <section aria-labelledby="data-preparation-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.preparationEyebrow} id="data-preparation-title" title={strings.preparationTitle} />
        <ol className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {methodology.preparation.map((item, index) => (
            <li className="flex gap-4" key={item}>
              <span className="font-mono text-xs font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-6 text-text-secondary">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="analysis-approach-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.approachEyebrow} id="analysis-approach-title" title={strings.approachTitle} />
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {methodology.techniques.map((technique) => (
            <div className="border-t border-border pt-4" key={technique.label}>
              <h4 className="font-semibold text-text-primary">{technique.label}</h4>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {technique.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="metric-definitions-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.metricsEyebrow} id="metric-definitions-title" title={strings.metricsTitle} />
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {methodology.metricDefinitions.map((metric) => (
            <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6" key={metric.label}>
              <dt className="font-semibold text-text-primary">{metric.label}</dt>
              <dd className="text-sm leading-6 text-text-secondary">{metric.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="tools-architecture-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.toolsEyebrow} id="tools-architecture-title" title={strings.toolsTitle} />
        <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {methodology.tools.map((tool) => (
            <li className="border-l border-border pl-4" key={tool.label}>
              <h4 className="font-semibold text-text-primary">{tool.label}</h4>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{tool.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="methodology-limitations-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.limitationsEyebrow} id="methodology-limitations-title" title={strings.limitationsTitle} />
        <Card className="mt-6 border-warning/30 p-5 sm:p-6" surface="secondary">
          <ul className="space-y-3">
            {methodology.limitations.map((limitation) => (
              <li className="flex gap-3 text-sm leading-6 text-text-secondary" key={limitation}>
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-warning" />
                {limitation}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="methodology-takeaways-title" className="mt-14 border-t border-border pt-10">
        <MethodologyHeading eyebrow={strings.takeawaysEyebrow} id="methodology-takeaways-title" title={strings.takeawaysTitle} />
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {methodology.takeaways.map((takeaway, index) => (
            <li className="grid gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:items-start" key={takeaway}>
              <span className="font-mono text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-medium leading-7 text-text-primary">{takeaway}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
