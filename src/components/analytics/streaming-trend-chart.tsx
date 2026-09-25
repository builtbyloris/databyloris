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

import {
  chartTooltipStyle,
  formatDashboardMonth,
} from "@/components/analytics/chart-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import type { MonthlyStreamsPoint } from "@/types/analytics";

interface StreamingTrendChartProps {
  data: readonly MonthlyStreamsPoint[];
}

export function StreamingTrendChart({ data }: StreamingTrendChartProps) {
  const first = data[0];
  const last = data.at(-1);

  return (
    <Card className="min-w-0" surface="elevated">
      <CardHeader>
        <p className="text-overline">Streaming trend</p>
        <CardTitle>How is streaming activity changing over time?</CardTitle>
        <CardDescription>
          Monthly illustrative streams for the current global selection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length >= 2 ? (
          <>
            <p className="sr-only">
              The series runs from {formatDashboardMonth(first.period)}, with {first.streams.toLocaleString("en-US")} streams,
              to {formatDashboardMonth(last!.period)}, with {last!.streams.toLocaleString("en-US")} streams.
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
                    tickFormatter={formatDashboardMonth}
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
                    formatter={(value) => [formatCompactMetric(Number(value)), "Streams"]}
                    labelFormatter={(label) => formatDashboardMonth(String(label))}
                  />
                  <Line
                    activeDot={{ fill: "var(--accent-hover)", r: 5, strokeWidth: 0 }}
                    dataKey="streams"
                    dot={false}
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
            Select a period containing at least two months to show a trend.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
