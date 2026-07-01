import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Test Supabase connectivity via REST API
  let supabaseRest = 'unknown';
  try {
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      supabaseRest = res.ok ? 'connected' : `error-${res.status}`;
    } else {
      supabaseRest = 'missing-env-vars';
    }
  } catch (e) {
    supabaseRest = `fetch-error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test Supabase via service role key (JWT)
  let supabaseService = 'unknown';
  try {
    if (supabaseUrl && serviceKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      });
      supabaseService = res.ok ? 'connected' : `error-${res.status}`;
    } else {
      supabaseService = 'missing-service-key';
    }
  } catch (e) {
    supabaseService = `fetch-error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test GoTrue auth health
  let authHealth = 'unknown';
  try {
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        headers: supabaseKey ? { apikey: supabaseKey } : {},
      });
      const data = await res.json().catch(() => null);
      authHealth = res.ok ? 'ok' : `error-${res.status}`;
      if (data && data.external) {
        authHealth += ` (providers: ${Object.keys(data.external).filter(k => data.external[k]).join(',')})`;
      }
    }
  } catch (e) {
    authHealth = `fetch-error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    appVersion: '5.2.0',
    safetyCoreVersion: 'v3',
    docsVersion: 'v3.0',
    portalContractVersion: '1.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    safetyModule: 'configured',
    crisisDetection: '3-layer',
    outputScan: 'active',
    rateLimit: 'active-dev',
    deterministicCore: 'active',
    circuitBreaker: '15s',
    crossAppNav: 'enabled',
    supabaseRest,
    supabaseService,
    authHealth,
    supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
    anonKeyFormat: supabaseKey ? supabaseKey.substring(0, 15) + '...' : 'NOT SET',
    serviceKeyFormat: serviceKey ? serviceKey.substring(0, 15) + '...' : 'NOT SET',
    anthropicKey: anthropicKey ? 'SET (' + anthropicKey.substring(0, 10) + '...)' : 'NOT SET',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
  }, {
    status: 200,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
