import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["motion"],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
