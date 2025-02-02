import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  eslint: {
    // WARNING: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // WARNING: This allows production builds to succeed even if there are type errors.
    // Use with caution!
    ignoreBuildErrors: true,
  },
};


export default nextConfig;
