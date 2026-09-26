import type englishDictionary from "./dictionaries/en";
import type { ProjectInsightsData, ProjectOverviewData } from "@/types/analytics";
import type { GuidedTourStep } from "@/types/onboarding";
import type { ProjectMethodologyData } from "@/types/project";

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly DeepWiden<Item>[]
    : T extends object
      ? { [Key in keyof T]: DeepWiden<T[Key]> }
      : T;

type DictionaryBase = DeepWiden<Omit<typeof englishDictionary, "spotify">>;

export type PublicDictionary = DictionaryBase & {
  spotify: {
    dataset: DeepWiden<typeof englishDictionary.spotify.dataset>;
    overview: ProjectOverviewData;
    insights: ProjectInsightsData;
    methodology: ProjectMethodologyData;
    tourSteps: readonly GuidedTourStep[];
  };
};
