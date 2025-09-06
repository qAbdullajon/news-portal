import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "www.planetware.com",
      "images.unsplash.com",
      "thumbs.dreamstime.com",
      "example.com",
      "good-nature-blog-uploads.s3.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.planetware.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.example.com",
      },
    ],
  },
};

export default nextConfig;
