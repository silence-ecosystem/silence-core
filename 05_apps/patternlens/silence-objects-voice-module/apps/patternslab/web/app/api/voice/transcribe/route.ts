// ============================================================
// /api/voice/transcribe — Server-side Whisper API proxy
// NEVER exposes API key to client
// PRO tier only — checks auth before forwarding
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHISPER_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Auth check (PRO tier verification)
  // TODO: Verify Supabase session + Stripe subscription
  // For now: check API key exists
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Cloud transcription not configured.' },
      { status: 503 }
    );
  }

  try {
    // 2. Forward form data to OpenAI Whisper API
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });
    }

    // Size check: max 25MB per OpenAI limit
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Max 25MB.' },
        { status: 413 }
      );
    }

    // 3. Build request to OpenAI
    const apiFormData = new FormData();
    apiFormData.append('file', file);
    apiFormData.append('model', 'whisper-1');
    apiFormData.append('response_format', 'verbose_json');

    const language = formData.get('language');
    if (language && language !== 'auto') {
      apiFormData.append('language', language as string);
    }

    const response = await fetch(WHISPER_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[voice/transcribe] OpenAI error:', response.status, error);
      return NextResponse.json(
        { error: 'Transcription service error.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 4. Audit log (append-only, no PII)
    // TODO: await supabase.from('voice_audit_log').insert({...})
    console.log('[voice/transcribe] Success:', {
      duration: data.duration,
      language: data.language,
      segments: data.segments?.length ?? 0,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('[voice/transcribe] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
