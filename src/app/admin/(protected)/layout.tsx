import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { signOut } from "@/app/admin/(protected)/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAccess } from "@/lib/auth/admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const access = await getAdminAccess();

  if (access.status !== "authenticated") {
    redirect("/admin/login");
  }

  return <AdminShell signOutAction={signOut}>{children}</AdminShell>;
}
