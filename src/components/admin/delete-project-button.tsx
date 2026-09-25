"use client";

import { useActionState } from "react";

import { deleteProjectAction } from "@/app/admin/(protected)/projects/actions";
import { Button } from "@/components/ui/button";
import type { DeleteProjectState } from "@/types/project-database";

const initialState: DeleteProjectState = { error: null };

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const action = deleteProjectAction.bind(null, id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="space-y-2 sm:text-right">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
            event.preventDefault();
          }
        }}
      >
        <Button disabled={pending} type="submit" variant="danger">
          {pending ? "Deleting…" : "Delete project"}
        </Button>
      </form>
      {state.error ? (
        <p className="max-w-xs text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
