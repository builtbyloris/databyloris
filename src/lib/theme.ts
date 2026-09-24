export const THEME_STORAGE_KEY = "databyloris-theme";

export type Theme = "light" | "dark";

export const themeInitScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : systemTheme;

      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    }
  })();
`;
