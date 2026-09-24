import Link from "next/link";

import { PUBLIC_NAV_ITEMS } from "./navigation";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-primary">
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md space-y-2">
          <Link
            className="inline-block rounded-control font-semibold tracking-tight text-text-primary hover:text-accent"
            href="/"
          >
            data<span className="text-accent">byloris</span>
          </Link>
          <p className="text-sm leading-6 text-text-secondary">
            A modular platform for clear, interactive data stories.
          </p>
          <p className="text-xs text-text-muted">© {currentYear} databyloris</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="rounded-control text-sm text-text-secondary hover:text-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
