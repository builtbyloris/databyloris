"use server";

import { revalidatePath } from "next/cache";

import {
  ProjectCoverError,
  removeProjectCover,
  uploadProjectCover,
} from "@/lib/projects/project-covers";
import type { ProjectCoverActionState } from "@/types/project-database";

function revalidateCoverSurfaces(projectId: string, slug?: string) {
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  if (slug) revalidatePath(`/projects/${slug}`);
}

function coverActionError(error: unknown): ProjectCoverActionState {
  if (error instanceof ProjectCoverError) {
    if (error.code === "unauthorized") {
      return {
        message: "Your Admin session has expired. Sign in and try again.",
        status: "error",
      };
    }

    if (error.code === "invalid_file" || error.code === "not_found") {
      return { message: error.message, status: "error" };
    }
  }

  return {
    message: "The cover could not be updated. Please try again.",
    status: "error",
  };
}

export async function uploadProjectCoverAction(
  projectId: string,
  _previousState: ProjectCoverActionState,
  formData: FormData,
): Promise<ProjectCoverActionState> {
  void _previousState;

  try {
    const result = await uploadProjectCover(projectId, formData.get("cover"));
    revalidateCoverSurfaces(projectId, result.project.slug);

    if (result.cleanupWarning) {
      return {
        message:
          "Cover updated, but the previous object could not be cleaned up. Review Storage when convenient.",
        status: "warning",
      };
    }

    return { message: "Cover updated.", status: "success" };
  } catch (error) {
    return coverActionError(error);
  }
}

export async function removeProjectCoverAction(
  projectId: string,
  _previousState: ProjectCoverActionState,
): Promise<ProjectCoverActionState> {
  void _previousState;

  try {
    const result = await removeProjectCover(projectId);
    revalidateCoverSurfaces(projectId, result.project.slug);

    if (result.cleanupWarning) {
      return {
        message:
          "Cover removed from the project, but Storage cleanup failed. Review the orphaned object when convenient.",
        status: "warning",
      };
    }

    return { message: "Cover removed.", status: "success" };
  } catch (error) {
    return coverActionError(error);
  }
}
