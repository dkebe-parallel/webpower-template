import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/demo/[slug]': ['./data/businesses/**/*'],
    },
  },
};

export default nextConfig;
