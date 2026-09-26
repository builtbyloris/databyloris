"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DotItemDotProps } from "recharts";

import {
  chartTooltipStyle,
  formatDashboardMonth,
} from "@/components/analytics/chart-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import { reportDashboardChartInteraction } from "@/lib/dashboard-interactions";
import type { MonthlyStreamsPoint } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface StreamingTrendChartProps {
  data: readonly MonthlyStreamsPoint[];
  strings: PublicDictionary["dashboard"];
}

function InteractiveTrendDot({ cx, cy, payload, strings }: DotItemDotProps & { strings: PublicDictionary["dashboard"] }) {
  const point = payload as MonthlyStreamsPoint;
  if (!point.period.endsWith("-01")) {
    return <circle cx={cx} cy={cy} fill="none" r={0} />;
  }

  function reportInteraction() {
    reportDashboardChartInteraction({
      moduleId: "streaming-trend",
      period: point.period,
    });
  }

  return (
    <circle
      aria-label={`${formatDashboardMonth(point.period, strings.locale)}: ${point.streams.toLocaleString(strings.locale)} ${strings.charts.streams}`}
      className="cursor-pointer fill-surface-elevated stroke-accent"
      cx={cx}
      cy={cy}
      data-dashboard-interaction="streaming-trend-point"
      onClick={reportInteraction}
      onFocus={reportInteraction}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          reportInteraction();
        }
      }}
      onMouseEnter={reportInteraction}
      r={5}
      role="button"
      strokeWidth={2}
      tabIndex={0}
    />
  );
}

export function StreamingTrendChart({ data, strings }: StreamingTrendChartProps) {
  const first = data[0];
  const last = data.at(-1);

  return (
    <Card className="min-w-0" surface="elevated">
      <CardHeader>
        <p className="text-overline">{strings.charts.trend.eyebrow}</p>
        <CardTitle>{strings.charts.trend.title}</CardTitle>
        <CardDescription>{strings.charts.trend.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length >= 2 ? (
          <>
            <p className="sr-only">
              {formatDashboardMonth(first.period, strings.locale)}: {first.streams.toLocaleString(strings.locale)} {strings.charts.streams}; {formatDashboardMonth(last!.period, strings.locale)}: {last!.streams.toLocaleString(strings.locale)} {strings.charts.streams}.
            </p>
            <div className="h-72 min-w-0 sm:h-80">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart
                  accessibilityLayer
                  data={data}
                  margin={{ bottom: 4, left: -8, right: 12, top: 12 }}
                >
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="period"
                    minTickGap={32}
                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    tickFormatter={(value) => formatDashboardMonth(value, strings.locale)}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    tickFormatter={formatCompactMetric}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [formatCompactMetric(Number(value)), strings.charts.streams]}
                    labelFormatter={(label) => formatDashboardMonth(String(label), strings.locale)}
                  />
                  <Line
                    activeDot={{ fill: "var(--accent-hover)", r: 5, strokeWidth: 0 }}
                    dataKey="streams"
                    dot={(props) => <InteractiveTrendDot {...props} strings={strings} />}
                    isAnimationActive={false}
                    stroke="var(--accent)"
                    strokeWidth={3}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="rounded-control border border-dashed border-border bg-surface-secondary p-5 text-sm text-text-secondary">
            {strings.charts.trend.insufficient}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
