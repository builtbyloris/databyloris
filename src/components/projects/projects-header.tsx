import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui";

export async function ProjectsHeader() {
  const t = await getTranslations("Projects");

  return (
    <div className="max-w-3xl">
      <Badge>{t("eyebrow")}</Badge>
      <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
        {t("headerTitle")}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {t("headerDescription")}
      </p>
    </div>
  );
}
