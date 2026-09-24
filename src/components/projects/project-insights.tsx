import { GrowthVisualization } from "@/components/analytics/growth-visualization";
import { LifecycleVisualization } from "@/components/analytics/lifecycle-visualization";
import { MarketComparison } from "@/components/analytics/market-comparison";
import { RankingVisualization } from "@/components/analytics/ranking-visualization";
import { StorySection } from "@/components/analytics/story-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { StoryVisualizationData } from "@/types/analytics";
import type { ProjectDetail } from "@/types/project";

interface ProjectInsightsProps {
  project: ProjectDetail;
}

function StoryVisualization({ data }: { data: StoryVisualizationData }) {
  switch (data.type) {
    case "ranking":
      return <RankingVisualization data={data} />;
    case "growth":
      return <GrowthVisualization data={data} />;
    case "market-comparison":
      return <MarketComparison data={data} />;
    case "lifecycle":
      return <LifecycleVisualization data={data} />;
  }
}

export function ProjectInsights({ project }: ProjectInsightsProps) {
  const { insights } = project;

  return (
    <section
      aria-labelledby="insights-title"
      className="scroll-mt-32 border-b border-border py-14 sm:py-20"
      id="insights"
    >
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-overline">Insights</p>
          <Badge variant="warning">Illustrative demo stories</Badge>
        </div>
        <h2 className="mt-3" id="insights-title">
          Four questions behind the listening story
        </h2>
        <p className="mt-5 text-lg leading-8 text-text-secondary">
          {insights.introduction}
        </p>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          {insights.disclaimer}
        </p>
      </div>

      <div className="mt-10">
        {insights.stories.map((story, index) => (
          <StorySection
            index={index}
            key={story.id}
            story={story}
            total={insights.stories.length}
          >
            <StoryVisualization data={story.visualization} />
          </StorySection>
        ))}
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6" surface="secondary">
        <Badge className="self-start" variant="accent">
          Did you know?
        </Badge>
        <div>
          <h3 className="text-lg">{insights.curiosity.title}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {insights.curiosity.text}
          </p>
        </div>
      </Card>
    </section>
  );
}
