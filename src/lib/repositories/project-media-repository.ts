import "server-only";

import {PROJECT_MEDIA_BUCKET} from "@/lib/project-media";
import {createClient} from "@/lib/supabase/server";
import {RepositoryError} from "./repository-error";

export async function removeProjectMediaFile(storagePath: string) {
  const supabase = await createClient();
  const {error} = await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove([storagePath]);
  if (error) throw new RepositoryError("database");
}

export async function downloadProjectMediaFile(storagePath: string) {
  const supabase = await createClient();
  const {data, error} = await supabase.storage.from(PROJECT_MEDIA_BUCKET).download(storagePath);
  if (error) throw new RepositoryError("database");
  return data;
}
