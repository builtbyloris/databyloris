import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui";

export async function ProjectsHeader() {
  const t = await getTranslations("Projects");

  return (
    <div className="portfolio-header max-w-3xl">
      <Badge>{t("eyebrow")}</Badge>
      <h1 className="font-editorial mt-6 text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
        {t("headerTitle")}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {t("headerDescription")}
      </p>
    </div>
  );
}
