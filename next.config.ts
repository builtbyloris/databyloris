import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

function projectMediaRemotePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return [];

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return [];
    return [{
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/v1/object/public/project-media/**",
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: projectMediaRemotePattern(),
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
