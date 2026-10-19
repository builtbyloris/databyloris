export interface ExplorerControlsState {
  search: string;
  filterField: string;
  filterValue: string;
  sortField: string;
  sortDirection: "asc" | "desc";
}

export function explorerHref(basePath: string, controls: ExplorerControlsState, page: number) {
  const params = new URLSearchParams();
  if (controls.search) params.set("search", controls.search);
  if (controls.filterField) {
    params.set("filter", controls.filterField);
    if (controls.filterValue) params.set("value", controls.filterValue);
  }
  if (controls.sortField) {
    params.set("sort", controls.sortField);
    if (controls.sortDirection === "desc") params.set("dir", "desc");
  }
  if (page > 1) params.set("page", String(page));
  return `${basePath}${params.size ? `?${params}` : ""}`;
}
