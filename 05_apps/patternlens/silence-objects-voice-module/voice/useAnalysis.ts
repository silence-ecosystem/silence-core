'use client';

import { useState, useCallback } from 'react';

// Types
export interface DualLensAnalysis {
  lens_a: string;
  lens_b: string;
  lens_a_title: string;
  lens_b_title: string;
  structural_patterns: string[];
  tension_points: string[];
}

export interface AnalysisResult {
  id: string;
  input_text: string;
  input_source: 'text' | 'voice';
  input_audio_url?: string;
  analysis: DualLensAnalysis;
  created_at: string;
  selected_lens: 'a' | 'b' | null;
}

export type AnalysisStatus = 
  | 'idle' 
  | 'requesting-permission'
  | 'recording'
  | 'transcribing' 
  | 'analyzing' 
  | 'success' 
  | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  transcript?: string;
  analysis?: AnalysisResult;
  error?: string;
  progress?: number; // 0-100 for progress indication
}

interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: string) => void;
  onEmergencyDetected?: (input: string) => void;
}

// API functions
async function transcribeAudio(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');

  const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Transcription failed');
  }

  const data = await response.json();
  return data.transcript;
}

async function analyzeText(text: string, source: 'text' | 'voice', audioUrl?: string): Promise<AnalysisResult> {
  const response = await fetch('/api/objects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_text: text,
      input_source: source,
      input_audio_url: audioUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    
    // Check for emergency detection
    if (error.code === 'EMERGENCY_DETECTED') {
      throw new EmergencyError(error.message, error.resources);
    }
    
    throw new Error(error.message || 'Analysis failed');
  }

  return response.json();
}

// Custom error for emergency detection
export class EmergencyError extends Error {
  resources: { name: string; phone: string; url?: string }[];
  
  constructor(message: string, resources: { name: string; phone: string; url?: string }[]) {
    super(message);
    this.name = 'EmergencyError';
    this.resources = resources;
  }
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const { onSuccess, onError, onEmergencyDetected } = options;

  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  // Analyze text input
  const analyzeTextInput = useCallback(async (input: string) => {
    if (!input.trim()) {
      setState({ status: 'error', error: 'Input cannot be empty' });
      return;
    }

    try {
      setState({ status: 'analyzing', progress: 50 });
      
      const result = await analyzeText(input, 'text');
      
      setState({ status: 'success', analysis: result, progress: 100 });
      onSuccess?.(result);
    } catch (error) {
      if (error instanceof EmergencyError) {
        onEmergencyDetected?.(input);
        setState({ 
          status: 'error', 
          error: 'Crisis resources displayed',
        });
        return;
      }
      
      const message = error instanceof Error ? error.message : 'Analysis failed';
      setState({ status: 'error', error: message });
      onError?.(message);
    }
  }, [onSuccess, onError, onEmergencyDetected]);

  // Analyze voice input (blob from MediaRecorder)
  const analyzeVoiceInput = useCallback(async (blob: Blob) => {
    try {
      // Step 1: Transcribe
      setState({ status: 'transcribing', progress: 25 });
      const transcript = await transcribeAudio(blob);

      if (!transcript.trim()) {
        setState({ status: 'error', error: 'Could not transcribe audio. Please try again.' });
        return;
      }

      // Step 2: Analyze
      setState({ status: 'analyzing', transcript, progress: 75 });
      
      // Upload audio and get URL (optional)
      const audioUrl = await uploadAudioBlob(blob);
      
      const result = await analyzeText(transcript, 'voice', audioUrl);
      
      setState({ 
        status: 'success', 
        transcript, 
        analysis: result,
        progress: 100,
      });
      onSuccess?.(result);
    } catch (error) {
      if (error instanceof EmergencyError) {
        onEmergencyDetected?.(state.transcript || '');
        setState({ 
          status: 'error', 
          error: 'Crisis resources displayed',
          transcript: state.transcript,
        });
        return;
      }
      
      const message = error instanceof Error ? error.message : 'Processing failed';
      setState((prev) => ({ 
        ...prev, 
        status: 'error', 
        error: message,
      }));
      onError?.(message);
    }
  }, [onSuccess, onError, onEmergencyDetected, state.transcript]);

  // Reset state
  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Update status (for external control)
  const setStatus = useCallback((status: AnalysisStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  return {
    ...state,
    analyzeTextInput,
    analyzeVoiceInput,
    reset,
    setStatus,
    isProcessing: ['transcribing', 'analyzing'].includes(state.status),
  };
}

// Helper: Upload audio blob and return URL
async function uploadAudioBlob(blob: Blob): Promise<string | undefined> {
  try {
    const formData = new FormData();
    formData.append('audio', blob, `recording-${Date.now()}.webm`);

    const response = await fetch('/api/voice/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.warn('Audio upload failed, continuing without URL');
      return undefined;
    }

    const data = await response.json();
    return data.url;
  } catch {
    console.warn('Audio upload failed, continuing without URL');
    return undefined;
  }
}
