import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { RankingVisualizationData } from "@/types/analytics";

interface RankingVisualizationProps {
  data: RankingVisualizationData;
}

export function RankingVisualization({ data }: RankingVisualizationProps) {
  const maximum = Math.max(...data.items.map((item) => item.value));

  return (
    <Card aria-label={data.title} className="p-5 sm:p-6" role="group" surface="elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-text-primary">{data.title}</h4>
          <p className="mt-1 text-xs text-text-muted">{data.context}</p>
        </div>
        <Badge variant="warning">Demo data</Badge>
      </div>
      <p className="sr-only">{data.summary}</p>

      <ol className="mt-7 space-y-4">
        {data.items.map((item, index) => (
          <li className="grid grid-cols-[1.5rem_minmax(0,1fr)_3rem] items-center gap-3" key={item.label}>
            <span className="font-mono text-xs text-text-muted">{index + 1}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{item.label}</p>
              <div className="mt-2 h-2.5 overflow-hidden rounded-badge bg-surface-secondary">
                <div
                  className="h-full rounded-badge bg-accent"
                  style={{ width: `${(item.value / maximum) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-right text-sm font-semibold text-text-primary">
              {item.displayValue}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
