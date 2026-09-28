"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {Button, Card} from "@/components/ui";
import type {DashboardConfig} from "@/types";

export function JsonPreview({config}: {config: DashboardConfig}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(config, null, 2);
  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div><h2 className="font-bold">{t("json.title")}</h2><p className="mt-1 text-xs text-muted">{t("json.description")}</p></div>
        <div className="flex gap-2">
          {open ? <Button size="sm" variant="ghost" onClick={copy}>{copied ? t("json.copied") : t("json.copy")}</Button> : null}
          <Button size="sm" variant="secondary" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? t("json.hide") : t("json.show")}</Button>
        </div>
      </div>
      {open ? <pre className="max-h-[32rem] overflow-auto border-t border-border bg-admin-sidebar p-5 text-xs leading-5 text-cyan"><code>{json}</code></pre> : null}
    </Card>
  );
}
