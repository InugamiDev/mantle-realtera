import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack uses this project folder as the workspace root.
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
