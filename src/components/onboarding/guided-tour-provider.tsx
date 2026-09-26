"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { TourOverlay, type TourTargetRect } from "@/components/onboarding/tour-overlay";
import { TourPrompt } from "@/components/onboarding/tour-prompt";
import { Button } from "@/components/ui/button";
import type { GuidedTourStep } from "@/types/onboarding";
import type { PublicDictionary } from "@/i18n/types";

type TourPhase = "initializing" | "prompt" | "active" | "complete" | "idle";
type TourPreference = "active" | "completed" | "skipped";

interface GuidedTourProviderProps {
  children: ReactNode;
  enabled: boolean;
  sessionKey: string;
  steps: readonly GuidedTourStep[];
  storageKey: string;
  strings: PublicDictionary["onboarding"];
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The tour remains usable for the current page when storage is unavailable.
  }
}

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Session progress is an enhancement; the active tour can continue without it.
  }
}

function visibleTarget(selector: string) {
  return [...document.querySelectorAll<HTMLElement>(selector)].find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  });
}

function revealAndFindTarget(selector: string) {
  const visible = visibleTarget(selector);
  if (visible) return visible;

  const candidate = document.querySelector<HTMLElement>(selector);
  const disclosure = candidate?.closest("details");
  if (disclosure && !disclosure.open) {
    disclosure.open = true;
    return visibleTarget(selector);
  }

  return undefined;
}

export function GuidedTourProvider({
  children,
  enabled,
  sessionKey,
  steps,
  storageKey,
  strings,
}: GuidedTourProviderProps) {
  const [phase, setPhase] = useState<TourPhase>("initializing");
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TourTargetRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const filterBaselineRef = useRef<string | null>(null);

  const restoreFocus = useCallback(() => {
    requestAnimationFrame(() => {
      const target = returnFocusRef.current?.isConnected
        ? returnFocusRef.current
        : document.getElementById("main-content");
      target?.focus();
    });
  }, []);

  const savePreference = useCallback(
    (preference: TourPreference) => writeStorage(storageKey, preference),
    [storageKey],
  );

  const endTour = useCallback(
    (preference: "completed" | "skipped") => {
      savePreference(preference);
      writeSession(sessionKey, null);
      setPhase(preference === "completed" ? "complete" : "idle");
      setTargetRect(null);
      if (preference === "skipped") restoreFocus();
    },
    [restoreFocus, savePreference, sessionKey],
  );

  const goToStep = useCallback(
    (nextIndex: number) => {
      const boundedIndex = Math.min(Math.max(nextIndex, 0), steps.length - 1);
      setStepIndex(boundedIndex);
      writeSession(sessionKey, String(boundedIndex));
    },
    [sessionKey, steps.length],
  );

  const startTour = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    savePreference("active");
    setStepIndex(0);
    writeSession(sessionKey, "0");
    setPhase("active");
  }, [savePreference, sessionKey]);

  const finishCompletion = useCallback(() => {
    setPhase("idle");
    restoreFocus();
  }, [restoreFocus]);

  useEffect(() => {
    const initializationFrame = requestAnimationFrame(() => {
      if (!enabled) {
        setPhase("idle");
        return;
      }

      const preference = readStorage(storageKey) as TourPreference | null;
      if (preference === "active") {
        const progress = readSession(sessionKey);
        const awaitingMatch = progress?.match(/^awaiting:(\d+)$/);
        const awaitedIndex = awaitingMatch ? Number(awaitingMatch[1]) : null;
        const parsedIndex = awaitedIndex !== null
          ? window.location.hash.startsWith("#dashboard-")
            ? awaitedIndex
            : Math.max(0, awaitedIndex - 1)
          : Number(progress ?? 0);
        const restoredIndex = Number.isFinite(parsedIndex)
          ? Math.min(Math.max(parsedIndex, 0), steps.length - 1)
          : 0;
        setStepIndex(restoredIndex);
        setPhase("active");
        writeSession(sessionKey, String(restoredIndex));
        return;
      }

      setPhase(preference ? "idle" : "prompt");
    });

    return () => cancelAnimationFrame(initializationFrame);
  }, [enabled, sessionKey, steps.length, storageKey]);

  useEffect(() => {
    if (phase !== "active") return;

    const step = steps[stepIndex];
    const target = revealAndFindTarget(step.targetSelector);
    if (!target) {
      const missingTargetFrame = requestAnimationFrame(() => setTargetRect(null));
      return () => cancelAnimationFrame(missingTargetFrame);
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });

    function updateTargetRect() {
      const currentTarget = revealAndFindTarget(step.targetSelector);
      if (!currentTarget) {
        setTargetRect(null);
        return;
      }
      const rect = currentTarget.getBoundingClientRect();
      setTargetRect({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      });
      setIsMobile(window.innerWidth < 768);
    }

    updateTargetRect();
    const settleTimer = window.setTimeout(updateTargetRect, reducedMotion ? 0 : 400);
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);
    requestAnimationFrame(() => panelRef.current?.focus());

    if (step.completion?.type === "change") {
      filterBaselineRef.current = (target as HTMLSelectElement).value;
    }

    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [phase, stepIndex, steps]);

  useEffect(() => {
    if (phase !== "active") return;

    const step = steps[stepIndex];
    const completion = step.completion;
    if (!completion) return;

    if (completion.type === "navigation") {
      const navigationCompletion = completion;
      let waitTimer: number | undefined;
      let waitAttempts = 0;

      function handleNavigationTrigger(event: MouseEvent) {
        if (
          event.button !== 0 ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey
        ) {
          return;
        }

        const trigger = (event.target as Element | null)?.closest<HTMLElement>(
          navigationCompletion.triggerSelector,
        );
        if (!trigger) return;

        const destinationHref =
          trigger instanceof HTMLAnchorElement ? trigger.href : null;
        writeSession(sessionKey, `awaiting:${stepIndex + 1}`);

        function waitForDestination() {
          waitAttempts += 1;
          const destinationReady = visibleTarget(
            navigationCompletion.destinationSelector,
          );
          const urlReady = destinationHref
            ? window.location.href === destinationHref
            : window.location.hash.startsWith("#dashboard-");

          if (destinationReady && urlReady) {
            goToStep(stepIndex + 1);
            return;
          }
          if (waitAttempts >= 100) {
            writeSession(sessionKey, String(stepIndex));
            return;
          }
          waitTimer = window.setTimeout(waitForDestination, 50);
        }

        waitTimer = window.setTimeout(waitForDestination, 0);
      }

      document.addEventListener("click", handleNavigationTrigger, true);
      return () => {
        document.removeEventListener("click", handleNavigationTrigger, true);
        if (waitTimer) window.clearTimeout(waitTimer);
      };
    }

    if (completion.type === "change") {
      const changeCompletion = completion;
      function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement | null;
        if (!target?.matches(changeCompletion.selector)) return;
        if (target.value === filterBaselineRef.current) return;
        goToStep(stepIndex + 1);
      }

      document.addEventListener("change", handleChange, true);
      return () => document.removeEventListener("change", handleChange, true);
    }

    function handleCustomEvent() {
      endTour("completed");
    }

    window.addEventListener(completion.eventName, handleCustomEvent);
    return () =>
      window.removeEventListener(completion.eventName, handleCustomEvent);
  }, [endTour, goToStep, phase, sessionKey, stepIndex, steps]);

  useEffect(() => {
    if (phase === "initializing" || phase === "idle") return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (phase === "complete") finishCompletion();
      else endTour("skipped");
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [endTour, finishCompletion, phase]);

  function focusCurrentTarget() {
    const target = revealAndFindTarget(steps[stepIndex].targetSelector);
    if (!target) return;

    const interactiveTarget = target.matches("a, button, select, [tabindex='0']")
      ? target
      : target.querySelector<HTMLElement>(
          "[data-dashboard-interaction], a, button, select, [tabindex='0']",
        );
    (interactiveTarget ?? target).focus();
  }

  return (
    <>
      {children}

      {enabled && phase === "prompt" ? (
        <TourPrompt
          description={strings.promptDescription}
          meta={strings.promptMeta}
          onDismiss={() => endTour("skipped")}
          onPrimaryAction={startTour}
          primaryLabel={strings.start}
          secondaryLabel={strings.dismiss}
          title={strings.promptTitle}
        />
      ) : null}

      {enabled && phase === "active" ? (
        <TourOverlay
          current={stepIndex}
          isMobile={isMobile}
          onBack={() => goToStep(stepIndex - 1)}
          onFocusTarget={focusCurrentTarget}
          onNext={() => goToStep(stepIndex + 1)}
          onSkip={() => endTour("skipped")}
          panelRef={panelRef}
          step={steps[stepIndex]}
          strings={strings}
          targetRect={targetRect}
          total={steps.length}
        />
      ) : null}

      {enabled && phase === "complete" ? (
        <TourPrompt
          autoFocusPrimary
          description={strings.completeDescription}
          onDismiss={finishCompletion}
          onPrimaryAction={finishCompletion}
          primaryLabel={strings.exploreFreely}
          secondaryLabel={null}
          title={strings.completeTitle}
        />
      ) : null}

      {enabled && phase === "idle" ? (
        <div className="fixed bottom-4 right-4 z-40">
          <Button onClick={startTour} size="sm" variant="secondary">
            {strings.guidedTour}
          </Button>
        </div>
      ) : null}
    </>
  );
}
