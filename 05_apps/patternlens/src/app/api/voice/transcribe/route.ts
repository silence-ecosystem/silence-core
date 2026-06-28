import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Whisper STT — requires OPENAI_API_KEY in env
export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED' },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('audio') || formData.get('file');
    const language = (formData.get('language') as string) || '';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 },
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not set in environment');
      return NextResponse.json(
        { success: false, error: 'Voice transcription not configured' },
        { status: 500 },
      );
    }

    // Convert to buffer for Whisper API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Whisper API — auto language detect, temperature 0 for accuracy
    const whisperForm = new FormData();
    whisperForm.append('file', new Blob([buffer]), 'recording.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('response_format', 'json');
    whisperForm.append('temperature', '0');

    // Pass language hint if provided (ISO 639-1: 'en', 'pl')
    if (language) {
      whisperForm.append('language', language);
    }

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: whisperForm,
    });

    if (!whisperResponse.ok) {
      const errorBody = await whisperResponse.text();
      console.error('Whisper API error:', whisperResponse.status, errorBody);
      return NextResponse.json(
        { success: false, error: 'Transcription failed' },
        { status: 500 },
      );
    }

    const data = await whisperResponse.json();
    const transcription = data.text || '';

    // Save to voice_dumps (non-blocking — transcription still returned if save fails)
    if (transcription.length > 0) {
      try {
        await supabase.from('voice_dumps').insert({
          user_id: user.id,
          transcription,
          duration_seconds: Math.round(buffer.byteLength / 16000),
        });
      } catch (err) {
        console.error('voice_dumps insert error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      text: transcription,
      transcription,
      language: language || 'auto',
    });

  } catch (err) {
    console.error('Transcribe route error:', err);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
