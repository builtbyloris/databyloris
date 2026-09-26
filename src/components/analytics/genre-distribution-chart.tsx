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
import type { PublicDictionary } from "@/i18n/types";

interface GenreDistributionChartProps {
  data: readonly GenreDistributionItem[];
  strings: PublicDictionary["dashboard"];
}

export function GenreDistributionChart({ data, strings }: GenreDistributionChartProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <p className="text-overline">{strings.charts.genres.eyebrow}</p>
        <CardTitle>{strings.charts.genres.title}</CardTitle>
        <CardDescription>{strings.charts.genres.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="sr-only">
          {data.map((item) => `${item.genre}: ${item.percentage.toFixed(1)} ${strings.charts.genres.percent}`).join("; ")}.
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
                tickFormatter={(value) =>
                  String(value).length > 7
                    ? `${String(value).slice(0, 6)}…`
                    : String(value)
                }
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
                  return [`${formatCompactMetric(Number(value))} (${percentage.toFixed(1)}%)`, strings.charts.streams];
                }}
                cursor={{ fill: "var(--accent-subtle)" }}
              />
              <Bar dataKey="streams" fill="var(--accent)" isAnimationActive={false} maxBarSize={44} radius={[5, 5, 0, 0]} />
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
