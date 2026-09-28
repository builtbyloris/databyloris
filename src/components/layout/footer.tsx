import {getTranslations} from "next-intl/server";
import {Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const links = [
    {href: "/" as const, label: nav("home")},
    {href: "/projects" as const, label: nav("portfolio")},
    {href: "/playground" as const, label: nav("playground")},
    {href: "/#how-it-works" as const, label: nav("about")},
  ];

  return (
    <footer className="border-t border-border bg-surface/40 py-10 sm:py-12">
      <Container className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <Link href="/" className="text-sm font-extrabold tracking-[-0.02em]">
            data<span className="text-primary">by</span>loris
          </Link>
          <p className="mt-2 text-sm text-muted">{t("description")}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted sm:items-end">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <p>{t("copyright", {year: new Date().getFullYear()})}</p>
        </div>
      </Container>
    </footer>
  );
}
