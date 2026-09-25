"use server";

import { redirect } from "next/navigation";

import {
  getAuthorizedAdminEmail,
  isAdminAuthConfigured,
} from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/types/auth";

const unavailableMessage =
  "Admin authentication is temporarily unavailable. Please try again later.";

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    return { error: "Enter your email and password." };
  }

  const email = emailValue.trim();

  if (!email || !passwordValue) {
    return { error: "Enter your email and password." };
  }

  if (!isAdminAuthConfigured()) {
    return { error: unavailableMessage };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: passwordValue,
    });

    if (error || !data.user) {
      return { error: "Invalid email or password." };
    }

    if (
      data.user.email?.trim().toLowerCase() !== getAuthorizedAdminEmail()
    ) {
      await supabase.auth.signOut();
      return { error: "This account is not authorized for Admin access." };
    }
  } catch {
    return { error: unavailableMessage };
  }

  redirect("/admin");
}
