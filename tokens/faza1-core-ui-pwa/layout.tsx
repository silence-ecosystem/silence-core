import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// ─── PWA + SEO Metadata ───────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'PatternLens',
    template: '%s · PatternLens',
  },
  description:
    'Behawioralne wsparcie uwagi, spokoju i recovery. Obserwuj swoje wzorce myślenia bez oceniania.',
  keywords: [
    'wzorce myślenia', 'spokój', 'uwaga', 'attention training', 'wellbeing',
  ],
  authors: [{ name: 'PatternLens Team' }],
  creator: 'PatternLens',
  publisher: 'PatternLens',
  // Index=false until public launch
  robots: { index: false, follow: false },

  // — PWA Manifest —
  manifest: '/manifest.json',

  // — Icons —
  icons: {
    icon: [
      { url: '/icons/icon-192.png',  sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png',  sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#7b8cff' },
    ],
  },

  // — iOS PWA —
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PatternLens',
    startupImage: [
      {
        url: '/icons/apple-splash-2048-2732.png',
        media:
          '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/apple-splash-1290-2796.png',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },

  // — Disable auto-link detection (blue phone numbers on iOS) —
  formatDetection: { telephone: false },

  // — Open Graph —
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'PatternLens',
    title: 'PatternLens',
    description: 'Behawioralne wsparcie uwagi, spokoju i recovery.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PatternLens' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PatternLens',
    description: 'Behawioralne wsparcie uwagi, spokoju i recovery.',
    images: ['/og-image.png'],
  },
};

// ─── Viewport (musi być oddzielne od metadata w Next.js 15) ─────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07070f',
  viewportFit: 'cover',          // ← aktywuje env(safe-area-inset-*) na iOS
};

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={inter.variable} suppressHydrationWarning>
      <body
        className="bg-[--color-bg] text-[--color-text] antialiased overscroll-none"
      >
        {/*
          #app-root jest scrollowalnym kontenerem (overflow-y: auto).
          html/body są position:fixed — to eliminuje iOS rubber-band.
          safe-area padding zapewnia poprawne wyświetlanie pod notchem.
        */}
        <div
          id="app-root"
          className="min-h-screen"
          style={{
            paddingTop:    'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft:   'env(safe-area-inset-left)',
            paddingRight:  'env(safe-area-inset-right)',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
