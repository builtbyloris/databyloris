"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export function AdminNavigation({
  signOutAction,
}: {
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const projectsActive = pathname.startsWith("/admin/projects");

  const linkClassName = (active: boolean) =>
    `flex min-h-10 items-center rounded-control px-3 text-sm font-medium ${
      active
        ? "bg-accent-subtle text-accent"
        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
    }`;

  return (
    <nav aria-label="Admin navigation">
      <ul className="flex gap-2 overflow-x-auto overscroll-x-contain md:flex-col">
        <li>
          <Link
            aria-current={pathname === "/admin" ? "page" : undefined}
            className={linkClassName(pathname === "/admin")}
            href="/admin"
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            aria-current={projectsActive ? "page" : undefined}
            className={linkClassName(projectsActive)}
            href="/admin/projects"
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
  );
}
