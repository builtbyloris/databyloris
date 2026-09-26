"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackAggregate } from "@/types/analytics";
import type { PublicDictionary } from "@/i18n/types";

type SortKey = keyof Pick<
  TrackAggregate,
  "trackName" | "artistName" | "genre" | "streams" | "listeners" | "popularity"
>;

type SortDirection = "ascending" | "descending";

interface TrackTableProps {
  data: readonly TrackAggregate[];
  strings: PublicDictionary["dashboard"];
}

const PAGE_SIZE = 5;

export function TrackTable({ data, strings }: TrackTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("streams");
  const [sortDirection, setSortDirection] = useState<SortDirection>("descending");
  const [requestedPage, setRequestedPage] = useState(1);

  const sortedData = useMemo(() => {
    return [...data].sort((trackA, trackB) => {
      const valueA = trackA[sortKey];
      const valueB = trackB[sortKey];
      const comparison =
        typeof valueA === "number" && typeof valueB === "number"
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [data, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const visibleRows = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const columns: readonly { key: SortKey; label: string; numeric?: boolean }[] = [
    { key: "trackName", label: strings.charts.table.track }, { key: "artistName", label: strings.charts.table.artist },
    { key: "genre", label: strings.charts.table.genre }, { key: "streams", label: strings.charts.table.streams, numeric: true },
    { key: "listeners", label: strings.charts.table.listeners, numeric: true }, { key: "popularity", label: strings.charts.table.popularity, numeric: true },
  ];

  function changeSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((current) =>
        current === "ascending" ? "descending" : "ascending",
      );
    } else {
      setSortKey(nextKey);
      setSortDirection(nextKey === "trackName" || nextKey === "artistName" || nextKey === "genre" ? "ascending" : "descending");
    }
    setRequestedPage(1);
  }

  return (
    <Card className="min-w-0">
      <CardHeader>
        <p className="text-overline">{strings.charts.table.eyebrow}</p>
        <CardTitle>{strings.charts.table.title}</CardTitle>
        <CardDescription>{strings.charts.table.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          aria-label={strings.charts.table.regionAria}
          className="overflow-x-auto overscroll-x-contain rounded-control border border-border"
          role="region"
          tabIndex={0}
        >
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              {strings.charts.table.caption}
            </caption>
            <thead className="bg-surface-secondary text-xs uppercase tracking-wide text-text-muted">
              <tr>
                {columns.map((column) => (
                  <th
                    aria-sort={sortKey === column.key ? sortDirection : "none"}
                    className={`px-4 py-3 font-semibold ${column.numeric ? "text-right" : ""}`}
                    key={column.key}
                    scope="col"
                  >
                    <button
                      className={`inline-flex min-h-9 w-full items-center gap-1 hover:text-text-primary ${column.numeric ? "justify-end" : ""}`}
                      onClick={() => changeSort(column.key)}
                      type="button"
                    >
                      {column.label}
                      {sortKey === column.key ? (
                        <span aria-hidden="true">{sortDirection === "ascending" ? "↑" : "↓"}</span>
                      ) : null}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((track) => (
                <tr className="border-t border-border text-text-secondary" key={track.trackId}>
                  <th className="px-4 py-3 font-medium text-text-primary" scope="row">{track.trackName}</th>
                  <td className="px-4 py-3">{track.artistName}</td>
                  <td className="px-4 py-3">{track.genre}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.streams.toLocaleString(strings.locale)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.listeners.toLocaleString(strings.locale)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.popularity.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-text-muted">
            {strings.charts.table.page} {page} {strings.charts.table.of} {totalPages} · {data.length} {strings.charts.table.tracks}
          </p>
          <div aria-label={strings.charts.table.paginationAria} className="flex gap-2" role="group">
            <Button aria-label={strings.charts.table.previousAria} disabled={page <= 1} onClick={() => setRequestedPage(page - 1)} size="sm" variant="secondary">
              {strings.charts.table.previous}
            </Button>
            <Button aria-label={strings.charts.table.nextAria} disabled={page >= totalPages} onClick={() => setRequestedPage(page + 1)} size="sm" variant="secondary">
              {strings.charts.table.next}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
