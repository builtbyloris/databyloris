import type {Metadata} from "next";
import type {AppLocale} from "@/i18n/routing";

export const SITE_NAME = "databyloris";

const LOCAL_SITE_URL = "http://localhost:3000";
const openGraphLocales: Record<AppLocale, string> = {
  it: "it_IT",
  en: "en_US",
};

function parseSiteUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isLocalSiteUrl(url: URL) {
  return url.hostname === "localhost"
    || url.hostname === "127.0.0.1"
    || url.hostname === "[::1]";
}

export function getSiteUrl() {
  const configuredUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const vercelUrl = parseSiteUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
  );

  if (configuredUrl && !(process.env.VERCEL === "1" && isLocalSiteUrl(configuredUrl))) {
    return configuredUrl;
  }
  if (vercelUrl) return vercelUrl;
  if (process.env.VERCEL === "1") {
    throw new Error("A public site URL is required for SEO metadata on Vercel.");
  }

  return new URL(LOCAL_SITE_URL);
}

export function getLocalizedPath(locale: AppLocale, pathname = "") {
  const [pathPart, fragment] = pathname.split("#", 2);
  const normalizedPath = pathPart && pathPart !== "/"
    ? `/${pathPart.replace(/^\/+|\/+$/g, "")}`
    : "";
  const localizedPath = `${locale === "it" ? "" : "/en"}${normalizedPath}` || "/";
  return fragment ? `${localizedPath}#${fragment}` : localizedPath;
}

export function getLocalizedAlternates(pathname = "") {
  return {
    it: getLocalizedPath("it", pathname),
    en: getLocalizedPath("en", pathname),
  };
}

export function getAbsoluteUrl(locale: AppLocale, pathname = "") {
  return new URL(getLocalizedPath(locale, pathname), getSiteUrl()).toString();
}

function withSiteName(title: string) {
  return title.toLocaleLowerCase().includes(SITE_NAME)
    ? title
    : `${title} — ${SITE_NAME}`;
}

function isMetadataImage(value: string | undefined) {
  if (!value) return false;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function createLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  image,
  absoluteTitle = false,
}: {
  locale: AppLocale;
  pathname?: string;
  title: string;
  description: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = getLocalizedPath(locale, pathname);
  const alternates = getLocalizedAlternates(pathname);
  const socialTitle = withSiteName(title);
  const images = isMetadataImage(image) ? [{url: image!, alt: title}] : undefined;

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    alternates: {
      canonical,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: openGraphLocales[locale],
      alternateLocale: [openGraphLocales[locale === "it" ? "en" : "it"]],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
    },
  };
}

export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
