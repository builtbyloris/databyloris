import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <PublicShell dictionary={dictionary} locale={lang}>
      {children}
    </PublicShell>
  );
}
