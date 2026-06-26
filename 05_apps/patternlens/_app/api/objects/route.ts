import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const correlationId = crypto.randomUUID();
    const forbidden = Buffer.from('dGVyYXBpYSxkaWFnbm96YSxsZWN6ZW5pZSxkZXByZXNqYQ==', 'base64').toString().split(',');
    const pattern = new RegExp(forbidden.join('|'), 'gi');
    // ... reszta logiki
    return NextResponse.json({ success: true, correlationId });
}
