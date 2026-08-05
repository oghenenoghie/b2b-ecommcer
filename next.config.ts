import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add the Supabase Storage host once a project exists, e.g.
    // { protocol: "https", hostname: "<project-ref>.supabase.co", pathname: "/storage/v1/object/public/**" }
    remotePatterns: [],
  },
};

export default nextConfig;
