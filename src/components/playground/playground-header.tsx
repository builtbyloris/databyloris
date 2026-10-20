import {getTranslations} from "next-intl/server";
import {Badge, buttonStyles} from "@/components/ui";

export async function PlaygroundHeader() {
  const t = await getTranslations("Playground");

  return (
    <header className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="site-overline text-primary-strong">{t("eyebrow")}</p>
        <Badge className="border-border bg-surface-raised text-muted">{t("demoBadge")}</Badge>
      </div>
      <h1 className="font-editorial mt-5 text-5xl sm:text-6xl lg:text-7xl">{t("title")}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("description")}</p>
      <p className="mt-3 text-sm text-muted">{t("demoNotice")}</p>
      <a href="#playground-workspace" className={buttonStyles({className: "mt-6"})}>{t("start")}</a>
    </header>
  );
}
