import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TrendVisualizationData } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface TrendVisualizationProps {
  data: TrendVisualizationData;
  strings: PublicDictionary["project"]["overview"];
}

const chart = {
  left: 62,
  right: 614,
  top: 28,
  bottom: 236,
};

export function TrendVisualization({ data, strings }: TrendVisualizationProps) {
  const width = chart.right - chart.left;
  const height = chart.bottom - chart.top;
  const range = data.yAxis.maximum - data.yAxis.minimum;

  const points = data.points.map((point, index) => ({
    ...point,
    x:
      data.points.length === 1
        ? chart.left + width / 2
        : chart.left + (index / (data.points.length - 1)) * width,
    y: chart.top + ((data.yAxis.maximum - point.value) / range) * height,
  }));

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${chart.left},${chart.bottom} ${linePoints} ${chart.right},${chart.bottom}`;

  return (
    <Card className="mt-8 overflow-hidden" surface="elevated">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <p className="text-overline">{data.eyebrow}</p>
          <h3 className="mt-2 text-xl sm:text-2xl" id={`${data.id}-title`}>
            {data.title}
          </h3>
          <p className="mt-2 text-sm text-text-muted">{data.context}</p>
        </div>
        <Badge className="self-start" variant="warning">
          {strings.illustrativeData}
        </Badge>
      </div>

      <div className="p-4 sm:p-6">
        <p className="sr-only" id={`${data.id}-summary`}>
          {data.summary}
        </p>
        <svg
          aria-labelledby={`${data.id}-title ${data.id}-summary`}
          className="h-auto min-h-60 w-full"
          role="img"
          viewBox="0 0 640 280"
        >
          {data.yAxis.ticks.map((tick) => {
            const y = chart.top + ((data.yAxis.maximum - tick.value) / range) * height;

            return (
              <g key={tick.value}>
                <line
                  className="text-border"
                  stroke="currentColor"
                  strokeDasharray="4 7"
                  x1={chart.left}
                  x2={chart.right}
                  y1={y}
                  y2={y}
                />
                <text
                  className="fill-text-muted text-[11px]"
                  textAnchor="end"
                  x={chart.left - 12}
                  y={y + 4}
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          <polygon className="fill-accent-subtle" points={areaPoints} />
          <polyline
            className="stroke-accent"
            fill="none"
            points={linePoints}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          {points.map((point) => (
            <g key={point.label}>
              <circle
                className="fill-surface-elevated stroke-accent"
                cx={point.x}
                cy={point.y}
                r="6"
                strokeWidth="4"
              >
                <title>{`${point.label}: ${point.displayValue} ${strings.illustrativeStreams}`}</title>
              </circle>
              <text
                className="fill-text-secondary text-[12px] font-medium"
                textAnchor="middle"
                x={point.x}
                y={chart.bottom + 28}
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>

        <ul
          aria-label={strings.annualValuesAria}
          className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {data.points.map((point) => (
            <li
              className="rounded-control border border-border bg-surface-secondary px-3 py-2 text-sm"
              key={point.label}
            >
              <span className="text-text-muted">{point.label}</span>{" "}
              <span className="font-semibold text-text-primary">{point.displayValue}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
