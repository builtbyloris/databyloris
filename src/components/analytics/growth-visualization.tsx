import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { GrowthVisualizationData } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface GrowthVisualizationProps {
  data: GrowthVisualizationData;
  strings: PublicDictionary["project"]["insights"];
}

export function GrowthVisualization({ data, strings }: GrowthVisualizationProps) {
  const maximum = Math.max(...data.items.map((item) => item.growth));

  return (
    <Card aria-label={data.title} className="p-5 sm:p-6" role="group" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-text-primary">{data.title}</h4>
          <p className="mt-1 text-xs text-text-muted">{data.context}</p>
        </div>
        <Badge variant="warning">{strings.demoData}</Badge>
      </div>
      <p className="sr-only">{data.summary}</p>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-3 text-xs text-text-muted">
        <span><span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-accent" />{strings.growth}</span>
        <span>{strings.popularityNote}</span>
      </div>

      <ol className="mt-6 space-y-4">
        {data.items.map((item) => (
          <li className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)_7rem] sm:items-center" key={item.label}>
            <span className="text-sm font-medium text-text-primary">{item.label}</span>
            <div className="flex items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-badge bg-surface-secondary">
                <div
                  className="h-full rounded-badge bg-accent"
                  style={{ width: `${(item.growth / maximum) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-semibold text-accent">
                {item.displayGrowth}
              </span>
            </div>
            <span className="text-xs text-text-muted sm:text-right">
              {strings.popularity} {item.popularityIndex}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
