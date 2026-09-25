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

interface TopArtistsChartProps {
  data: readonly ArtistRankingItem[];
}

export function TopArtistsChart({ data }: TopArtistsChartProps) {
  const [limit, setLimit] = useState<5 | 10>(5);
  const visibleData = data.slice(0, limit);

  return (
    <Card className="min-w-0">
      <CardHeader className="sm:flex sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <p className="text-overline">Artist ranking</p>
          <CardTitle className="mt-1">Which artists lead the current selection?</CardTitle>
          <CardDescription className="mt-1">Ranked by illustrative streams.</CardDescription>
        </div>
        <div aria-label="Artist ranking size" className="mt-4 flex gap-1 sm:mt-0">
          {([5, 10] as const).map((value) => (
            <Button
              aria-pressed={limit === value}
              className="min-w-16"
              key={value}
              onClick={() => setLimit(value)}
              size="sm"
              variant={limit === value ? "primary" : "ghost"}
            >
              Top {value}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="sr-only">
          {visibleData.map((item, index) => `${index + 1}. ${item.artistName}, ${item.streams.toLocaleString("en-US")} streams`).join("; ")}.
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
                formatter={(value) => [formatCompactMetric(Number(value)), "Streams"]}
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
