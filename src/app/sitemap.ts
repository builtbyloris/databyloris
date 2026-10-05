import type {MetadataRoute} from "next";
import {routing, type AppLocale} from "@/i18n/routing";
import {
  getAbsoluteUrl,
  getLocalizedAlternates,
  getSiteUrl,
} from "@/lib/seo";
import {listPublishedProjects} from "@/lib/repositories/projects-repository";

const staticRoutes = [
  {pathname: "", changeFrequency: "weekly", priority: 1},
  {pathname: "/projects", changeFrequency: "weekly", priority: 0.9},
  {pathname: "/playground", changeFrequency: "monthly", priority: 0.8},
  {pathname: "/recruiter", changeFrequency: "monthly", priority: 0.7},
] as const;

function localizedSitemapEntry(
  locale: AppLocale,
  pathname: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority" | "lastModified">,
): MetadataRoute.Sitemap[number] {
  const siteUrl = getSiteUrl();
  const languagePaths = getLocalizedAlternates(pathname);

  return {
    url: getAbsoluteUrl(locale, pathname),
    alternates: {
      languages: {
        it: new URL(languagePaths.it, siteUrl).toString(),
        en: new URL(languagePaths.en, siteUrl).toString(),
      },
    },
    ...options,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await listPublishedProjects("it");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push(localizedSitemapEntry(locale, route.pathname, route));
    }

    for (const project of projects) {
      const projectPath = `/projects/${project.slug}`;
      const lastModified = project.publishedAt ?? undefined;
      entries.push(localizedSitemapEntry(locale, projectPath, {
        changeFrequency: "monthly",
        priority: 0.8,
        lastModified,
      }));

      if (project.dashboardAvailable) {
        entries.push(localizedSitemapEntry(locale, `${projectPath}/dashboard`, {
          changeFrequency: "monthly",
          priority: 0.7,
          lastModified,
        }));
      }
    }
  }

  return entries;
}
