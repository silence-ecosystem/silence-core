import type { ReactNode } from 'react';
import { colors } from '@/lib/tokens';
import './globals.css';

export const metadata = {
  title: 'φ-Garden | SILENCE.OBJECTS',
  description: 'Geometric growth through breath rituals.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta
          httpEquiv="Permissions-Policy"
          content="geolocation=(), microphone=(), camera=(), payment=()"
        />
      </head>
      <body
        style={{
          margin: 0,
          background: colors.surfaceBase,
          color: colors.textPrimary,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
