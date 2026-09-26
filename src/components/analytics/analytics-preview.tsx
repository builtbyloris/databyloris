import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PublicDictionary } from "@/i18n/types";

export function AnalyticsPreview({ strings }: { strings: PublicDictionary["home"]["preview"] }) {
  return (
    <Card
      aria-label={strings.ariaLabel}
      className="overflow-hidden"
      role="group"
      surface="elevated"
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border">
        <div>
          <p className="text-sm font-semibold text-text-primary">{strings.title}</p>
          <p className="text-xs text-text-muted">{strings.updated}</p>
        </div>
        <Badge variant="accent">{strings.badge}</Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-5 sm:pt-6">
        <div className="flex flex-wrap gap-2" aria-label={strings.filtersLabel}>
          {strings.filters.map(([label, value]) => (
            <span
              className="rounded-control border border-border bg-surface-secondary px-2.5 py-1.5 text-xs text-text-secondary"
              key={label}
            >
              <span className="text-text-muted">{label}</span> · {value}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {strings.kpis.map((kpi) => (
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
              <p className="text-sm font-medium text-text-primary">{strings.trendTitle}</p>
              <p className="text-xs text-text-muted">{strings.trendContext}</p>
            </div>
            <Badge variant="success">{strings.trendBadge}</Badge>
          </div>

          <svg
            aria-labelledby="analytics-preview-chart-title"
            className="h-auto w-full"
            role="img"
            viewBox="0 0 560 180"
          >
            <title id="analytics-preview-chart-title">
              {strings.chartSummary}
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
          <Badge variant="accent">{strings.insightBadge}</Badge>
          <p className="text-sm leading-6 text-text-secondary">
            {strings.insight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
