export type FilterType = "select" | "multi-select" | "date-range" | "search";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  field: string;
  type: FilterType;
  options?: FilterOption[];
  defaultValue?: string | string[];
}
