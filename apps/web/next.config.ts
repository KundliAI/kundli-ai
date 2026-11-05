import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  reactStrictMode: true,
  // The repo root has its own lockfile (the old Vite site); trace from this app.
  outputFileTracingRoot: path.join(__dirname),
};

export default config;
