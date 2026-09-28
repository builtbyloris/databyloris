"use server";

import {redirect} from "next/navigation";
import type {AppLocale} from "@/i18n/routing";
import {adminPath, checkAdmin} from "@/lib/auth/require-admin";
import {createClient} from "@/lib/supabase/server";

export type LoginError = "required" | "invalid-credentials" | "access-denied" | "unexpected";
export interface LoginState {
  error: LoginError | null;
}

function getLocale(formData: FormData): AppLocale {
  return formData.get("locale") === "en" ? "en" : "it";
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const locale = getLocale(formData);
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return {error: "required"};
  }

  const supabase = await createClient();
  const {error} = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return {
      error: error.code === "invalid_credentials" ? "invalid-credentials" : "unexpected",
    };
  }

  const adminCheck = await checkAdmin(supabase);

  if (adminCheck.status !== "admin") {
    await supabase.auth.signOut();
    return {error: adminCheck.status === "forbidden" ? "access-denied" : "unexpected"};
  }

  redirect(adminPath(locale));
}

export async function logoutAction(formData: FormData) {
  const locale = getLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(adminPath(locale, "/login"));
}
