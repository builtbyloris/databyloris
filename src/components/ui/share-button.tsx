"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {buttonStyles} from "./button";

type ShareContext = "caseStudy" | "datasetExplorer" | "dashboard" | "compare";

export function ShareButton({projectTitle, context}: {projectTitle: string; context: ShareContext}) {
  const t = useTranslations("Share");
  const [feedback, setFeedback] = useState<"copied" | "error" | null>(null);
  const contextLabel = t(`contexts.${context}`);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const share = async () => {
    setFeedback(null);
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({title: t("title", {project: projectTitle, context: contextLabel}), url});
        return;
      }
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setFeedback("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedback("error");
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={share}
        aria-label={t("ariaLabel", {project: projectTitle, context: contextLabel})}
        className={buttonStyles({variant: "secondary", size: "sm", className: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"})}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="size-4">
          <path d="M10 13V2m0 0L6.5 5.5M10 2l3.5 3.5M4 11.5v4A2.5 2.5 0 0 0 6.5 18h7a2.5 2.5 0 0 0 2.5-2.5v-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t("action")}
      </button>
      {feedback ? (
        <span role={feedback === "error" ? "alert" : "status"} className="text-sm text-muted">
          {t(feedback)}
        </span>
      ) : null}
    </div>
  );
}
