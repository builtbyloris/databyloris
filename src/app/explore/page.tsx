import { ProjectCatalog } from "@/components/projects/project-catalog";
import { MVP_PROJECTS } from "@/data/projects";

export default function ExplorePage() {
  return (
    <div className="container-dashboard page-frame">
      <header className="max-w-3xl">
        <p className="text-overline">Project catalog</p>
        <h1 className="mt-4">Explore data stories</h1>
        <p className="text-lead mt-5">
          Discover interactive analyses built from real-world datasets.
        </p>
      </header>

      <ProjectCatalog projects={MVP_PROJECTS} />
    </div>
  );
}
