"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackAggregate } from "@/types/analytics";

type SortKey = keyof Pick<
  TrackAggregate,
  "trackName" | "artistName" | "genre" | "streams" | "listeners" | "popularity"
>;

type SortDirection = "ascending" | "descending";

interface TrackTableProps {
  data: readonly TrackAggregate[];
}

const columns: readonly { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "trackName", label: "Track" },
  { key: "artistName", label: "Artist" },
  { key: "genre", label: "Genre" },
  { key: "streams", label: "Streams", numeric: true },
  { key: "listeners", label: "Listeners", numeric: true },
  { key: "popularity", label: "Popularity", numeric: true },
];

const PAGE_SIZE = 5;

export function TrackTable({ data }: TrackTableProps) {
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
        <p className="text-overline">Track detail</p>
        <CardTitle>How does the selection break down by track?</CardTitle>
        <CardDescription>
          Aggregated from the current filtered records. Select a column heading to sort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-control border border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
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
                      className={`inline-flex w-full items-center gap-1 hover:text-text-primary ${column.numeric ? "justify-end" : ""}`}
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
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.streams.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.listeners.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{track.popularity.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-text-muted">
            Page {page} of {totalPages} · {data.length} tracks
          </p>
          <div className="flex gap-2">
            <Button disabled={page <= 1} onClick={() => setRequestedPage(page - 1)} size="sm" variant="secondary">
              Previous
            </Button>
            <Button disabled={page >= totalPages} onClick={() => setRequestedPage(page + 1)} size="sm" variant="secondary">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
