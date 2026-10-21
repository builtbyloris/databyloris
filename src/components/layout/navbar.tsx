import {getTranslations} from "next-intl/server";
import {LanguageSwitcher} from "@/components/language-switcher";
import {MobileMenu} from "@/components/layout/mobile-menu";
import {ThemeToggle} from "@/components/theme-toggle";
import {Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Navbar() {
  const t = await getTranslations("Navigation");
  const links = [
    {href: "/" as const, label: t("home")},
    {href: "/projects" as const, label: t("portfolio")},
    {href: "/playground" as const, label: t("playground")},
    {href: "/#how-it-works" as const, label: t("about")},
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex h-[4.75rem] items-center justify-between gap-5">
        <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={t("logoLabel")}>
          <span className="grid size-9 grid-cols-3 items-end gap-0.5 rounded-control border border-border bg-surface p-2 shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true">
            <span className="h-2 rounded-[1px] bg-primary" /><span className="h-4 rounded-[1px] bg-primary" /><span className="h-3 rounded-[1px] bg-primary" />
          </span>
          <span className="text-sm font-bold tracking-[-0.035em]">
            data<span className="text-primary">by</span>loris
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={t("menu")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/projects" className="editorial-action editorial-action-compact ml-1">
            {t("cta")} <span aria-hidden="true" className="editorial-action-icon">↗</span>
          </Link>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}
