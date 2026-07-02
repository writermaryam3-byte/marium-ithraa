import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const isDev = process.env.NODE_ENV === 'development'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL ?? ''

const nextConfig: NextConfig = {
  reactCompiler: true,

  productionBrowserSourceMaps: false,

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
      },
      {
        protocol: 'https',
        hostname: 'purecatamphetamine.github.io',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path((?!auth/).*)',
        destination: `${BACKEND}/api/:path*`,
      },
    ]
  },

  async headers() {
    const csp = [
      "default-src 'self'",

      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

      "style-src 'self' 'unsafe-inline'",

      [
        'img-src',
        "'self'",
        'data:',
        'blob:',
        'https://www.figma.com',
        'https://purecatamphetamine.github.io',
      ].join(' '),

      ['connect-src', "'self'", BACKEND, 'https://*.ingest.sentry.io', 'https://*.sentry.io'].join(
        ' ',
      ),

      "font-src 'self' data:",

      "worker-src 'self' blob:",

      "frame-src 'none'",

      "object-src 'none'",

      "base-uri 'self'",

      "form-action 'self'",

      ...(isDev ? [] : ['upgrade-insecure-requests']),
    ].join('; ')

    const headers = [
      {
        key: 'Content-Security-Policy',
        value: csp,
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ]

    if (!isDev) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      })
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
