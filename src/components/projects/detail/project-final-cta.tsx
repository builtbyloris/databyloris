import {getTranslations} from "next-intl/server";
import {buttonStyles} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function ProjectFinalCta({slug, dashboardAvailable}: {slug: string; dashboardAvailable: boolean}) {
  const t = await getTranslations("ProjectDetail.finalCta");

  return (
    <section className="border-t border-border pb-section pt-10 text-center sm:pt-12">
          <h2 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{dashboardAvailable ? t("titleDashboard") : t("titleProjects")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{dashboardAvailable ? t("descriptionDashboard") : t("descriptionProjects")}</p>
          <Link href={dashboardAvailable ? `/projects/${slug}/dashboard` : "/projects"} className={buttonStyles({size: "lg", className: "mt-7 w-full sm:w-auto"})}>
            {dashboardAvailable ? t("openDashboard") : t("backToProjects")} <span aria-hidden="true">→</span>
          </Link>
    </section>
  );
}
