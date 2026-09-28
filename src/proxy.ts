import createMiddleware from "next-intl/middleware";
import type {NextRequest} from "next/server";
import {routing} from "@/i18n/routing";
import {mergeSupabaseSession, refreshSupabaseSession} from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const sessionResponse = await refreshSupabaseSession(request);
  const intlResponse = handleI18nRouting(request);

  return mergeSupabaseSession(intlResponse, sessionResponse);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
