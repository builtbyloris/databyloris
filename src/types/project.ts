export type ProjectStatus = "draft" | "published" | "archived";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: string;
  featured: boolean;
  status: ProjectStatus;
  publishedAt: string | null;
}
