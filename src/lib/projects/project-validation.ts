import type {
  ProjectClassification,
  ProjectFormField,
  ProjectFormState,
  ProjectWriteInput,
  StoredProjectStatus,
} from "@/types/project-database";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const limits: Partial<Record<ProjectFormField, number>> = {
  title: 120,
  slug: 100,
  subtitle: 240,
  description: 2_000,
  category: 80,
  question: 300,
  period: 100,
  datasetRecords: 120,
  datasetGrain: 240,
  datasetSource: 500,
};

function readString(formData: FormData, name: ProjectFormField) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optional(value: string) {
  return value || null;
}

export function validateProjectForm(formData: FormData):
  | { success: true; data: ProjectWriteInput }
  | { success: false; state: ProjectFormState } {
  const values = {
    title: readString(formData, "title"),
    slug: readString(formData, "slug").toLowerCase(),
    subtitle: readString(formData, "subtitle"),
    description: readString(formData, "description"),
    category: readString(formData, "category"),
    question: readString(formData, "question"),
    period: readString(formData, "period"),
    tags: readString(formData, "tags"),
    datasetRecords: readString(formData, "datasetRecords"),
    datasetGrain: readString(formData, "datasetGrain"),
    datasetSource: readString(formData, "datasetSource"),
    projectType: readString(formData, "projectType"),
    status: readString(formData, "status"),
  };
  const fieldErrors: ProjectFormState["fieldErrors"] = {};

  for (const field of ["title", "slug", "description", "category"] as const) {
    if (!values[field]) {
      fieldErrors[field] = "This field is required.";
    }
  }

  if (values.slug && !slugPattern.test(values.slug)) {
    fieldErrors.slug =
      "Use lowercase letters, numbers, and single hyphens only.";
  }

  for (const [field, limit] of Object.entries(limits) as [
    keyof typeof limits,
    number,
  ][]) {
    if (values[field].length > limit) {
      fieldErrors[field] = `Use ${limit} characters or fewer.`;
    }
  }

  if (values.status !== "draft" && values.status !== "published") {
    fieldErrors.status = "Choose Draft or Published.";
  }

  if (values.projectType !== "project" && values.projectType !== "demo") {
    fieldErrors.projectType = "Choose Project or Demo.";
  }

  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag, index, items) => items.indexOf(tag) === index);

  if (tags.length > 12 || tags.some((tag) => tag.length > 40)) {
    fieldErrors.tags = "Use up to 12 tags, with 40 characters or fewer each.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: { error: "Review the highlighted fields.", fieldErrors },
    };
  }

  return {
    success: true,
    data: {
      title: values.title,
      slug: values.slug,
      subtitle: optional(values.subtitle),
      description: values.description,
      category: values.category,
      question: optional(values.question),
      period: optional(values.period),
      tags,
      dataset_records: optional(values.datasetRecords),
      dataset_grain: optional(values.datasetGrain),
      dataset_source: optional(values.datasetSource),
      featured: formData.get("featured") === "on",
      demo: (values.projectType as ProjectClassification) === "demo",
      status: values.status as StoredProjectStatus,
    },
  };
}
