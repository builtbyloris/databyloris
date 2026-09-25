"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  chartTooltipStyle,
  formatDashboardMonth,
  formatPercent,
} from "@/components/analytics/chart-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import type { GenreGrowthResult } from "@/types/analytics";

interface GenreGrowthChartProps {
  result: GenreGrowthResult;
}

export function GenreGrowthChart({ result }: GenreGrowthChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <p className="text-overline">Relative growth</p>
        <CardTitle>Which genres are growing fastest?</CardTitle>
        <CardDescription>
          {result.status === "ready"
            ? `${formatDashboardMonth(result.earliestPeriod)} versus ${formatDashboardMonth(result.latestPeriod)}. Growth is distinct from total popularity.`
            : "Compares the first and last month available in the current selection."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.status === "ready" ? (
          <>
            <p className="sr-only">
              {result.items.map((item) => `${item.genre}: ${formatPercent(item.growthPercent)} growth`).join("; ")}.
            </p>
            <div className="min-w-0" style={{ height: Math.max(260, result.items.length * 48) }}>
              <ResponsiveContainer height="100%" width="100%">
                <BarChart accessibilityLayer data={result.items} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 5" />
                  <XAxis
                    axisLine={false}
                    tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                    tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
                    tickLine={false}
                    type="number"
                  />
                  <YAxis
                    axisLine={false}
                    dataKey="genre"
                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                    tickLine={false}
                    type="category"
                    width={82}
                  />
                  <ReferenceLine stroke="var(--text-muted)" x={0} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name, item) => {
                      if (name !== "growthPercent") return [value, name];
                      return [
                        `${formatPercent(Number(value))} · ${formatCompactMetric(Number(item.payload?.totalStreams ?? 0))} total streams`,
                        "Growth",
                      ];
                    }}
                    cursor={{ fill: "var(--accent-subtle)" }}
                  />
                  <Bar dataKey="growthPercent" fill="var(--accent)" isAnimationActive={false} maxBarSize={22} radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
              {result.items.map((item) => (
                <span key={item.genre}>
                  {item.genre}: {formatCompactMetric(item.totalStreams)} total
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-control border border-dashed border-border bg-surface-secondary p-5 text-sm leading-6 text-text-secondary">
            {result.reason}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
