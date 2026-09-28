"use client";

import {useActionState} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui";
import type {AppLocale} from "@/i18n/routing";
import {loginAction, type LoginError, type LoginState} from "@/app/[locale]/admin/login/actions";

const initialState: LoginState = {error: null};

export function AdminLoginForm({
  locale,
  initialError,
}: {
  locale: AppLocale;
  initialError?: LoginError;
}) {
  const t = useTranslations("AdminAuth");
  const [state, formAction, pending] = useActionState(loginAction, {
    ...initialState,
    error: initialError ?? null,
  });

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">
          {t("email")}
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={pending}
          className="h-12 w-full rounded-control border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">
          {t("password")}
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className="h-12 w-full rounded-control border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
      </div>

      <div aria-live="polite" className="min-h-6">
        {state.error ? (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            {t(`errors.${state.error}`)}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
