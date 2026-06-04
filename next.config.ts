import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**": ["src/app/generated/*.node"],
  },
};

export default nextConfig;
