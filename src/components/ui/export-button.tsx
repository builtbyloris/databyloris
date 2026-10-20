"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {buttonStyles} from "./button";

export function ExportButton({href, fileName}: {href: string; fileName: string}) {
  const t = useTranslations("Export");
  const [status, setStatus] = useState<"idle" | "preparing" | "ready" | "limit" | "error">("idle");

  async function download() {
    setStatus("preparing");
    try {
      const response = await fetch(href, {cache: "no-store"});
      if (response.status === 413) {
        setStatus("limit");
        return;
      }
      if (!response.ok || !response.headers.get("content-type")?.includes("text/csv")) throw new Error("Export failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <button type="button" onClick={download} disabled={status === "preparing"} className={buttonStyles({variant: "secondary", size: "sm", className: "min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"})}>
        {t("action")}
      </button>
      {status !== "idle" ? <span role={status === "error" || status === "limit" ? "alert" : "status"} className="text-sm text-muted">
        {t(status)}
      </span> : null}
    </div>
  );
}
