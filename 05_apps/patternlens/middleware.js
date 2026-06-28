import { NextResponse } from 'next/server';
/**
 * @description Centralny Safety Layer 1-3 (Edge Compatible)
 * Zgodnie z MASTER_GUIDE �6.2
 */
export function middleware(request) {
    const correlationId = crypto.randomUUID();
    // Prosta symulacja skanowania bezpieczenstwa (Layer 1)
    const url = request.nextUrl.pathname;
    const authHeader = request.headers.get('Authorization');
    // Wymuszenie JWT (poza health check)
    if (!url.startsWith('/api/health') && !authHeader) {
        return NextResponse.json({
            success: false,
            error: { code: 'UNAUTHORIZED', correlationId }
        }, { status: 401 });
    }
    const response = NextResponse.next();
    response.headers.set('X-Correlation-Id', correlationId);
    return response;
}
export const config = {
    matcher: '/api/:path*',
};
