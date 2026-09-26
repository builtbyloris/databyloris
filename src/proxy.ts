import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  const destination = request.nextUrl.clone();
  destination.pathname = `/${defaultLocale}${
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  }`;

  return NextResponse.redirect(destination);
}

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/demo/:path*",
    "/explore/:path*",
    "/projects/:path*",
    "/admin/:path*",
  ],
};
