import {redirect} from "next/navigation";
import type {AppLocale} from "@/i18n/routing";
import {createClient} from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface AdminIdentity {
  id: string;
  email: string | null;
}

export type AdminCheck =
  | {status: "admin"; admin: AdminIdentity}
  | {status: "unauthenticated" | "forbidden" | "error"; admin: null};

export function adminPath(locale: AppLocale, path = "") {
  const prefix = locale === "en" ? "/en" : "";
  return `${prefix}/admin${path}`;
}

export async function checkAdmin(
  client?: SupabaseServerClient,
): Promise<AdminCheck> {
  const supabase = client ?? await createClient();
  const {data, error} = await supabase.auth.getClaims();
  const claims = data?.claims;
  const subject = claims?.sub;

  if (error || typeof subject !== "string") {
    return {status: "unauthenticated", admin: null};
  }

  const {data: membership, error: membershipError} = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", subject)
    .maybeSingle();

  if (membershipError) {
    return {status: "error", admin: null};
  }

  if (!membership) {
    return {status: "forbidden", admin: null};
  }

  return {
    status: "admin",
    admin: {
      id: subject,
      email: typeof claims?.email === "string" ? claims.email : null,
    },
  };
}

export async function requireAdmin(locale: AppLocale): Promise<AdminIdentity> {
  const result = await checkAdmin();

  if (result.status !== "admin") {
    const loginPath = adminPath(locale, "/login");
    if (result.status === "forbidden") redirect(`${loginPath}?error=access-denied`);
    if (result.status === "error") redirect(`${loginPath}?error=unexpected`);
    redirect(loginPath);
  }

  return result.admin;
}
