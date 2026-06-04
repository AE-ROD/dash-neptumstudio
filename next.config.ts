import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**": ["src/app/*.node"],
  },
};

export default nextConfig;
