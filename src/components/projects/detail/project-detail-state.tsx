import {getTranslations} from "next-intl/server";
import {buttonStyles, Card} from "@/components/ui";
import {Link} from "@/i18n/navigation";

export async function ProjectDetailState({
  kind,
  retryHref,
}: {
  kind: "missing" | "error";
  retryHref?: `/projects/${string}`;
}) {
  const t = await getTranslations(`ProjectDetail.${kind}`);
  const href = kind === "error" && retryHref ? retryHref : "/projects";

  return (
    <Card className="data-grid my-12 p-8 text-center sm:my-16 sm:p-10">
      <div className="relative mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-strong">{t("eyebrow")}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
        <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{t("description")}</p>
        <Link href={href} className={buttonStyles({variant: "secondary", className: "mt-6"})}>
          {t("action")}
        </Link>
      </div>
    </Card>
  );
}
