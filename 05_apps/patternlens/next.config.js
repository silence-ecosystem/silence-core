/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint runs separately via `npm run lint`
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance
  reactStrictMode: true,

  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Security headers (ADR §12.3)
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com va.vercel-scripts.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' *.supabase.co wss://*.supabase.co api.anthropic.com api.openai.com api.stripe.com va.vercel-scripts.com https://sentry.io https://*.sentry.io https://*.upstash.io",
              "frame-src 'self' js.stripe.com https://vercel.live",
              "media-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
