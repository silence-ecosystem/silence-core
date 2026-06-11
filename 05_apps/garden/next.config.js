/** @type {import('next').NextConfig} */

/**
 * SECURITY NOTE: This app uses `output: 'export'` (static HTML).
 * HTTP security headers (HSTS, CSP, X-Frame-Options, etc.) MUST be
 * applied at the CDN / hosting layer (Cloudflare, Vercel, nginx, S3+CF).
 *
 * Repo-level controls:
 - robots.ts controls indexing
 - layout.tsx injects CSP meta tag (limited but enforceable in static export)
 - No secrets in client bundle (verified by grep audit)
 - No eval/dangerouslySetInnerHTML (verified by grep audit)
 - No debug/test endpoints in app/
 *
 * CDN-level controls required for production:
 - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
 - Content-Security-Policy: (see layout.tsx meta tag + CDN override)
 - X-Content-Type-Options: nosniff
 - Referrer-Policy: strict-origin-when-cross-origin
 - Permissions-Policy: geolocation=(), microphone=(), camera=()
 - X-Frame-Options: DENY (or CSP frame-ancestors)
 */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@silence/phi', '@silence/telemetry', '@silence/jitai', '@silence/core'],
  // productionSourceMaps: false, // uncomment if source maps leak debug info
};

module.exports = nextConfig;
