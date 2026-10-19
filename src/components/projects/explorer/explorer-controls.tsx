"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {buttonStyles} from "@/components/ui";
import type {DatasetColumn} from "@/types";
import {explorerHref, type ExplorerControlsState} from "./explorer-url";

export function ExplorerControls({basePath, columns, controls, page}: {
  basePath: string;
  columns: DatasetColumn[];
  controls: ExplorerControlsState;
  page: number;
}) {
  const t = useTranslations("DatasetExplorer");
  const router = useRouter();
  const canonicalHref = explorerHref(basePath, controls, page);
  const active = Boolean(controls.search || controls.filterField || controls.sortField || page > 1);

  useEffect(() => {
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== canonicalHref) window.history.replaceState(null, "", canonicalHref);
  }, [canonicalHref]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const allowed = new Set(columns.map((column) => column.name));
    const filterField = String(data.get("filter") ?? "");
    const sortField = String(data.get("sort") ?? "");
    const next: ExplorerControlsState = {
      search: String(data.get("search") ?? "").trim().slice(0, 100),
      filterField: allowed.has(filterField) ? filterField : "",
      filterValue: allowed.has(filterField) ? String(data.get("value") ?? "").slice(0, 200) : "",
      sortField: allowed.has(sortField) ? sortField : "",
      sortDirection: data.get("dir") === "desc" ? "desc" : "asc",
    };
    const nextHref = explorerHref(basePath, next, 1);
    if (nextHref !== `${window.location.pathname}${window.location.search}`) router.push(nextHref, {scroll: false});
  };

  return (
    <form onSubmit={submit} role="search" className="mt-8 rounded-card border border-border bg-card p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-semibold lg:col-span-2">{t("search")}
          <input name="search" type="search" maxLength={100} defaultValue={controls.search} placeholder={t("searchPlaceholder")} className="mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 outline-none focus:border-primary" />
        </label>
        <label className="text-sm font-semibold">{t("filterField")}
          <select name="filter" defaultValue={controls.filterField} className="mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 outline-none focus:border-primary">
            <option value="">{t("allFields")}</option>
            {columns.map((column) => <option key={column.name} value={column.name}>{column.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">{t("filterValue")}
          <input name="value" maxLength={200} defaultValue={controls.filterValue} placeholder={t("filterPlaceholder")} className="mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 outline-none focus:border-primary" />
        </label>
        <label className="text-sm font-semibold">{t("sortField")}
          <select name="sort" defaultValue={controls.sortField} className="mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 outline-none focus:border-primary">
            <option value="">{t("originalOrder")}</option>
            {columns.map((column) => <option key={column.name} value={column.name}>{column.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">{t("sortDirection")}
          <select name="dir" defaultValue={controls.sortDirection} className="mt-1.5 h-11 w-full rounded-control border border-border bg-surface px-3 outline-none focus:border-primary">
            <option value="asc">{t("ascending")}</option><option value="desc">{t("descending")}</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonStyles({size: "sm"})}>{t("apply")}</button>
        {active ? <button type="button" onClick={() => router.push(basePath, {scroll: false})} className={buttonStyles({variant: "secondary", size: "sm"})}>{t("reset")}</button> : null}
      </div>
    </form>
  );
}
