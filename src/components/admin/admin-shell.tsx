import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminShellProps {
  children: ReactNode;
  signOutAction: () => Promise<void>;
}

export function AdminShell({ children, signOutAction }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-page-background">
      <a
        className="sr-only z-50 rounded-control bg-accent px-4 py-2 text-accent-contrast focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#admin-content"
      >
        Skip to admin content
      </a>

      <header className="border-b border-border bg-surface-primary">
        <div className="container-dashboard flex min-h-16 items-center justify-between gap-4">
          <Link
            className="inline-flex items-baseline gap-2 font-semibold tracking-tight text-text-primary hover:text-accent"
            href="/admin"
          >
            <span>databyloris</span>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
              Admin
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="container-dashboard grid gap-0 md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="border-b border-border py-4 md:min-h-[calc(100vh-4rem)] md:border-b-0 md:border-r md:py-8 md:pr-6">
          <nav aria-label="Admin navigation">
            <ul className="flex gap-2 overflow-x-auto md:flex-col">
              <li>
                <Link
                  aria-current="page"
                  className="flex min-h-10 items-center rounded-control bg-accent-subtle px-3 text-sm font-medium text-accent"
                  href="/admin"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  className="flex min-h-10 items-center rounded-control px-3 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  href="/admin#projects"
                >
                  Projects
                </Link>
              </li>
              <li className="md:mt-4 md:border-t md:border-border md:pt-4">
                <form action={signOutAction}>
                  <Button
                    className="w-full justify-start"
                    size="md"
                    type="submit"
                    variant="ghost"
                  >
                    Sign out
                  </Button>
                </form>
              </li>
            </ul>
          </nav>
        </aside>

        <main
          className="min-w-0 py-8 md:py-10 md:pl-8 lg:pl-10"
          id="admin-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
