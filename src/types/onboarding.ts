export type TourCompletionRule =
  | {
      type: "navigation";
      triggerSelector: string;
      destinationSelector: string;
    }
  | {
      type: "change";
      selector: string;
    }
  | {
      type: "event";
      eventName: string;
    };

export interface GuidedTourStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  targetActionLabel?: string;
  completion?: TourCompletionRule;
}
