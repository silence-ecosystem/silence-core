// ============================================
// GET /api/health - Health Check Endpoint
// PatternLens v4.0
// ============================================
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  checks: {
    database: 'ok' | 'error';
    anthropic: 'ok' | 'error' | 'unchecked';
  };
  latency?: {
    database_ms: number;
  };
}

export async function GET() {
  const startTime = Date.now();

  const health: HealthStatus = {
    status: 'healthy',
    version: process.env.NEXT_PUBLIC_VERSION || '4.0.0',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'error',
      anthropic: 'unchecked'
    }
  };

  // Check Supabase connection
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const dbStart = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const dbLatency = Date.now() - dbStart;

    if (!error) {
      health.checks.database = 'ok';
      health.latency = { database_ms: dbLatency };
    } else {
      health.status = 'degraded';
    }
  } catch {
    health.status = 'unhealthy';
  }

  // Check Anthropic API key exists (don't make actual call)
  if (process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-')) {
    health.checks.anthropic = 'ok';
  } else {
    health.checks.anthropic = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`
    }
  });
}
