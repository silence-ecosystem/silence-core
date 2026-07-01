import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Max file size: 25MB (Whisper limit)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Supported audio formats
const SUPPORTED_FORMATS = [
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/m4a',
];

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided', code: 'MISSING_FILE' },
        { status: 400 }
      );
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    // Validate file type
    const mimeType = audioFile.type.split(';')[0]; // Remove codec info
    if (!SUPPORTED_FORMATS.some(format => mimeType.startsWith(format.split('/')[0]))) {
      return NextResponse.json(
        { error: 'Unsupported audio format', code: 'INVALID_FORMAT' },
        { status: 400 }
      );
    }

    // Convert to buffer for Whisper
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File-like object for OpenAI
    const file = new File([buffer], audioFile.name || 'recording.webm', {
      type: audioFile.type,
    });

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'pl', // Polish - change as needed or detect
      response_format: 'json',
      prompt: 'This is a personal voice note about behavioral patterns and relationships.',
    });

    // Log for analytics (optional)
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'voice_transcription',
      metadata: {
        audio_size: audioFile.size,
        transcript_length: transcription.text.length,
        mime_type: mimeType,
      },
    }).then(() => {}).catch(() => {}); // Fire and forget

    return NextResponse.json({
      transcript: transcription.text,
      duration: null, // Whisper doesn't return duration
      language: 'pl',
    });

  } catch (error) {
    console.error('Transcription error:', error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again.', code: 'RATE_LIMIT' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Transcription failed', code: 'TRANSCRIPTION_ERROR' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};
