import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Storage bucket name
const BUCKET_NAME = 'voice-recordings';

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
        { error: 'File too large. Maximum size is 50MB.', code: 'FILE_TOO_LARGE' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).slice(2, 9);
    const extension = getExtension(audioFile.type);
    const filename = `${user.id}/${timestamp}-${randomId}.${extension}`;

    // Convert to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: audioFile.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed', code: 'UPLOAD_ERROR' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
      size: audioFile.size,
    });

  } catch (error) {
    console.error('Voice upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', code: 'UPLOAD_ERROR' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for cleanup
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path required', code: 'MISSING_PATH' },
        { status: 400 }
      );
    }

    // Security: Ensure user can only delete their own files
    if (!path.startsWith(user.id + '/')) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Delete failed', code: 'DELETE_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Voice delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/webm;codecs=opus': 'webm',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/ogg;codecs=opus': 'ogg',
    'audio/flac': 'flac',
  };
  return map[mimeType] || 'webm';
}

export const config = {
  api: {
    bodyParser: false,
  },
};
