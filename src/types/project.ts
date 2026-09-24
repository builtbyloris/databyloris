export type ProjectCategory =
  | "Music"
  | "Entertainment"
  | "Gaming"
  | "Travel"
  | "Business";

export type ProjectCoverType =
  | "listening"
  | "catalog"
  | "market"
  | "geography"
  | "economy";

export type ProjectStatus = "draft" | "published" | "upcoming";

export interface ProjectSummary {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  question: string;
  coverType: ProjectCoverType;
  period: string;
  tags: string[];
  featured: boolean;
  demo: boolean;
  status: ProjectStatus;
  href?: string;
}
