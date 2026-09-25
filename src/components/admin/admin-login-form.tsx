"use client";

import { useActionState, useEffect, useRef } from "react";

import { signIn } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = { error: null };

const inputClassName =
  "min-h-11 w-full rounded-control border border-control-border bg-surface-primary px-3.5 text-base text-text-primary shadow-none outline-none placeholder:text-text-muted hover:border-accent/60 focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminLoginForm({ disabled = false }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state.error]);

  return (
    <form action={formAction} aria-busy={pending} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary" htmlFor="email">
          Email <span className="font-normal text-text-muted">(required)</span>
        </label>
        <input
          aria-describedby={state.error ? "login-error" : undefined}
          aria-invalid={Boolean(state.error)}
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
          Password <span className="font-normal text-text-muted">(required)</span>
        </label>
        <input
          aria-describedby={state.error ? "login-error" : undefined}
          aria-invalid={Boolean(state.error)}
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
          className="rounded-control border border-danger/25 bg-danger-subtle px-3.5 py-3 text-sm text-danger"
          id="login-error"
          ref={errorRef}
          role="alert"
          tabIndex={-1}
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
