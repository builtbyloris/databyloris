import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {RoutePlaceholder} from "@/components/route-placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin");
  return {title: t("title"), description: t("description")};
}

export default async function AdminPage() {
  const t = await getTranslations("Admin");
  return <RoutePlaceholder eyebrow={t("eyebrow")} title={t("title")} description={t("description")} note={t("note")} />;
}
