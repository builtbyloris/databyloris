"use client";

import {useTranslations} from "next-intl";
import {buttonStyles} from "@/components/ui";

const stepIds = ["kpis", "filters", "charts", "ranking"] as const;

export function PlaygroundTutorial({step, onBack, onNext, onExit, onRestart, onViewSection}: {
  step: number | null;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
  onRestart: () => void;
  onViewSection: () => void;
}) {
  const t = useTranslations("Playground.tutorial");
  const isExploring = step === null;
  const currentId = isExploring ? null : stepIds[step];

  return (
    <aside aria-label={t("guideLabel")} className="rounded-card border border-border bg-card p-5 sm:p-6">
      {isExploring ? (
        <div aria-live="polite">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{t("explore.badge")}</span>
          <h2 className="mt-3 text-lg font-bold tracking-tight">{t("explore.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t("explore.description")}</p>
          <button type="button" onClick={onRestart} className={buttonStyles({variant: "secondary", size: "sm", className: "mt-5 w-full"})}>{t("restart")}</button>
        </div>
      ) : (
        <div aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">{t("counter", {current: step + 1, total: stepIds.length})}</p>
            <ol className="flex gap-1.5" aria-label={t("progressLabel")}>
              {stepIds.map((id, index) => (
                <li key={id} aria-current={index === step ? "step" : undefined}>
                  <span className={`block h-1.5 rounded-full transition-all ${index === step ? "w-7 bg-primary" : "w-3 bg-border"}`}>
                    <span className="sr-only">{t("stepLabel", {step: index + 1})}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t(`steps.${currentId}.area`)}</p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">{t(`steps.${currentId}.title`)}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t(`steps.${currentId}.description`)}</p>
          <button type="button" onClick={onViewSection} className={buttonStyles({variant: "secondary", size: "sm", className: "mt-4 w-full xl:hidden"})}>{t("viewSection")}</button>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted">{t("filterIndependence")}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onBack} disabled={step === 0} className={buttonStyles({variant: "secondary", size: "sm", className: "w-full"})}>{t("back")}</button>
            <button type="button" onClick={onNext} className={buttonStyles({size: "sm", className: "w-full"})}>{step === stepIds.length - 1 ? t("finish") : t("next")}</button>
          </div>
          <button type="button" onClick={onExit} className="mt-2 w-full rounded-control px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">{t("exit")}</button>
          {step > 0 ? <button type="button" onClick={onRestart} className="mt-1 w-full px-3 py-2 text-xs font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline">{t("restart")}</button> : null}
        </div>
      )}
    </aside>
  );
}
