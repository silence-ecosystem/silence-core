# ============================================
# MOBILE CRUSH INTEGRATION - PowerShell
# PatternLens v4.0 | patternlens.app
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "📱 MOBILE CRUSH OPTIMIZATION" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Ensure we're in project root
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Run from patternlens-web directory" -ForegroundColor Red
    exit 1
}

# ============================================
# [1/6] MOBILE-FIRST CSS
# ============================================
Write-Host "[1/6] 🎨 Creating mobile-first CSS..." -ForegroundColor Yellow

$mobileCss = @'
/* ============================================
   MOBILE CRUSH NUKES - DESKTOP IS LEGACY
   PatternLens v4.0
   ============================================ */
:root {
  --mobile-min: 320px;
  --mobile-max: 767px;
  --tablet-min: 768px;
  --tablet-max: 1023px;
  --desktop-min: 1024px;
  
  /* TOUCH TARGET NUKES */
  --touch-min: 44px;
  --touch-optimal: 48px;
  
  /* FONT NUKES */
  --font-min: 16px; /* PREVENTS IOS ZOOM */
  --font-scale: 1.2;
}

/* NUCLEAR RESET FOR MOBILE */
@media (max-width: 767px) {
  * {
    -webkit-tap-highlight-color: transparent !important;
    -webkit-touch-callout: none !important;
  }
  
  input, textarea, [contenteditable] {
    font-size: var(--font-min) !important;
  }
  
  /* KILL HORIZONTAL SCROLL */
  body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  
  /* TOUCH TARGET ENFORCEMENT */
  button, a, [role="button"] {
    min-height: var(--touch-min) !important;
    min-width: var(--touch-min) !important;
  }
  
  /* GLASSMORPHISM MOBILE OPTIMIZATION */
  .glass-card {
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
  }
  
  /* GRID MOBILE STACK */
  .grid-2, .grid-3 {
    grid-template-columns: 1fr !important;
  }
  
  /* SIDEBAR MOBILE COLLAPSE */
  .sidebar {
    display: none !important;
  }
  
  .sidebar.mobile-open {
    display: block !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: var(--glass-bg);
    padding: var(--space-lg);
  }
}

/* TABLET BREAKPOINT */
@media (min-width: 768px) and (max-width: 1023px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* DESKTOP - AFTERTHOUGHT */
@media (min-width: 1024px) {
  /* Desktop inherits mobile-first styles */
}

/* SAFE AREA INSETS (iPhone X+) */
@supports (padding: max(0px)) {
  .container {
    padding-left: max(var(--space-lg), env(safe-area-inset-left));
    padding-right: max(var(--space-lg), env(safe-area-inset-right));
  }
  
  header {
    padding-top: max(var(--space-lg), env(safe-area-inset-top));
  }
}
'@

New-Item -ItemType Directory -Force -Path "src/styles" | Out-Null
$mobileCss | Out-File -FilePath "src/styles/mobile-crush.css" -Encoding UTF8
Write-Host "✅ Created src/styles/mobile-crush.css" -ForegroundColor Green

# ============================================
# [2/6] SERVICE WORKER
# ============================================
Write-Host "[2/6] 📲 Creating PWA service worker..." -ForegroundColor Yellow

$serviceWorker = @'
// ============================================
// PWA SERVICE WORKER - PatternLens v4.0
// ============================================
const CACHE_NAME = 'patternlens-v4-cache';
const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/*.css',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch - Cache First for static, Network First for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls - always network
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Navigation requests - Network first, cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets - Cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});
'@

New-Item -ItemType Directory -Force -Path "public" | Out-Null
$serviceWorker | Out-File -FilePath "public/sw.js" -Encoding UTF8
Write-Host "✅ Created public/sw.js" -ForegroundColor Green

# ============================================
# [3/6] MANIFEST.JSON
# ============================================
Write-Host "[3/6] 📋 Creating PWA manifest..." -ForegroundColor Yellow

$manifest = @'
{
  "name": "PatternLens - Structural Analysis",
  "short_name": "PatternLens",
  "description": "SILENCE.OBJECTS Framework - Structural Pattern Recognition",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#00f7ff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["productivity", "utilities"],
  "lang": "pl",
  "dir": "ltr"
}
'@

$manifest | Out-File -FilePath "public/manifest.json" -Encoding UTF8
Write-Host "✅ Created public/manifest.json" -ForegroundColor Green

# ============================================
# [4/6] NEXT.JS CONFIG
# ============================================
Write-Host "[4/6] ⚙️ Updating next.config.js..." -ForegroundColor Yellow

$nextConfig = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
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
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
'@

$nextConfig | Out-File -FilePath "next.config.js" -Encoding UTF8
Write-Host "✅ Updated next.config.js" -ForegroundColor Green

# ============================================
# [5/6] VERCEL.JSON
# ============================================
Write-Host "[5/6] 🚀 Creating vercel.json..." -ForegroundColor Yellow

$vercelJson = @'
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["fra1"],
  "github": {
    "silent": true
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ],
  "crons": []
}
'@

$vercelJson | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Host "✅ Created vercel.json" -ForegroundColor Green

# ============================================
# [6/6] OFFLINE PAGE
# ============================================
Write-Host "[6/6] 📴 Creating offline page..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path "app/offline" | Out-Null

$offlinePage = @'
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📴</div>
        <h1 className="text-2xl font-bold mb-4">Brak połączenia</h1>
        <p className="text-slate-400 mb-6">
          PatternLens wymaga połączenia z internetem do analizy.
          Sprawdź swoje połączenie i spróbuj ponownie.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
'@

$offlinePage | Out-File -FilePath "app/offline/page.tsx" -Encoding UTF8
Write-Host "✅ Created app/offline/page.tsx" -ForegroundColor Green

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📱 MOBILE CRUSH COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "Files created/updated:"
Write-Host "  • src/styles/mobile-crush.css"
Write-Host "  • public/sw.js"
Write-Host "  • public/manifest.json"
Write-Host "  • next.config.js"
Write-Host "  • vercel.json"
Write-Host "  • app/offline/page.tsx"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Import mobile-crush.css in globals.css"
Write-Host "  2. Register service worker in layout.tsx"
Write-Host "  3. Add PWA meta tags to layout.tsx"
Write-Host ""
