"use client";

import {useTranslations} from "next-intl";
import {useState} from "react";
import {LanguageSwitcher} from "@/components/language-switcher";
import {ThemeToggle} from "@/components/theme-toggle";
import {buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import {cn} from "@/lib/cn";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navigation");
  const links = [
    {href: "/" as const, label: t("home")},
    {href: "/projects" as const, label: t("portfolio")},
    {href: "/playground" as const, label: t("playground")},
    {href: "/#how-it-works" as const, label: t("about")},
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-10 place-items-center rounded-control border border-border bg-surface/70 text-foreground transition-colors hover:bg-surface-raised"
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="relative block h-4 w-5" aria-hidden="true">
          <span className={cn("absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform", isOpen && "translate-y-[7px] rotate-45")} />
          <span className={cn("absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity", isOpen && "opacity-0")} />
          <span className={cn("absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current transition-transform", isOpen && "-translate-y-[7px] -rotate-45")} />
        </span>
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full border-b border-border bg-background/95 px-gutter pb-6 pt-3 shadow-card backdrop-blur-xl"
        >
          <nav className="flex flex-col" aria-label={t("menu")}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-border py-3.5 text-base font-semibold text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/projects"
            onClick={() => setIsOpen(false)}
            className={buttonStyles({className: "mt-5 w-full"})}
          >
            {t("cta")}
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
