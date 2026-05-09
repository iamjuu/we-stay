import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@anthropic-ai/sdk",
    "pg",
    /** Default fonts load .afm files from disk — bundling breaks paths (ENOENT Helvetica.afm). */
    "pdfkit",
  ],
};

export default nextConfig;
