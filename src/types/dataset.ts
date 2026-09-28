export type DatasetFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime";

export interface DatasetField {
  key: string;
  label: string;
  type: DatasetFieldType;
  description?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  source: string;
  fields: DatasetField[];
  updatedAt: string;
}

export type DashboardValue = string | number | boolean | null;
export type DashboardRecord = Record<string, DashboardValue>;
