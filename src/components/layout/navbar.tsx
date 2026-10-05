import {getTranslations} from "next-intl/server";
import {LanguageSwitcher} from "@/components/language-switcher";
import {MobileMenu} from "@/components/layout/mobile-menu";
import {ThemeToggle} from "@/components/theme-toggle";
import {Container, buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Navbar() {
  const t = await getTranslations("Navigation");
  const links = [
    {href: "/" as const, label: t("home")},
    {href: "/projects" as const, label: t("portfolio")},
    {href: "/playground" as const, label: t("playground")},
    {href: "/#how-it-works" as const, label: t("about")},
    {href: "/recruiter" as const, label: t("recruiter")},
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <Container className="flex h-[4.5rem] items-center justify-between gap-5">
        <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={t("logoLabel")}>
          <span className="brand-gradient grid size-8 place-items-center rounded-[0.65rem]">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="text-sm font-extrabold tracking-[-0.02em]">
            data<span className="text-primary">by</span>loris
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={t("menu")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/projects" className={buttonStyles({size: "sm", className: "ml-1"})}>
            {t("cta")}
          </Link>
        </div>
        <MobileMenu />
      </Container>
    </header>
  );
}
