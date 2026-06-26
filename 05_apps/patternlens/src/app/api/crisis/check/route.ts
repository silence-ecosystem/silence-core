// ============================================
// src/app/api/crisis/check/route.ts
// PatternLens v5.0 - Crisis Check API
// PASSIVE mode: show resources only, no logging
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { crisisDetection, getCrisisResourcesByLocale } from '@/lib/safety/crisis-detection';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 20) return false;
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const { text, locale = 'pl' } = await request.json();
    if (!text || typeof text !== 'string' || text.length < 10 || text.length > 5000) {
      return NextResponse.json({ error: 'Text must be 10-5000 characters' }, { status: 400 });
    }

    // PASSIVE mode: synchronous hard keyword check only (no Claude assessment)
    const result = crisisDetection.checkContent(text);

    return NextResponse.json({
      success: true,
      result,
      resources: result.level === 'critical' ? getCrisisResourcesByLocale(locale) : undefined,
    });
  } catch (error) {
    console.error('[CRISIS_CHECK_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'crisis-detection',
    version: '5.0',
    profile: 'PASSIVE',
    layers: ['hard_keyword'],
  });
}
