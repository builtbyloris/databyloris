import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import {AdminLoginForm} from "@/components/admin/auth/admin-login-form";
import {Card, Container} from "@/components/ui";
import {Link} from "@/i18n/navigation";
import type {AppLocale} from "@/i18n/routing";
import {adminPath, checkAdmin} from "@/lib/auth/require-admin";

interface AdminLoginPageProps {
  params: Promise<{locale: AppLocale}>;
  searchParams: Promise<{error?: string | string[]}>;
}

export async function generateMetadata({params}: Pick<AdminLoginPageProps, "params">): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "AdminAuth"});
  return {title: t("title"), description: t("description")};
}

export default async function AdminLoginPage({params, searchParams}: AdminLoginPageProps) {
  const [{locale}, query, adminCheck] = await Promise.all([
    params,
    searchParams,
    checkAdmin(),
  ]);

  if (adminCheck.status === "admin") redirect(adminPath(locale));

  const t = await getTranslations({locale, namespace: "AdminAuth"});
  const initialError = query.error === "access-denied" || adminCheck.status === "forbidden"
    ? "access-denied"
    : query.error === "unexpected" || adminCheck.status === "error"
      ? "unexpected"
      : undefined;

  return (
    <section className="relative grid min-h-[calc(100vh-9rem)] place-items-center overflow-hidden py-12 sm:py-16">
      <div className="data-grid pointer-events-none absolute inset-0 opacity-70" />
      <Container className="relative w-full">
        <Card className="mx-auto max-w-md p-7 sm:p-9">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label={t("backHome")}>
            <span className="brand-gradient grid size-9 place-items-center rounded-[0.7rem] shadow-soft">
              <span className="size-2 rounded-full bg-white" />
            </span>
            <span className="text-sm font-extrabold tracking-[-0.02em]">
              data<span className="text-primary">by</span>loris
            </span>
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-primary-strong">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">{t("description")}</p>

          <AdminLoginForm locale={locale} initialError={initialError} />

          <Link
            href="/"
            className="mt-7 inline-flex text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            ← {t("backHome")}
          </Link>
        </Card>
      </Container>
    </section>
  );
}
