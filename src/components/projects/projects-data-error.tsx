import {getTranslations} from "next-intl/server";
import {buttonStyles, Card} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function ProjectsDataError({retryHref}: {retryHref: "/" | "/projects"}) {
  const t = await getTranslations("Projects");

  return (
    <Card className="data-grid p-8 text-center sm:p-10">
      <div className="relative mx-auto max-w-lg">
        <h2 className="text-2xl font-bold tracking-tight">{t("dataErrorTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{t("dataErrorDescription")}</p>
        <Link href={retryHref} className={buttonStyles({variant: "secondary", className: "mt-6"})}>
          {t("dataErrorRetry")}
        </Link>
      </div>
    </Card>
  );
}
