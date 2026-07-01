// TODO M3: Import safety middleware from @/lib/safety
// Apply: normalizeInput, checkRateLimit, scanOutput to ALL AI/voice/medical/legal endpoints
// See: DIPLO_BIBLE_v3 section IV.B @silence/safety
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CLAUDE_MODEL } from '@/constants/app';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function transcribeAudio(base64Audio: string, mediaType: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Audio,
            }
          },
          {
            type: 'text',
            text: 'Transkrybuj to nagranie audio po polsku. Zwróć TYLKO transkrybowany tekst, bez komentarzy ani formatowania.'
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Claude transcription error:', response.status, errorBody);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.content?.length) throw new Error('Empty response from Claude');
  return data.content[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    if (!audioFile) return NextResponse.json({ error: 'No audio' }, { status: 400 });

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');
    const mediaType = audioFile.type || 'audio/webm';

    const original = await transcribeAudio(base64Audio, mediaType);
    const cleanText = original
      .replace(/\b(no|wiec|znaczy|jakby|yyyy|eeee|mmm)\b/gi, '')
      .replace(/\s+/g, ' ').trim();

    return NextResponse.json({ text: cleanText, original });
  } catch (error) {
    console.error('Voice error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 60;
