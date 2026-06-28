import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,

  // Serwist / next-pwa integracja (offline-first)
  // Serwist jest preferowany nad next-pwa dla Next.js 15
  // Instalacja: pnpm add -D @serwist/next serwist
  // Odkomentuj po instalacji:
  //
  // experimental: {
  //   swcPlugins: [],  // rezerva dla custom plugins
  // },

  // Security headers dla wszystkich tras
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Blokuje osadzanie w iframe (clickjacking)
          { key: 'X-Frame-Options',            value: 'DENY' },
          // Blokuje MIME-type sniffing
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          // Referrer — minimum wycieku URL
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          // Permissions — blokuje nieużywane API przeglądarki
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=(self)',   // wymagane dla /voice
              'geolocation=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },
          // CSP — dostosuj do swojego backendu
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Next.js wymaga unsafe-eval w dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
            ].join('; '),
          },
        ],
      },
      // Cache manifest i service worker bez cache (muszą być świeże)
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },

  // Przekierowania legacy tras
  async redirects() {
    return [
      // Obsługa starego /voice → nowy routing
      {
        source: '/voice',
        destination: '/onboarding',
        permanent: false,
      },
    ];
  },

  // Optymalizacja obrazów — dozwolone domeny
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // Wyłącz X-Powered-By header
  poweredByHeader: false,

  // TypeScript — nie blokuj buildu na błędach (kontrolowane przez CI)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

/**
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
export default function nextConfig(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Dev-only: wyłącz CSP strict (hot reload wymaga looser policy)
    return {
      ...baseConfig,
    };
  }

  return baseConfig;
}
