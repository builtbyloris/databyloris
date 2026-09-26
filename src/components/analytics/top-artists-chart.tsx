"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import type { ArtistRankingItem } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

interface TopArtistsChartProps {
  data: readonly ArtistRankingItem[];
  strings: PublicDictionary["dashboard"];
}

export function TopArtistsChart({ data, strings }: TopArtistsChartProps) {
  const [limit, setLimit] = useState<5 | 10>(5);
  const visibleData = data.slice(0, limit);

  return (
    <Card className="min-w-0">
      <CardHeader className="sm:flex sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <p className="text-overline">{strings.charts.artists.eyebrow}</p>
          <CardTitle className="mt-1">{strings.charts.artists.title}</CardTitle>
          <CardDescription className="mt-1">{strings.charts.artists.description}</CardDescription>
        </div>
        <div aria-label={strings.charts.artists.sizeAria} className="mt-4 flex gap-1 sm:mt-0">
          {([5, 10] as const).map((value) => (
            <Button
              aria-pressed={limit === value}
              className="min-w-16"
              key={value}
              onClick={() => setLimit(value)}
              size="sm"
              variant={limit === value ? "primary" : "ghost"}
            >
              {strings.charts.artists.top} {value}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="sr-only">
          {visibleData.map((item, index) => `${index + 1}. ${item.artistName}, ${item.streams.toLocaleString(strings.locale)} ${strings.charts.streams}`).join("; ")}.
        </p>
        <div className="min-w-0" style={{ height: Math.max(260, visibleData.length * 46) }}>
          <ResponsiveContainer height="100%" width="100%">
            <BarChart accessibilityLayer data={visibleData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis
                axisLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                tickFormatter={formatCompactMetric}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="artistName"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                tickLine={false}
                type="category"
                width={96}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [formatCompactMetric(Number(value)), strings.charts.streams]}
                cursor={{ fill: "var(--accent-subtle)" }}
              />
              <Bar dataKey="streams" fill="var(--accent)" isAnimationActive={false} maxBarSize={22} radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
