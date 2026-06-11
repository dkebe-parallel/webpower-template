import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/demo/[slug]': ['./data/businesses/**/*'],
  },
};

export default nextConfig;
