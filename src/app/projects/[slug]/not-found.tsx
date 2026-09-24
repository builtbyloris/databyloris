import { ButtonLink } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="container-story page-frame">
      <p className="text-overline">Project unavailable</p>
      <h1 className="mt-4">This data story could not be found.</h1>
      <p className="text-lead mt-5 max-w-2xl">
        The project may not exist or may not be published yet. Explore the current catalog
        to find an available data story.
      </p>
      <div className="mt-8">
        <ButtonLink href="/explore" size="lg">
          Explore projects
          <span aria-hidden="true">→</span>
        </ButtonLink>
      </div>
    </div>
  );
}
