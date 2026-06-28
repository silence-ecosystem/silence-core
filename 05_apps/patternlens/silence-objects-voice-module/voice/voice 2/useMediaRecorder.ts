'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface MediaRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  error: string | null;
  hasPermission: boolean | null;
}

export interface UseMediaRecorderReturn extends MediaRecorderState {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
  requestPermission: () => Promise<boolean>;
}

interface UseMediaRecorderOptions {
  maxDuration?: number; // seconds
  onMaxDurationReached?: () => void;
  mimeType?: string;
}

const SUPPORTED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/wav',
];

function getSupportedMimeType(): string {
  for (const mimeType of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  return 'audio/webm'; // fallback
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
  const {
    maxDuration = 180, // 3 minutes default
    onMaxDurationReached,
    mimeType: preferredMimeType,
  } = options;

  const [state, setState] = useState<MediaRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: null,
    hasPermission: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Revoke object URLs
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }

    // Clear chunks
    chunksRef.current = [];
    pausedDurationRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Request microphone permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });
      
      // Stop immediately - just checking permission
      stream.getTracks().forEach((track) => track.stop());
      
      setState((prev) => ({ ...prev, hasPermission: true, error: null }));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      setState((prev) => ({ ...prev, hasPermission: false, error: message }));
      return false;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      cleanup();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const mimeType = preferredMimeType || getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        const error = event as unknown as { error?: { message?: string } };
        setState((prev) => ({
          ...prev,
          error: error.error?.message || 'Recording error',
          isRecording: false,
        }));
        cleanup();
      };

      mediaRecorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();

      // Duration timer with max duration check
      timerRef.current = setInterval(() => {
        if (!state.isPaused) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000 + pausedDurationRef.current
          );
          
          setState((prev) => ({ ...prev, duration: elapsed }));

          if (elapsed >= maxDuration) {
            onMaxDurationReached?.();
          }
        }
      }, 1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
        error: null,
        hasPermission: true,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start recording';
      setState((prev) => ({ ...prev, error: message, hasPermission: false }));
      cleanup();
      throw err;
    }
  }, [cleanup, maxDuration, onMaxDurationReached, preferredMimeType, state.isPaused]);

  // Stop recording and return blob
  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });

        // Store URL for potential playback
        audioUrlRef.current = URL.createObjectURL(blob);

        // Full cleanup except the blob URL
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
          streamRef.current = null;
        }

        chunksRef.current = [];
        pausedDurationRef.current = 0;
        mediaRecorderRef.current = null;

        setState((prev) => ({
          ...prev,
          isRecording: false,
          isPaused: false,
        }));

        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  // Pause recording
  const pauseRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      pausedDurationRef.current += (Date.now() - startTimeRef.current) / 1000;
      setState((prev) => ({ ...prev, isPaused: true }));
    }
  }, []);

  // Resume recording
  const resumeRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      startTimeRef.current = Date.now();
      setState((prev) => ({ ...prev, isPaused: false }));
    }
  }, []);

  // Cancel recording without saving
  const cancelRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    cleanup();
    setState((prev) => ({
      ...prev,
      isRecording: false,
      isPaused: false,
      duration: 0,
    }));
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    requestPermission,
  };
}
