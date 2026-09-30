import type {DashboardText} from "./project";

export type FilterType = "select" | "multi-select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: DashboardText;
  field: string;
  type: FilterType;
  options?: FilterOption[];
  defaultValue?: string | string[];
}
