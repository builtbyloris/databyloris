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
  poweredByHeader: false,
  images: {
    remotePatterns: projectMediaRemotePattern(),
  },
  async headers() {
    const headers = [
      {key: "X-Content-Type-Options", value: "nosniff"},
      {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
      {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()"},
      {key: "X-Frame-Options", value: "DENY"},
    ];

    if (process.env.VERCEL_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      });
    }

    return [{source: "/:path*", headers}];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
