import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["src/app/generated/prisma/*.node"],
  },
};

export default nextConfig;
