import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { LifecycleVisualizationData } from "@/types/analytics";

interface LifecycleVisualizationProps {
  data: LifecycleVisualizationData;
}

const lineClasses = ["stroke-accent", "stroke-success", "stroke-warning"];
const dotClasses = ["bg-accent", "bg-success", "bg-warning"];
const dashPatterns = [undefined, "9 7", "2 6"];

const bounds = { left: 48, right: 620, top: 24, bottom: 218 };

export function LifecycleVisualization({ data }: LifecycleVisualizationProps) {
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;

  return (
    <Card aria-label={data.title} className="p-5 sm:p-6" role="group" surface="elevated">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-text-primary">{data.title}</h4>
          <p className="mt-1 text-xs text-text-muted">{data.context}</p>
        </div>
        <Badge className="self-start" variant="warning">Demo data</Badge>
      </div>
      <p className="sr-only">{data.summary}</p>

      <ul className="mt-6 grid gap-2 sm:grid-cols-3" aria-label="Lifecycle pattern legend">
        {data.series.map((series, index) => (
          <li className="rounded-control bg-surface-secondary px-3 py-2" key={series.label}>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className={`size-2.5 rounded-full ${dotClasses[index % dotClasses.length]}`} />
              <span className="text-sm font-semibold text-text-primary">{series.label}</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{series.description}</p>
          </li>
        ))}
      </ul>

      <svg
        aria-label={data.summary}
        className="mt-5 h-auto min-h-60 w-full"
        role="img"
        viewBox="0 0 640 260"
      >
        {[25, 50, 75, 100].map((tick) => {
          const y = bounds.bottom - (tick / 100) * height;

          return (
            <g key={tick}>
              <line className="text-border" stroke="currentColor" strokeDasharray="4 7" x1={bounds.left} x2={bounds.right} y1={y} y2={y} />
              <text className="fill-text-muted text-[10px]" textAnchor="end" x={bounds.left - 10} y={y + 3}>{tick}</text>
            </g>
          );
        })}

        {data.series.map((series, seriesIndex) => {
          const points = series.values
            .map((value, index) => {
              const x = bounds.left + (index / (series.values.length - 1)) * width;
              const y = bounds.bottom - (value / 100) * height;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polyline
              className={lineClasses[seriesIndex % lineClasses.length]}
              fill="none"
              key={series.label}
              points={points}
              strokeDasharray={dashPatterns[seriesIndex % dashPatterns.length]}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            >
              <title>{`${series.label}: ${series.description}`}</title>
            </polyline>
          );
        })}

        {data.labels.map((label, index) => {
          const x = bounds.left + (index / (data.labels.length - 1)) * width;
          return (
            <text className="fill-text-muted text-[10px]" key={label} textAnchor="middle" x={x} y={bounds.bottom + 26}>
              {label}
            </text>
          );
        })}
      </svg>
    </Card>
  );
}
