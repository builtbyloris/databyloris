"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import type { PublicDictionary } from "@/i18n/types";

import { Button } from "./button";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
}

export function ThemeToggle({ labels }: { labels?: PublicDictionary["theme"] }) {
  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }

  return (
    <Button
      className="theme-toggle"
      onClick={toggleTheme}
      size="icon"
      title={labels?.switchTheme ?? "Switch color theme"}
      variant="secondary"
    >
      <span className="theme-toggle__sun sr-only">{labels?.switchToLight ?? "Switch to light theme"}</span>
      <span className="theme-toggle__moon sr-only">{labels?.switchToDark ?? "Switch to dark theme"}</span>
      <svg
        aria-hidden="true"
        className="theme-toggle__sun size-4.5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      </svg>
      <svg
        aria-hidden="true"
        className="theme-toggle__moon size-4.5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M20.25 15.35A8.5 8.5 0 0 1 8.65 3.75a8.5 8.5 0 1 0 11.6 11.6Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      </svg>
    </Button>
  );
}
