import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Allowed origins for CORS (ADR §12)
const ALLOWED_ORIGINS = [
  'https://patternlens.app',
  'https://www.patternlens.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean)

// Routes accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/auth',
  '/signup',
  '/reset-password',
  '/help',
  '/pricing',
  '/test-supabase',
  '/terms',
  '/privacy',
  '/support',
  '/emergency',
  '/upgrade',
]

// API routes accessible without authentication
const PUBLIC_API_ROUTES = [
  '/api/health',

  '/api/auth',
  '/api/stripe/webhook',
  '/api/analyze',
]

function setCorsHeaders(response: NextResponse, origin: string): NextResponse {
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  return response
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    return setCorsHeaders(response, origin)
  }

  // If Supabase env vars are missing, pass through all requests
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Check if public route
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    // Check if public API
    const isPublicApi = PUBLIC_API_ROUTES.some(route =>
      pathname.startsWith(route)
    )

    // If not logged in and trying to access protected route → redirect to login
    if (!user && !isPublicRoute && !isPublicApi) {
      const redirectUrl = new URL('/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If logged in and on login page → redirect to dashboard
    if (user && pathname === '/login') {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Set CORS headers on API responses
    if (pathname.startsWith('/api/')) {
      setCorsHeaders(supabaseResponse, origin)
    }

    return supabaseResponse
  } catch {
    // If middleware crashes for any reason, pass through instead of blocking
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (all internal Next.js paths)
     * - favicon.ico, icons, manifest
     * - Static assets (images, fonts, etc.)
     * - .well-known directory
     * - screenshots directory
     * - service worker and offline page
     */
    '/((?!_next|favicon\\.ico|icon-.*|apple-.*|manifest\\.json|robots\\.txt|sitemap\\.xml|sw\\.js|offline\\.html|screenshots|well-known|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js|map)$).*)',
  ],
}
