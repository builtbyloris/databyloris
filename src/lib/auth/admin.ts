import "server-only";

import type { User } from "@supabase/supabase-js";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminAccess =
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | { status: "unconfigured" };

export function getAuthorizedAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
}

export function isAdminAuthConfigured() {
  return Boolean(getSupabasePublicConfig() && getAuthorizedAdminEmail());
}

export async function getAdminAccess(): Promise<AdminAccess> {
  const adminEmail = getAuthorizedAdminEmail();

  if (!getSupabasePublicConfig() || !adminEmail) {
    return { status: "unconfigured" };
  }

  let user: User | null = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();

    if (result.error) {
      return { status: "unauthenticated" };
    }

    user = result.data.user;
  } catch {
    return { status: "unauthenticated" };
  }

  if (!user) {
    return { status: "unauthenticated" };
  }

  if (user.email?.trim().toLowerCase() !== adminEmail) {
    return { status: "unauthorized" };
  }

  return { status: "authenticated", user };
}
