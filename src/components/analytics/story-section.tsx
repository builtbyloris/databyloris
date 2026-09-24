import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { InsightStoryData } from "@/types/analytics";

interface StorySectionProps {
  children: ReactNode;
  index: number;
  story: InsightStoryData;
  total: number;
}

function StoryCopy({ index, story, total }: Omit<StorySectionProps, "children">) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs font-semibold tracking-wider text-accent">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <Badge>Illustrative story</Badge>
      </div>
      <p className="text-overline mt-5">{story.label}</p>
      <h3 className="mt-3 text-2xl sm:text-3xl" id={`${story.id}-title`}>
        {story.question}
      </h3>
      <p className="mt-5 leading-7 text-text-secondary">{story.explanation}</p>

      <div className="mt-6 border-l-2 border-accent pl-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Takeaway
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-text-primary">
          {story.takeaway}
        </p>
      </div>

      <ButtonLink
        aria-label={`Explore this insight: ${story.question}`}
        className="mt-7"
        href={story.ctaHref}
        variant="secondary"
      >
        Explore this insight
        <span aria-hidden="true">→</span>
      </ButtonLink>
    </div>
  );
}

export function StorySection({ children, index, story, total }: StorySectionProps) {
  if (story.layout === "full") {
    return (
      <article aria-labelledby={`${story.id}-title`} className="border-t border-border py-14 sm:py-20">
        <div className="max-w-2xl">
          <StoryCopy index={index} story={story} total={total} />
        </div>
        <div className="mt-8">{children}</div>
      </article>
    );
  }

  const copyOrder = story.layout === "text-right" ? "lg:order-2" : "";
  const visualOrder = story.layout === "text-right" ? "lg:order-1" : "";

  return (
    <article
      aria-labelledby={`${story.id}-title`}
      className="grid items-center gap-8 border-t border-border py-14 sm:py-20 lg:grid-cols-12 lg:gap-10"
    >
      <div className={`lg:col-span-5 ${copyOrder}`}>
        <StoryCopy index={index} story={story} total={total} />
      </div>
      <div className={`lg:col-span-7 ${visualOrder}`}>{children}</div>
    </article>
  );
}
