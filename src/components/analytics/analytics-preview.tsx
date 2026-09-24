import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const previewKpis = [
  { label: "Sessions", value: "12.8M" },
  { label: "Markets", value: "64" },
  { label: "Growth", value: "+8.2%" },
];

export function AnalyticsPreview() {
  return (
    <Card
      aria-label="Illustrative analytics product preview"
      className="overflow-hidden"
      role="group"
      surface="elevated"
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border">
        <div>
          <p className="text-sm font-semibold text-text-primary">Audience overview</p>
          <p className="text-xs text-text-muted">Updated monthly</p>
        </div>
        <Badge variant="accent">Illustrative preview</Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-5 sm:pt-6">
        <div className="flex flex-wrap gap-2" aria-label="Dashboard filters">
          {[
            ["Period", "Last 12 months"],
            ["Region", "All markets"],
            ["Segment", "All audiences"],
          ].map(([label, value]) => (
            <span
              className="rounded-control border border-border bg-surface-secondary px-2.5 py-1.5 text-xs text-text-secondary"
              key={label}
            >
              <span className="text-text-muted">{label}</span> · {value}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {previewKpis.map((kpi) => (
            <div
              className="rounded-control border border-border bg-surface-primary p-3 sm:p-4"
              key={kpi.label}
            >
              <p className="text-xs text-text-muted">{kpi.label}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-border bg-surface-secondary p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Engagement trend</p>
              <p className="text-xs text-text-muted">Illustrative index</p>
            </div>
            <Badge variant="success">Rising</Badge>
          </div>

          <svg
            aria-labelledby="analytics-preview-chart-title"
            className="h-auto w-full"
            role="img"
            viewBox="0 0 560 180"
          >
            <title id="analytics-preview-chart-title">
              Illustrative line chart trending upward with minor variation
            </title>
            <path
              className="text-border"
              d="M0 25H560M0 80H560M0 135H560"
              fill="none"
              stroke="currentColor"
              strokeDasharray="4 7"
            />
            <path
              className="text-accent-subtle"
              d="M0 144C48 136 68 118 108 124C153 130 168 102 215 106C259 109 281 75 323 82C368 89 390 57 430 62C474 67 506 31 560 24V180H0Z"
              fill="currentColor"
            />
            <path
              className="text-accent"
              d="M0 144C48 136 68 118 108 124C153 130 168 102 215 106C259 109 281 75 323 82C368 89 390 57 430 62C474 67 506 31 560 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
        </div>

        <div className="flex items-start gap-3 rounded-control border border-accent/25 bg-accent-subtle p-3">
          <Badge variant="accent">Insight</Badge>
          <p className="text-sm leading-6 text-text-secondary">
            Momentum strengthened across several audience segments in the latest period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
