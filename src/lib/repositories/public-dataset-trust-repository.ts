import "server-only";

import {createClient} from "@/lib/supabase/server";
import type {Json} from "@/types/database";
import {RepositoryError} from "./repository-error";

export interface DatasetTrustMetadata {
  name: string;
  originalFilename: string | null;
  schemaFieldCount: number;
  publicFieldCount: number;
  explorerEnabled: true;
  updatedAt: string;
}

function isObject(value: Json | null): value is {[key: string]: Json | undefined} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getPublishedExplorerTrustMetadata(
  slug: string,
  datasetId: string,
  publicFieldCount: number,
): Promise<DatasetTrustMetadata | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.rpc("get_published_explorer_trust_metadata", {
    p_slug: slug,
    p_dataset_id: datasetId,
  });
  // Keep the Explorer available during an additive, code-first deployment.
  if (error?.code === "PGRST202") return null;
  if (error) throw new RepositoryError("database");
  if (data === null) return null;
  if (!isObject(data) || typeof data.name !== "string" || !data.name.trim()
    || (data.originalFilename !== null && typeof data.originalFilename !== "string")
    || !Number.isSafeInteger(data.schemaFieldCount)
    || (data.schemaFieldCount as number) < publicFieldCount
    || data.publicFieldCount !== publicFieldCount
    || data.explorerEnabled !== true
    || typeof data.updatedAt !== "string"
    || !Number.isFinite(Date.parse(data.updatedAt))) throw new RepositoryError("invalid_data");
  return data as unknown as DatasetTrustMetadata;
}
