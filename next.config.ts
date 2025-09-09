import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@hookform/resolvers"],
  },
};

export default nextConfig;
