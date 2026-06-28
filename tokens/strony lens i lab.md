Poniżej kompletna propozycja struktury stron dla obu domen — gotowa do wdrożenia w istniejącym monorepo.\[[createappai](https://createappai.com/blog/app-router-auth)\]

---

## **App Router — struktura Silence-Experience (private)**

text  
`app/`  
`├── layout.tsx                        # Root layout, φ-tokens, fonts`  
`├── page.tsx                          # / → redirect do /welcome lub /dashboard`  
`│`  
`├── (public)/                         # Bez auth, bez layout nawigacji`  
`│   ├── layout.tsx                    # Minimalistyczny Soft Noir layout`  
`│   ├── welcome/`  
`│   │   └── page.tsx                  # patternlens.app/welcome — breathing ritual PL`  
`│   ├── golden-silence/`  
`│   │   └── page.tsx                  # patternlens.app/golden-silence — demo landing`  
`│   ├── investors/`  
`│   │   └── page.tsx                  # patternlens.app/investors — strona inwestorów`  
`│   └── eva/`  
`│       └── page.tsx                  # patternlens.app/eva — Golden Silence full experience`  
`│`  
`├── (auth)/                           # Strony logowania, bez app-nav`  
`│   ├── layout.tsx                    # Auth-only layout (centered card)`  
`│   ├── login/`  
`│   │   └── page.tsx                  # patternlens.app/login — Supabase SSR sign-in`  
`│   ├── sign-up/`  
`│   │   └── page.tsx`  
`│   └── callback/`  
`│       └── page.tsx                  # OAuth callback`  
`│`  
`├── (protected)/                      # Wymaga sesji (middleware guard)`  
`│   ├── layout.tsx                    # App layout z nav, bottom-bar`  
`│   ├── onboarding/`  
`│   │   ├── page.tsx                  # /onboarding — JITAI cold-start step 0`  
`│   │   └── [stepId]/`  
`│   │       └── page.tsx              # /onboarding/[stepId] — kroki 1–5`  
`│   ├── calibration/`  
`│   │   └── page.tsx                  # /calibration`  
`│   ├── dashboard/`  
`│   │   └── page.tsx                  # patternlens.app/dashboard`  
`│   ├── eva/                          # Protected version (z danymi usera)`  
`│   │   └── page.tsx`  
`│   ├── upgrade/`  
`│   │   └── page.tsx`  
`│   ├── plans/`  
`│   │   └── page.tsx`  
`│   └── week-complete/`  
`│       └── page.tsx`  
`│`  
`├── api/`  
`│   ├── gs-entered/route.ts           # Golden Silence telemetry`  
`│   ├── auth/`  
`│   │   ├── callback/route.ts`  
`│   │   └── merge/route.ts`  
`│   ├── jitai/`  
`│   │   └── decision/route.ts`  
`│   └── payments/`  
`│       ├── create-checkout/route.ts`  
`│       └── verify-receipt/route.ts`  
`│`  
`└── _legacy/                          # Nieaktywne, wykluczone przez Next.js`  
---

## **middleware.ts — routing logika**

ts  
`import { NextResponse } from 'next/server';`  
`import type { NextRequest } from 'next/server';`  
`import { createServerClient } from '@supabase/ssr';`

`const PUBLIC_ROUTES = [`  
  `'/',`  
  `'/welcome',`  
  `'/golden-silence',`  
  `'/investors',`  
  `'/eva',`  
  `'/login',`  
  `'/sign-up',`  
`];`

`const AUTH_ROUTES = ['/login', '/sign-up'];`

`export async function middleware(request: NextRequest) {`  
  `const { pathname } = request.nextUrl;`  
  `const host = request.headers.get('host') ?? '';`

  `// patternslab.app → rewrite do osobnej app (lub osobne Vercel project)`  
  `if (host === 'patternslab.app' || host.endsWith('.patternslab.app')) {`  
    `const url = request.nextUrl.clone();`  
    ``url.pathname = `/b2b${pathname}`;``  
    `return NextResponse.rewrite(url);`  
  `}`

  `// Public routes — pass through`  
  `if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {`  
    `return NextResponse.next();`  
  `}`

  `// Sprawdź sesję Supabase`  
  `const response = NextResponse.next();`  
  `const supabase = createServerClient(`  
    `process.env.NEXT_PUBLIC_SUPABASE_URL!,`  
    `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,`  
    `{`  
      `cookies: {`  
        `getAll: () => request.cookies.getAll(),`  
        `setAll: (cs) => cs.forEach(({ name, value, options }) =>`  
          `response.cookies.set(name, value, options)`  
        `),`  
      `},`  
    `}`  
  `);`

  `const { data: { user } } = await supabase.auth.getUser();`

  `// Niezalogowany → login, z redirect po auth`  
  `if (!user) {`  
    `const loginUrl = new URL('/login', request.url);`  
    `loginUrl.searchParams.set('redirect', pathname);`  
    `return NextResponse.redirect(loginUrl);`  
  `}`

  `// Zalogowany + strona auth → dashboard`  
  `if (user && AUTH_ROUTES.includes(pathname)) {`  
    `return NextResponse.redirect(new URL('/dashboard', request.url));`  
  `}`

  `return response;`  
`}`

`export const config = {`  
  `matcher: [`  
    `'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)',`  
  `],`  
`};`  
---

---

## **`app/page.tsx` — root redirect**

tsx  
`import { redirect } from 'next/navigation';`  
`import { createServerClient } from '@supabase/ssr';`  
`import { cookies } from 'next/headers';`

`export default async function RootPage() {`  
  `const cookieStore = cookies();`  
  `const supabase = createServerClient(`  
    `process.env.NEXT_PUBLIC_SUPABASE_URL!,`  
    `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,`  
    `{ cookies: { getAll: () => cookieStore.getAll() } }`  
  `);`

  `const { data: { user } } = await supabase.auth.getUser();`

  `// Zalogowany → dashboard, nowy → welcome`  
  `redirect(user ? '/dashboard' : '/welcome');`  
`}`  
---

## **`patternslab.app` — minimalny B2B scaffold**

Jeśli `patternslab.app` to osobny projekt (rekomendowane), wystarczy nowy Vercel project z 3 stronami:

text  
`apps/patternslab-portal/`  
`└── app/`  
    `├── layout.tsx`  
    `├── page.tsx                # / → /dashboard lub landing B2B`  
    `├── dashboard/`  
    `│   └── page.tsx            # patternslab.app/dashboard — B2B panel`  
    `└── login/`  
        `└── page.tsx            # patternslab.app/login`

Certyfikat HTTPS: Vercel wystawia automatycznie przez **Let's Encrypt** przy dodaniu domeny do projektu — zero konfiguracji, odnawia się automatycznie.\[[oneuptime](https://oneuptime.com/blog/post/2026-02-02-nextjs-middleware/view)\]

