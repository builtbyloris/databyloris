"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { PUBLIC_NAV_ITEMS } from "./navigation";

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-page-background/95 backdrop-blur-md">
      <a
        className="sr-only z-60 rounded-control bg-surface-elevated px-4 py-2 text-sm font-semibold text-text-primary focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
        href="#main-content"
      >
        Skip to main content
      </a>

      <div className="container-page flex min-h-16 items-center gap-3">
        <Link
          aria-current={pathname === "/" ? "page" : undefined}
          className="rounded-control text-base font-semibold tracking-tight text-text-primary hover:text-accent"
          href="/"
          onClick={closeMenu}
        >
          data<span className="text-accent">byloris</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-1">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-10 items-center rounded-control px-3 text-sm font-medium ${
                        active
                          ? "bg-accent-subtle text-accent"
                          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                      }`}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <ThemeToggle />

        <Button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          size="icon"
          variant="ghost"
        >
          {menuOpen ? (
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
          )}
        </Button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border bg-surface-primary md:hidden" id="mobile-navigation">
          <nav aria-label="Mobile navigation" className="container-page py-3">
            <ul className="space-y-1">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-control px-3 text-sm font-medium ${
                        active
                          ? "bg-accent-subtle text-accent"
                          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                      }`}
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
