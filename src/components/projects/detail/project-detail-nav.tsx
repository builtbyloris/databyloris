import {getTranslations} from "next-intl/server";

const links = ["overview", "dataset", "methodology", "insights"] as const;

export async function ProjectDetailNav() {
  const t = await getTranslations("ProjectDetail.navigation");

  return (
    <nav aria-label={t("label")} className="sticky top-[4.45rem] z-30 border-y border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-gutter py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <a key={link} href={`#${link}`} className="shrink-0 rounded-control px-3.5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
            {t(link)}
          </a>
        ))}
      </div>
    </nav>
  );
}
