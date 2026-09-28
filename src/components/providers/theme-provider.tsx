"use client";

import {ThemeProvider as NextThemesProvider} from "next-themes";
import type {ComponentProps} from "react";

export function ThemeProvider({children, ...props}: ComponentProps<typeof NextThemesProvider>) {
  // next-themes 0.4.6 renders its anti-flash script again on client remounts
  // (for example after a locale change). React 19 warns about executable
  // scripts inside client components, so only the client remount is inert.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({type: "application/json"} as const);

  return (
    <NextThemesProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemesProvider>
  );
}
