import {createServerClient} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";
import type {Database} from "@/types/database";

const sessionCacheHeaders = ["cache-control", "expires", "pragma"] as const;

export async function refreshSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({request});

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
          response = NextResponse.next({request});
          cookiesToSet.forEach(({name, value, options}) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([name, value]) =>
            response.headers.set(name, value),
          );
        },
      },
    },
  );

  await supabase.auth.getClaims();

  return response;
}

export function mergeSupabaseSession(
  response: NextResponse,
  sessionResponse: NextResponse,
) {
  sessionResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));

  sessionCacheHeaders.forEach((name) => {
    const value = sessionResponse.headers.get(name);
    if (value) response.headers.set(name, value);
  });

  return response;
}
