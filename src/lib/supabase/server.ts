import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import type {Database} from "@/types/database";
import {getSupabaseEnvironment} from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const {url, publishableKey} = getSupabaseEnvironment();

  return createServerClient<Database>(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot write cookies. A future Auth step will
            // handle session refreshes in the existing proxy.
          }
        },
      },
    },
  );
}
