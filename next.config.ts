import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./src/app/generated/prisma/**/*"],
  },
};

export default nextConfig;
