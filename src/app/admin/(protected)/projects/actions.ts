"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AdminProjectError,
  createAdminProject,
  deleteAdminProject,
  updateAdminProject,
} from "@/lib/projects/admin-projects";
import { validateProjectForm } from "@/lib/projects/project-validation";
import type {
  DeleteProjectState,
  ProjectFormState,
} from "@/types/project-database";

function actionError(error: unknown): ProjectFormState {
  if (error instanceof AdminProjectError) {
    if (error.code === "duplicate_slug") {
      return { error: error.message, fieldErrors: { slug: error.message } };
    }

    if (error.code === "unauthorized") {
      return {
        error: "Your Admin session has expired. Sign in and try again.",
        fieldErrors: {},
      };
    }
  }

  return {
    error: "The project could not be saved. Please try again.",
    fieldErrors: {},
  };
}

export async function createProjectAction(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const result = validateProjectForm(formData);
  if (!result.success) return result.state;

  let projectId: string;

  try {
    const project = await createAdminProject(result.data);
    projectId = project.id;
  } catch (error) {
    return actionError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${projectId}/edit?saved=created`);
}

export async function updateProjectAction(
  id: string,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const result = validateProjectForm(formData);
  if (!result.success) return result.state;

  try {
    await updateAdminProject(id, result.data);
  } catch (error) {
    return actionError(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  redirect(`/admin/projects/${id}/edit?saved=updated`);
}

export async function deleteProjectAction(
  id: string,
  previousState: DeleteProjectState,
): Promise<DeleteProjectState> {
  void previousState;

  try {
    await deleteAdminProject(id);
  } catch (error) {
    if (error instanceof AdminProjectError && error.code === "unauthorized") {
      return { error: "Your Admin session has expired. Sign in and try again." };
    }

    return { error: "The project could not be deleted. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}
