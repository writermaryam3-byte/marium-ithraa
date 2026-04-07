import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // Proxy backend API, but keep NextAuth routes on this app
        source: "/api/:path((?!auth/).*)",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      }
    ]
  },
  typescript:{
    ignoreBuildErrors: true
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
