import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteNavbar } from "./site-navbar";

interface PublicShellProps {
  children: ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex min-w-0 flex-1 flex-col" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
