import type {DatasetColumn, DatasetRights, DashboardConfig} from "@/types";
import {isSafeExternalUrl} from "@/lib/urls";

export const licenseTypes = ["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nd", "odbl", "custom", "competition-rules", "unknown"] as const;
export const sourcePlatforms = ["kaggle", "open-data", "other"] as const;
export const reviewStatuses = ["unverified", "verified", "needs-review"] as const;

export const emptyDatasetRights: DatasetRights = {
  sourceAuthor: "", sourceUrl: "", platform: "other", dataPeriod: "", snapshotDate: "",
  transformations: {it: "", en: ""}, licenseType: "unknown", licenseUrl: "",
  licenseVersion: "", licenseCheckedAt: "", reviewStatus: "unverified",
  restrictions: {it: "", en: ""}, reviewNotes: "",
  privacy: {personalData: false, directIdentifiers: false, quasiIdentifiers: false, fieldReview: false},
  confirmed: false,
};

const text = (value: unknown, max = 1000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const enumValue = <T extends string>(value: unknown, values: readonly T[], fallback: T): T =>
  typeof value === "string" && values.includes(value as T) ? value as T : fallback;

export function parseDatasetRights(value: unknown): DatasetRights {
  const raw = object(value);
  const transformations = object(raw.transformations);
  const restrictions = object(raw.restrictions);
  const privacy = object(raw.privacy);
  return {
    sourceAuthor: text(raw.sourceAuthor, 200), sourceUrl: text(raw.sourceUrl, 500),
    platform: enumValue(raw.platform, sourcePlatforms, "other"),
    dataPeriod: text(raw.dataPeriod, 120), snapshotDate: text(raw.snapshotDate, 10),
    transformations: {it: text(transformations.it), en: text(transformations.en)},
    licenseType: enumValue(raw.licenseType, licenseTypes, "unknown"),
    licenseUrl: text(raw.licenseUrl, 500), licenseVersion: text(raw.licenseVersion, 80),
    licenseCheckedAt: text(raw.licenseCheckedAt, 10),
    reviewStatus: enumValue(raw.reviewStatus, reviewStatuses, "unverified"),
    restrictions: {it: text(restrictions.it), en: text(restrictions.en)},
    reviewNotes: text(raw.reviewNotes),
    privacy: {
      personalData: privacy.personalData === true,
      directIdentifiers: privacy.directIdentifiers === true,
      quasiIdentifiers: privacy.quasiIdentifiers === true,
      fieldReview: privacy.fieldReview === true,
    },
    confirmed: raw.confirmed === true,
  };
}

export function isReviewedRights(rights: DatasetRights): boolean {
  return rights.reviewStatus === "verified" && rights.confirmed
    && Boolean(rights.sourceAuthor && rights.sourceUrl && rights.dataPeriod && rights.licenseUrl && rights.licenseVersion && rights.licenseCheckedAt)
    && isSafeExternalUrl(rights.sourceUrl)
    && isSafeExternalUrl(rights.licenseUrl)
    && Object.values(rights.privacy).every(Boolean)
    && (rights.licenseType === "cc0" || Boolean(rights.reviewNotes));
}

export function validRightsInput(rights: DatasetRights): boolean {
  const date = /^\d{4}-\d{2}-\d{2}$/;
  return Boolean(rights && typeof rights === "object")
    && licenseTypes.includes(rights.licenseType) && sourcePlatforms.includes(rights.platform)
    && reviewStatuses.includes(rights.reviewStatus)
    && (!rights.sourceUrl || isSafeExternalUrl(rights.sourceUrl))
    && (!rights.licenseUrl || isSafeExternalUrl(rights.licenseUrl))
    && (!rights.snapshotDate || date.test(rights.snapshotDate))
    && (!rights.licenseCheckedAt || date.test(rights.licenseCheckedAt))
    && (rights.reviewStatus !== "verified" || isReviewedRights(rights));
}

export function validFieldAllowlist(fields: string[], columns: DatasetColumn[]): boolean {
  const names = new Set(columns.map((column) => column.name));
  return fields.length <= columns.length && new Set(fields).size === fields.length
    && fields.every((field) => names.has(field));
}

export function dashboardReferencedFields(config: DashboardConfig): string[] {
  return [...new Set([
    ...config.filters.map((item) => item.field),
    ...config.kpis.map((item) => item.field),
    ...config.charts.flatMap((item) => [item.categoryField, item.valueField, item.seriesField, item.xField]),
    ...config.rankings.flatMap((item) => [item.dimension, item.metric, ...item.detailColumns.map((column) => column.field)]),
  ].filter((field): field is string => typeof field === "string" && field.trim().length > 0))];
}

const identifierPattern = /(^|[_\s-])(id|host[_\s-]?id|reviewer[_\s-]?id|name|comment|latitude|longitude|lat|lng|email|phone|url|address)([_\s-]|$)/i;
export function potentiallyIdentifyingFields(columns: DatasetColumn[]): string[] {
  return columns.map((column) => column.name).filter((name) => identifierPattern.test(name));
}
