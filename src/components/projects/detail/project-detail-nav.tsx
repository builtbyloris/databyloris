import {getTranslations} from "next-intl/server";

const links = ["overview", "dataset", "methodology", "insights"] as const;

export async function ProjectDetailNav() {
  const t = await getTranslations("ProjectDetail.navigation");

  return (
    <nav aria-label={t("label")} className="sticky top-[4.75rem] z-30 border-y border-border bg-background/96 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl gap-6 overflow-x-auto px-gutter [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <a key={link} href={`#${link}`} className="shrink-0 border-b-2 border-transparent py-3.5 text-sm font-semibold text-muted transition-[color,border-color] hover:border-primary hover:text-foreground focus-visible:border-primary">
            {t(link)}
          </a>
        ))}
      </div>
    </nav>
  );
}
