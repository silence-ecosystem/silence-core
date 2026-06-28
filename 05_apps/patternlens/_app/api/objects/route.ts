import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
    const correlationId = crypto.randomUUID();
    // ... reszta logiki
    return NextResponse.json({ success: true, correlationId });
}
