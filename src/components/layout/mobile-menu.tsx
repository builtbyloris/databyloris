"use client";

import {useLocale, useTranslations} from "next-intl";
import {AnimatePresence, LazyMotion, domAnimation} from "motion/react";
import * as m from "motion/react-m";
import {useEffect, useRef, useState} from "react";
import {LanguageSwitcher} from "@/components/language-switcher";
import {MotionToggle} from "@/components/layout/motion-toggle";
import {ThemeToggle} from "@/components/theme-toggle";
import {buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import {cn} from "@/lib/cn";
import {useMotionPreference} from "@/lib/use-motion-preference";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const motionEnabled = useMotionPreference() === "full";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousLocaleRef = useRef(locale);
  const links = [
    {href: "/" as const, label: t("home")},
    {href: "/projects" as const, label: t("portfolio")},
    {href: "/playground" as const, label: t("playground")},
    {href: "/#how-it-works" as const, label: t("about")},
  ];

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (previousLocaleRef.current !== locale) {
      previousLocaleRef.current = locale;
      setIsOpen(false);
    }
  }, [locale]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="grid size-10 place-items-center rounded-control border border-border bg-surface text-foreground transition-colors hover:border-primary/40 hover:bg-surface-raised"
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

      <LazyMotion features={domAnimation} strict>
        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              ref={menuRef}
              id="mobile-navigation"
              initial={motionEnabled ? {opacity: 0, y: -8} : false}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: motionEnabled ? -8 : 0}}
              transition={{duration: motionEnabled ? 0.2 : 0}}
              inert={!isOpen}
              className="absolute inset-x-0 top-full border-b border-border bg-background px-gutter pb-6 pt-3 shadow-card"
            >
              <nav className="flex flex-col" aria-label={t("menu")}>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="border-b border-border py-3.5 font-editorial text-xl text-foreground transition-colors hover:text-primary-strong"
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
              <div className="mt-3"><MotionToggle /></div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
