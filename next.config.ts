import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // Cloudinary domenini qo'shing
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dt1s1hoaj/image/upload/**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@hookform/resolvers"],
  },
};

export default nextConfig;
