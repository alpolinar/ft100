import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
