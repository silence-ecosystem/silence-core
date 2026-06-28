// src/app/api/health/route.ts
// PATTERNLENS v4.1 - Production Health Check Endpoint

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    api: boolean;
    timestamp: boolean;
  };
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const health: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '4.1.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    checks: {
      api: true,
      timestamp: true,
    },
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
