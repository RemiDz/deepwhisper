import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['jspdf'],
  turbopack: {
    resolveAlias: {
      // Redirect fflate's Node.js worker to the browser version
      'fflate/lib/node.cjs': 'fflate',
    },
  },
};

export default nextConfig;
