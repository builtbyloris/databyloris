import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function getProjectCoverPattern() {
  if (!supabaseUrl) return null;

  try {
    const parsedUrl = new URL(supabaseUrl);
    const protocol =
      parsedUrl.protocol === "https:"
        ? "https"
        : parsedUrl.protocol === "http:"
          ? "http"
          : null;

    if (!protocol) return null;

    return {
      protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: "/storage/v1/object/public/project-covers/**",
    } as const;
  } catch {
    return null;
  }
}

const projectCoverPattern = getProjectCoverPattern();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The application accepts 5 MB cover images; leave room for multipart
      // boundaries while retaining a deliberately small request ceiling.
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: projectCoverPattern ? [projectCoverPattern] : [],
  },
};

export default nextConfig;
