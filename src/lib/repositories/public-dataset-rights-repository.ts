import "server-only";

import {createClient} from "@/lib/supabase/server";
import {isSafeExternalUrl} from "@/lib/urls";
import type {DatasetRights} from "@/types";
import {parseDatasetRights} from "@/lib/datasets/rights";
import {RepositoryError} from "./repository-error";

export interface PublicDatasetRights {
  name: string;
  recordCount: number;
  reviewed: boolean;
  rights: DatasetRights;
}

export async function getPublishedDatasetRights(slug: string): Promise<PublicDatasetRights | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_dataset_rights", {p_slug: slug});
  if (error?.code === "PGRST202") return null; // Additive migration has not reached this environment yet.
  if (error) throw new RepositoryError("database");
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const raw = data as Record<string, unknown>;
  if (typeof raw.name !== "string" || typeof raw.recordCount !== "number" || raw.recordCount < 0) return null;
  const rights = parseDatasetRights(raw);
  if (!isSafeExternalUrl(rights.sourceUrl)) return null;
  if (rights.licenseUrl && !isSafeExternalUrl(rights.licenseUrl)) rights.licenseUrl = "";
  return {name: raw.name, recordCount: raw.recordCount, reviewed: raw.reviewed === true, rights};
}
