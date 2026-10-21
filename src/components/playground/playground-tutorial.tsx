"use client";

import {useTranslations} from "next-intl";
import {AnimatePresence, LazyMotion, domAnimation} from "motion/react";
import * as m from "motion/react-m";
import {buttonStyles} from "@/components/ui";
import {useMotionPreference} from "@/lib/use-motion-preference";

const stepIds = ["kpis", "filters", "charts", "ranking"] as const;

export function PlaygroundTutorial({step, onBack, onNext, onExit, onRestart, onViewSection, onSelectStep}: {
  step: number | null;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
  onRestart: () => void;
  onViewSection: () => void;
  onSelectStep: (step: number) => void;
}) {
  const t = useTranslations("Playground.tutorial");
  const isExploring = step === null;
  const currentId = isExploring ? null : stepIds[step];
  const motionEnabled = useMotionPreference() === "full";

  return (
    <aside aria-label={t("guideLabel")} className="document-frame rounded-card p-5 sm:p-6">
      {isExploring ? (
        <div aria-live="polite">
          <span className="site-overline text-muted">{t("explore.badge")}</span>
          <h2 className="font-editorial mt-3 text-2xl">{t("explore.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t("explore.description")}</p>
          <button type="button" onClick={onRestart} className={buttonStyles({variant: "secondary", size: "sm", className: "mt-5 w-full"})}>{t("restart")}</button>
        </div>
      ) : (
        <div aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <p className="site-overline text-primary-strong">{t("counter", {current: step + 1, total: stepIds.length})}</p>
            <ol className="flex gap-0.5" aria-label={t("progressLabel")}>
              {stepIds.map((id, index) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onSelectStep(index)}
                    aria-current={index === step ? "step" : undefined}
                    aria-label={`${t("stepLabel", {step: index + 1})}: ${t(`steps.${id}.title`)}`}
                    className="group flex size-9 items-center justify-center rounded-control transition-colors hover:bg-surface-raised"
                  >
                    <span aria-hidden="true" className={`playground-progress-pill block h-1.5 rounded-full transition-[width,background-color] duration-300 group-hover:bg-primary/60 ${index === step ? "w-7 bg-primary" : "w-3 bg-border"}`} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <LazyMotion features={domAnimation} strict>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={currentId}
                initial={motionEnabled ? {opacity: 0, y: 8} : false}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: motionEnabled ? -8 : 0}}
                transition={{duration: motionEnabled ? 0.22 : 0}}
              >
                <p className="site-overline mt-5 text-muted">{t(`steps.${currentId}.area`)}</p>
                <h2 className="font-editorial mt-2 text-2xl">{t(`steps.${currentId}.title`)}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{t(`steps.${currentId}.description`)}</p>
              </m.div>
            </AnimatePresence>
          </LazyMotion>
          <button type="button" onClick={onViewSection} className={buttonStyles({variant: "secondary", size: "sm", className: "mt-4 w-full xl:hidden"})}>{t("viewSection")}</button>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted">{t("filterIndependence")}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onBack} disabled={step === 0} className="editorial-action editorial-action-secondary editorial-action-compact w-full">
              <span aria-hidden="true" className="editorial-action-icon">←</span> {t("back")}
            </button>
            <button type="button" onClick={onNext} className="editorial-action editorial-action-compact w-full">
              {step === stepIds.length - 1 ? t("finish") : t("next")} <span aria-hidden="true" className="editorial-action-icon">→</span>
            </button>
          </div>
          <button type="button" onClick={onExit} className="mt-2 w-full rounded-control px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-raised hover:text-foreground">{t("exit")}</button>
          {step > 0 ? <button type="button" onClick={onRestart} className="mt-1 w-full px-3 py-2 text-xs font-semibold text-muted underline-offset-4 hover:text-foreground hover:underline">{t("restart")}</button> : null}
        </div>
      )}
    </aside>
  );
}
