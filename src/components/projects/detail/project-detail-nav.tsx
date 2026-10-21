import {getTranslations} from "next-intl/server";
import {SectionMap} from "@/components/home/section-map";

const links = ["overview", "dataset", "methodology", "insights"] as const;

export async function ProjectDetailNav() {
  const t = await getTranslations("ProjectDetail.navigation");

  return (
    <>
      <SectionMap label={t("label")} sections={links.map((id) => ({id, label: t(id), description: t(`${id}Description`)}))} />
      <nav aria-label={t("label")} className="sticky top-[4.75rem] z-30 border-y border-border bg-background/96 backdrop-blur-sm xl:hidden">
        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-gutter py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <a key={link} href={`#${link}`} className="shrink-0 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:bg-surface-raised hover:text-foreground">
              {t(link)}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
