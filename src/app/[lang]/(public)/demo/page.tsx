import { notFound, redirect } from "next/navigation";

import { isLocale, localizePath } from "@/i18n/config";
import { SPOTIFY_PROJECT_PATH } from "@/lib/projects/project-identifiers";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  redirect(localizePath(lang, SPOTIFY_PROJECT_PATH));
}
