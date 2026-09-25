import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getAdminAccess } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin sign in | databyloris",
  description: "Private administrator access for databyloris.",
};

export default async function AdminLoginPage() {
  await connection();
  const access = await getAdminAccess();

  if (access.status === "authenticated") {
    redirect("/admin");
  }

  const isUnconfigured = access.status === "unconfigured";
  const isUnauthorized = access.status === "unauthorized";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link
            className="text-sm font-semibold tracking-tight text-text-primary hover:text-accent"
            href="/"
          >
            databyloris
          </Link>
          <p className="text-overline">Private workspace</p>
        </div>

        <Card surface="elevated">
          <CardHeader className="space-y-3">
            <h1 className="text-3xl">Admin sign in</h1>
            <p className="text-sm leading-6 text-text-secondary">
              Use the authorized administrator account to continue.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {isUnconfigured ? (
              <p
                className="rounded-control border border-warning/25 bg-warning-subtle px-3.5 py-3 text-sm text-warning"
                role="status"
              >
                Admin authentication is not configured in this environment.
              </p>
            ) : null}

            {isUnauthorized ? (
              <p
                className="rounded-control border border-danger/25 bg-danger-subtle px-3.5 py-3 text-sm text-danger"
                role="alert"
              >
                The current account is not authorized for Admin access. Sign in
                with the configured administrator account.
              </p>
            ) : null}

            <AdminLoginForm disabled={isUnconfigured} />
          </CardContent>
        </Card>

        <p className="text-center text-xs leading-5 text-text-muted">
          This area is separate from the public data storytelling experience.
          Public visitors do not need an account.
        </p>
      </div>
    </main>
  );
}
