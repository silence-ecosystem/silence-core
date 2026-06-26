import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PatternLens | Strukturalna Analiza Wzorców',
  description: 'Narzędzie konstrukcyjne do analizy strukturalnej wzorców behawioralnych. Framework SILENCE.OBJECTS.',
  keywords: ['pattern analysis', 'behavioral patterns', 'structural analysis', 'neurodivergent', 'SILENCE.OBJECTS'],
  authors: [{ name: 'PatternLens' }],
  creator: 'PatternLens',
  publisher: 'PatternLens',
  robots: 'index, follow',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PatternLens',
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://patternlens.app',
    siteName: 'PatternLens',
    title: 'PatternLens | Strukturalna Analiza Wzorców',
    description: 'Narzędzie konstrukcyjne do analizy strukturalnej wzorców behawioralnych.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PatternLens',
    description: 'Strukturalna analiza wzorców behawioralnych',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0e27',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-dark-900 text-slate-50 antialiased">
        <a href="#main-content" className="skip-link">
          Przejdź do treści
        </a>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('🔍 PatternLens SW registered:', registration.scope);
                    },
                    function(err) {
                      console.log('SW registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
