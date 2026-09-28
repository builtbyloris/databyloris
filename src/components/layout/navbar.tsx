import {getTranslations} from "next-intl/server";
import {LanguageSwitcher} from "@/components/language-switcher";
import {ThemeToggle} from "@/components/theme-toggle";
import {Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Navbar() {
  const t = await getTranslations("Navigation");
  const links = [
    {href: "/projects" as const, label: t("projects")},
    {href: "/playground" as const, label: t("playground")},
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/78 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-5">
        <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="databyloris home">
          <span className="brand-gradient grid size-8 place-items-center rounded-[0.65rem] shadow-soft">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <span className="text-sm font-extrabold tracking-[-0.02em]">
            data<span className="text-primary">by</span>loris
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label={t("menu")}>
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

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
