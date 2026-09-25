import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TourPromptProps {
  description: string;
  meta?: string;
  onDismiss: () => void;
  onPrimaryAction: () => void;
  primaryLabel: string;
  secondaryLabel?: string | null;
  title: string;
}

export function TourPrompt({
  description,
  meta,
  onDismiss,
  onPrimaryAction,
  primaryLabel,
  secondaryLabel = "Explore on my own",
  title,
}: TourPromptProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-80 sm:left-auto sm:right-6 sm:w-[25rem]">
      <Card
        aria-describedby="guided-tour-prompt-description"
        aria-labelledby="guided-tour-prompt-title"
        aria-modal="false"
        className="p-5 shadow-elevated sm:p-6"
        role="dialog"
        surface="elevated"
      >
        {meta ? <p className="text-overline">{meta}</p> : null}
        <h2 className="mt-2 text-xl" id="guided-tour-prompt-title">
          {title}
        </h2>
        <p
          className="mt-3 text-sm leading-6 text-text-secondary"
          id="guided-tour-prompt-description"
        >
          {description}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {secondaryLabel ? (
            <Button onClick={onDismiss} variant="ghost">
              {secondaryLabel}
            </Button>
          ) : null}
          <Button autoFocus onClick={onPrimaryAction}>{primaryLabel}</Button>
        </div>
      </Card>
    </div>
  );
}
