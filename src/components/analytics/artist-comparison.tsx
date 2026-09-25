"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactMetric } from "@/lib/dashboard-analytics";
import type { ArtistComparisonMetric } from "@/types/analytics";

interface ArtistComparisonProps {
  data: readonly ArtistComparisonMetric[];
}

const metricRows = [
  {
    label: "Total Streams",
    read: (artist: ArtistComparisonMetric) => formatCompactMetric(artist.totalStreams),
  },
  {
    label: "Unique Listeners",
    read: (artist: ArtistComparisonMetric) => formatCompactMetric(artist.uniqueListeners),
  },
  {
    label: "Average Popularity",
    read: (artist: ArtistComparisonMetric) => artist.averagePopularity.toFixed(1),
  },
  {
    label: "Playlist Reach",
    read: (artist: ArtistComparisonMetric) => formatCompactMetric(artist.playlistReach),
  },
] as const;

export function ArtistComparison({ data }: ArtistComparisonProps) {
  const [artistAChoice, setArtistAChoice] = useState<string | null>(null);
  const [artistBChoice, setArtistBChoice] = useState<string | null>(null);

  const artistA = data.find((artist) => artist.artistName === artistAChoice) ?? data[0];
  const artistB =
    data.find(
      (artist) =>
        artist.artistName === artistBChoice &&
        artist.artistName !== artistA?.artistName,
    ) ?? data.find((artist) => artist.artistName !== artistA?.artistName);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <p className="text-overline">Artist comparison</p>
        <CardTitle>How do two artists compare?</CardTitle>
        <CardDescription>
          Uses the global period, country, and genre. The global artist filter stays independent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length >= 2 && artistA && artistB ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-text-secondary">
                Artist A
                <select
                  className="min-h-11 w-full rounded-control border border-border bg-surface-primary px-3 text-sm text-text-primary"
                  onChange={(event) => setArtistAChoice(event.target.value)}
                  value={artistA.artistName}
                >
                  {data.map((artist) => (
                    <option disabled={artist.artistName === artistB.artistName} key={artist.artistName} value={artist.artistName}>
                      {artist.artistName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-text-secondary">
                Artist B
                <select
                  className="min-h-11 w-full rounded-control border border-border bg-surface-primary px-3 text-sm text-text-primary"
                  onChange={(event) => setArtistBChoice(event.target.value)}
                  value={artistB.artistName}
                >
                  {data.map((artist) => (
                    <option disabled={artist.artistName === artistA.artistName} key={artist.artistName} value={artist.artistName}>
                      {artist.artistName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-control border border-border">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,0.8fr)_minmax(5rem,0.8fr)] gap-2 bg-surface-secondary px-3 py-2 text-xs font-semibold text-text-muted sm:px-4">
                <span>Metric</span>
                <span className="truncate text-right text-text-primary">{artistA.artistName}</span>
                <span className="truncate text-right text-text-primary">{artistB.artistName}</span>
              </div>
              {metricRows.map((metric) => (
                <div
                  className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,0.8fr)_minmax(5rem,0.8fr)] gap-2 border-t border-border px-3 py-3 text-sm sm:px-4"
                  key={metric.label}
                >
                  <span className="text-text-secondary">{metric.label}</span>
                  <span className="text-right font-mono text-xs font-semibold text-text-primary sm:text-sm">
                    {metric.read(artistA)}
                  </span>
                  <span className="text-right font-mono text-xs font-semibold text-text-primary sm:text-sm">
                    {metric.read(artistB)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-control border border-dashed border-border bg-surface-secondary p-5 text-sm leading-6 text-text-secondary">
            At least two artists must be available after applying period, country, and genre filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
