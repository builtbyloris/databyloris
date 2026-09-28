import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui";

export async function PlaygroundHeader() {
  const t = await getTranslations("Playground");

  return (
    <header className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-strong">{t("eyebrow")}</p>
        <Badge className="border-cyan/25 bg-cyan/10 text-cyan">{t("demoBadge")}</Badge>
      </div>
      <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">{t("title")}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{t("description")}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted">
        <span className="size-2 rounded-full bg-cyan" aria-hidden="true" />
        {t("demoNotice")}
      </p>
    </header>
  );
}
