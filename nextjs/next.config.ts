import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["fs"],

  // HTTPS configuration for development
  async rewrites() {
    return [];
  },

  // Custom server configuration will be handled in package.json scripts
};

export default nextConfig;
