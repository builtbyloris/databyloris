import {FeaturedProjects} from "@/components/home/featured-projects";
import {Hero} from "@/components/home/hero";
import {HomeCta} from "@/components/home/home-cta";
import {HowItWorks} from "@/components/home/how-it-works";
import {StatsStrip} from "@/components/home/stats-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedProjects />
      <HowItWorks />
      <HomeCta />
    </>
  );
}
