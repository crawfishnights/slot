import type { NextConfig } from "next";

// Deployed at https://crawfishnights.github.io/slot/ — everything must be
// reachable under the /slot sub-path. `next build` always runs with
// NODE_ENV=production, so the base path is applied automatically for both
// local production builds and CI; `next dev` stays at the root for a normal
// local dev experience.
const isProd = process.env.NODE_ENV === "production";
const repoBasePath = "/slot";
const basePath = isProd ? repoBasePath : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? `${repoBasePath}/` : undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages serves static files only — no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
