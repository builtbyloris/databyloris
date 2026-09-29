import type {DashboardRecord, DashboardValue} from "@/types";

const invisibleEdgeCharacters = "\\u200B-\\u200D\\u2060\\uFEFF";
const invisibleEdges = new RegExp(`^[\\s${invisibleEdgeCharacters}]+|[\\s${invisibleEdgeCharacters}]+$`, "gu");

export function normalizeDatasetFieldName(value: string) {
  return value
    .normalize("NFKC")
    .replace(invisibleEdges, "")
    .replace(/\s+/gu, " ")
    .toLowerCase();
}

export function resolveDatasetFieldName(value: string, availableFields: readonly string[]) {
  if (availableFields.includes(value)) return value;

  const normalizedValue = normalizeDatasetFieldName(value);
  if (!normalizedValue) return null;

  const matches = availableFields.filter(
    (candidate) => normalizeDatasetFieldName(candidate) === normalizedValue,
  );

  return matches.length === 1 ? matches[0] : null;
}

export function getAvailableDatasetFields(
  schemaFields: readonly string[],
  records: readonly DashboardRecord[],
) {
  const fields = [...schemaFields];
  const normalizedFields = new Set(fields.map(normalizeDatasetFieldName));

  for (const record of records) {
    for (const field of Object.keys(record)) {
      const normalizedField = normalizeDatasetFieldName(field);
      if (normalizedFields.has(normalizedField)) continue;
      fields.push(field);
      normalizedFields.add(normalizedField);
    }
  }

  return fields;
}

export function readDashboardField(record: DashboardRecord, field: string): DashboardValue | undefined {
  if (Object.prototype.hasOwnProperty.call(record, field)) return record[field];
  const resolvedField = resolveDatasetFieldName(field, Object.keys(record));
  return resolvedField === null ? undefined : record[resolvedField];
}
