"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { chartTooltipStyle } from "@/components/analytics/chart-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import type { GenreDistributionItem } from "@/types/analytics";

interface GenreDistributionChartProps {
  data: readonly GenreDistributionItem[];
}

export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <p className="text-overline">Genre distribution</p>
        <CardTitle>Which genres account for the most listening?</CardTitle>
        <CardDescription>Share of illustrative streams in the current selection.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="sr-only">
          {data.map((item) => `${item.genre}: ${item.percentage.toFixed(1)} percent`).join("; ")}.
        </p>
        <div className="h-64 min-w-0">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart accessibilityLayer data={data} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="genre"
                interval={0}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                tickFormatter={formatCompactMetric}
                tickLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value, name, item) => {
                  if (name !== "streams") return [value, name];
                  const percentage = Number(item.payload?.percentage ?? 0);
                  return [`${formatCompactMetric(Number(value))} (${percentage.toFixed(1)}%)`, "Streams"];
                }}
                cursor={{ fill: "var(--accent-subtle)" }}
              />
              <Bar dataKey="streams" fill="var(--accent)" maxBarSize={44} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.map((item) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={item.genre}>
              <span className="truncate text-text-secondary">{item.genre}</span>
              <span className="shrink-0 font-mono text-xs text-text-primary">
                {formatCompactMetric(item.streams)} · {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
