import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GuidedTourStep } from "@/types/onboarding";
import type { RefObject } from "react";
import type { PublicDictionary } from "@/i18n/types";

export interface TourTargetRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

interface TourOverlayProps {
  current: number;
  isMobile: boolean;
  onBack: () => void;
  onFocusTarget: () => void;
  onNext: () => void;
  onSkip: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  step: GuidedTourStep;
  targetRect: TourTargetRect | null;
  total: number;
  strings: PublicDictionary["onboarding"];
}

const SPOTLIGHT_GAP = 8;

export function TourOverlay({
  current,
  isMobile,
  onBack,
  onFocusTarget,
  onNext,
  onSkip,
  panelRef,
  step,
  targetRect,
  total,
  strings,
}: TourOverlayProps) {
  const panelHeight = 280;
  const spaceBelow = targetRect
    ? window.innerHeight - (targetRect.top + targetRect.height)
    : 0;
  const panelStyle =
    !isMobile && targetRect
      ? {
          left: Math.min(
            Math.max(16, targetRect.left),
            window.innerWidth - 400,
          ),
          top:
            spaceBelow >= panelHeight + 24
              ? targetRect.top + targetRect.height + 18
              : Math.max(16, targetRect.top - panelHeight - 18),
        }
      : undefined;

  return (
    <div className="fixed inset-0 z-70 pointer-events-none">
      {targetRect ? (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-x-0 top-0 bg-page-background/70"
            style={{ height: Math.max(0, targetRect.top - SPOTLIGHT_GAP) }}
          />
          <div
            aria-hidden="true"
            className="fixed left-0 bg-page-background/70"
            style={{
              height: targetRect.height + SPOTLIGHT_GAP * 2,
              top: Math.max(0, targetRect.top - SPOTLIGHT_GAP),
              width: Math.max(0, targetRect.left - SPOTLIGHT_GAP),
            }}
          />
          <div
            aria-hidden="true"
            className="fixed right-0 bg-page-background/70"
            style={{
              height: targetRect.height + SPOTLIGHT_GAP * 2,
              left: targetRect.left + targetRect.width + SPOTLIGHT_GAP,
              top: Math.max(0, targetRect.top - SPOTLIGHT_GAP),
            }}
          />
          <div
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 bg-page-background/70"
            style={{
              top: targetRect.top + targetRect.height + SPOTLIGHT_GAP,
            }}
          />
          <div
            aria-hidden="true"
            className="fixed rounded-card border-2 border-accent shadow-elevated"
            style={{
              height: targetRect.height + SPOTLIGHT_GAP * 2,
              left: targetRect.left - SPOTLIGHT_GAP,
              top: targetRect.top - SPOTLIGHT_GAP,
              width: targetRect.width + SPOTLIGHT_GAP * 2,
            }}
          />
        </>
      ) : (
        <div aria-hidden="true" className="fixed inset-0 bg-page-background/70" />
      )}

      <div
        aria-describedby="guided-tour-step-description"
        aria-labelledby="guided-tour-step-title"
        aria-modal="false"
        className="pointer-events-auto fixed inset-x-4 bottom-4 max-h-[calc(100dvh-2rem)] overflow-y-auto md:inset-x-auto md:bottom-auto md:w-96"
        ref={panelRef}
        role="dialog"
        style={panelStyle}
        tabIndex={-1}
      >
        <Card className="p-5 shadow-elevated" surface="elevated">
          <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs font-semibold tracking-wider text-accent">
            {current + 1} {strings.stepOf} {total}
          </p>
          <Button onClick={onSkip} size="sm" variant="ghost">
            {strings.skip}
          </Button>
          </div>
          <h2 className="mt-3 text-xl" id="guided-tour-step-title">
            {step.title}
          </h2>
          <p
            className="mt-3 text-sm leading-6 text-text-secondary"
            id="guided-tour-step-description"
          >
            {step.description}
          </p>

          {step.completion ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {strings.instruction}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <Button
              disabled={current === 0}
              onClick={onBack}
              size="sm"
              variant="ghost"
            >
              {strings.back}
            </Button>
            {step.completion ? (
              <Button onClick={onFocusTarget} size="sm" variant="secondary">
                {step.targetActionLabel ?? strings.focus}
              </Button>
            ) : (
              <Button onClick={onNext} size="sm">
                {strings.next}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
