const SUPABASE_URL_NAME = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_KEY_NAME = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export function getSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    const missing = [
      !url ? SUPABASE_URL_NAME : null,
      !publishableKey ? SUPABASE_KEY_NAME : null,
    ].filter(Boolean).join(", ");
    throw new Error(`Missing required Supabase environment variable(s): ${missing}`);
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") throw new Error();
  } catch {
    throw new Error(`${SUPABASE_URL_NAME} must be a valid HTTP(S) URL.`);
  }

  return {url, publishableKey};
}
