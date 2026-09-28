import {getTranslations} from "next-intl/server";
import {Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");

  return (
    <footer className="border-t border-border bg-surface/40 py-10">
      <Container className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Link href="/" className="text-sm font-extrabold tracking-[-0.02em]">
            data<span className="text-primary">by</span>loris
          </Link>
          <p className="mt-2 text-sm text-muted">{t("description")}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted sm:items-end">
          <div className="flex gap-5">
            <Link href="/projects" className="hover:text-foreground">{nav("projects")}</Link>
            <Link href="/playground" className="hover:text-foreground">{nav("playground")}</Link>
          </div>
          <p>{t("copyright", {year: new Date().getFullYear()})}</p>
        </div>
      </Container>
    </footer>
  );
}
