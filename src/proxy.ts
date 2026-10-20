import createMiddleware from "next-intl/middleware";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {routing} from "@/i18n/routing";
import {mergeSupabaseSession, refreshSupabaseSession} from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const sessionResponse = await refreshSupabaseSession(request);
  const internalDefaultLocaleRewrite = request.headers.get("x-next-intl-locale") === routing.defaultLocale
    && (request.nextUrl.pathname === `/${routing.defaultLocale}`
      || request.nextUrl.pathname.startsWith(`/${routing.defaultLocale}/`));
  const intlResponse = internalDefaultLocaleRewrite
    ? NextResponse.next({request})
    : handleI18nRouting(request);

  return mergeSupabaseSession(intlResponse, sessionResponse);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
