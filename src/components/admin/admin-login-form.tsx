"use client";

import { useActionState } from "react";

import { signIn } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = { error: null };

const inputClassName =
  "min-h-11 w-full rounded-control border border-border bg-surface-primary px-3.5 text-base text-text-primary shadow-none outline-none placeholder:text-text-muted hover:border-accent/60 focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminLoginForm({ disabled = false }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          disabled={disabled || pending}
          id="email"
          inputMode="email"
          name="email"
          placeholder="admin@example.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="current-password"
          className={inputClassName}
          disabled={disabled || pending}
          id="password"
          name="password"
          required
          type="password"
        />
      </div>

      {state.error ? (
        <p
          aria-live="polite"
          className="rounded-control border border-danger/25 bg-danger-subtle px-3.5 py-3 text-sm text-danger"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        className="w-full"
        disabled={disabled || pending}
        size="lg"
        type="submit"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
