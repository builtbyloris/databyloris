import type {Metadata} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {Footer} from "@/components/layout/footer";
import {Navbar} from "@/components/layout/navbar";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {routing} from "@/i18n/routing";
import {getSiteUrl} from "@/lib/seo";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Metadata"});

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: t("title"),
      template: "%s — databyloris",
    },
    description: t("description"),
    applicationName: "databyloris",
  };
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("Common");

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <a
              href="#main-content"
              className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-control bg-foreground px-4 py-2 text-sm font-semibold text-background focus:translate-y-0"
            >
              {t("skipToContent")}
            </a>
            <div className="page-aurora flex min-h-screen flex-col">
              <Navbar />
              <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
