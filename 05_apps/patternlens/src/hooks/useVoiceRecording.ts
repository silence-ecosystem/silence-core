'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  RecordingState,
  RecordingError,
  RecordingErrorCode,
  AudioQuality,
  PermissionStatus,
  AudioConfig,
} from '@/types';

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_CONFIG: AudioConfig = {
  sampleRate: 16000,
  channels: 1,
  mimeType: 'audio/webm;codecs=opus',
  maxDuration: 60,
  minDuration: 3,
};

const FALLBACK_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
] as const;

// ============================================
// HOOK
// ============================================

interface UseVoiceRecordingOptions {
  onRecordingComplete?: (blob: Blob, duration: number) => void | Promise<void>;
  onError?: (error: RecordingError) => void;
  onQualityChange?: (quality: AudioQuality) => void;
  config?: Partial<AudioConfig>;
}

interface UseVoiceRecordingReturn {
  state: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
  requestPermission: () => Promise<boolean>;
  formattedDuration: string;
}

export function useVoiceRecording(
  options: UseVoiceRecordingOptions = {}
): UseVoiceRecordingReturn {
  const { onRecordingComplete, onError, onQualityChange, config: userConfig } = options;
  const config: AudioConfig = { ...DEFAULT_CONFIG, ...userConfig };

  // State
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    isProcessing: false,
    duration: 0,
    audioQuality: 'good',
    error: null,
    permissionStatus: 'prompt',
  });

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const qualityIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================
  // UTILITIES
  // ============================================

  const createError = useCallback(
    (code: RecordingErrorCode, message: string, recoverable = true): RecordingError => ({
      code,
      message,
      recoverable,
    }),
    []
  );

  const getSupportedMimeType = useCallback((): string | null => {
    if (typeof MediaRecorder === 'undefined') return null;
    
    for (const mimeType of FALLBACK_MIME_TYPES) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }
    return null;
  }, []);

  const calculateAudioQuality = useCallback((analyser: AnalyserNode): AudioQuality => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    
    if (average > 80) return 'excellent';
    if (average > 50) return 'good';
    if (average > 20) return 'fair';
    return 'poor';
  }, []);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // ============================================
  // CLEANUP
  // ============================================

  const cleanup = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (qualityIntervalRef.current !== null) {
      clearInterval(qualityIntervalRef.current);
      qualityIntervalRef.current = null;
    }
    
    if (audioStreamRef.current !== null) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    if (audioContextRef.current !== null) {
      void audioContextRef.current.close().catch(() => {
        // Ignore close errors
      });
      audioContextRef.current = null;
    }
    
    mediaRecorderRef.current = null;
    analyserRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // ============================================
  // PERMISSION
  // ============================================

  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    if (typeof navigator === 'undefined' || !('mediaDevices' in navigator)) {
      return 'unsupported';
    }

    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state as PermissionStatus;
    } catch {
      return 'prompt';
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !('mediaDevices' in navigator)) {
      setState(prev => ({
        ...prev,
        permissionStatus: 'unsupported',
        error: createError('BROWSER_UNSUPPORTED', 'Twoja przeglądarka nie obsługuje nagrywania audio', false),
      }));
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      setState(prev => ({ ...prev, permissionStatus: 'granted', error: null }));
      return true;
    } catch (err) {
      const error = err as DOMException;
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setState(prev => ({
          ...prev,
          permissionStatus: 'denied',
          error: createError('PERMISSION_DENIED', 'Odmówiono dostępu do mikrofonu. Sprawdź ustawienia przeglądarki.'),
        }));
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setState(prev => ({
          ...prev,
          permissionStatus: 'denied',
          error: createError('DEVICE_NOT_FOUND', 'Nie znaleziono mikrofonu. Podłącz urządzenie audio.'),
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: createError('RECORDING_FAILED', `Błąd inicjalizacji: ${error.message}`),
        }));
      }
      
      return false;
    }
  }, [createError]);

  // ============================================
  // RECORDING CONTROLS
  // ============================================

  const startRecording = useCallback(async (): Promise<void> => {
    // Check browser support
    const mimeType = getSupportedMimeType();
    if (mimeType === null) {
      const error = createError('BROWSER_UNSUPPORTED', 'Twoja przeglądarka nie obsługuje nagrywania audio', false);
      setState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    // Request permission and get stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: config.sampleRate,
          channelCount: config.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioStreamRef.current = stream;

      // Setup audio analysis
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        const error = createError('RECORDING_FAILED', 'Wystąpił błąd podczas nagrywania');
        setState(prev => ({ ...prev, error, isRecording: false }));
        onError?.(error);
        cleanup();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      startTimeRef.current = Date.now();

      // Start duration timer
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        
        setState(prev => ({ ...prev, duration: elapsed }));
        
        // Auto-stop at max duration
        if (elapsed >= config.maxDuration) {
          void stopRecording();
        }
      }, 100);

      // Start quality monitoring
      qualityIntervalRef.current = setInterval(() => {
        if (analyserRef.current !== null) {
          const quality = calculateAudioQuality(analyserRef.current);
          setState(prev => {
            if (prev.audioQuality !== quality) {
              onQualityChange?.(quality);
              return { ...prev, audioQuality: quality };
            }
            return prev;
          });
        }
      }, 500);

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        isProcessing: false,
        duration: 0,
        error: null,
        permissionStatus: 'granted',
      }));
    } catch (err) {
      const domError = err as DOMException;
      let error: RecordingError;

      if (domError.name === 'NotAllowedError') {
        error = createError('PERMISSION_DENIED', 'Odmówiono dostępu do mikrofonu');
      } else if (domError.name === 'NotFoundError') {
        error = createError('DEVICE_NOT_FOUND', 'Nie znaleziono mikrofonu');
      } else {
        error = createError('RECORDING_FAILED', `Nie można rozpocząć nagrywania: ${domError.message}`);
      }

      setState(prev => ({ ...prev, error }));
      onError?.(error);
      cleanup();
    }
  }, [config, getSupportedMimeType, createError, calculateAudioQuality, onError, onQualityChange, cleanup]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (mediaRecorderRef.current === null || state.isRecording === false) {
      return null;
    }

    setState(prev => ({ ...prev, isProcessing: true }));

    return new Promise<Blob | null>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (mediaRecorder === null) {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const duration = state.duration;
        
        // Check minimum duration
        if (duration < config.minDuration) {
          setState(prev => ({
            ...prev,
            isRecording: false,
            isProcessing: false,
            error: createError('RECORDING_FAILED', `Nagranie musi trwać minimum ${config.minDuration} sekundy`),
          }));
          cleanup();
          resolve(null);
          return;
        }

        // Create blob
        const mimeType = getSupportedMimeType() ?? 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });

        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          isProcessing: false,
        }));

        cleanup();
        
        void Promise.resolve(onRecordingComplete?.(blob, duration)).catch(() => {
          // Ignore callback errors
        });
        
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, [state.isRecording, state.duration, config.minDuration, createError, getSupportedMimeType, onRecordingComplete, cleanup]);

  const pauseRecording = useCallback((): void => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setState(prev => ({ ...prev, isPaused: true }));
    }
  }, []);

  const resumeRecording = useCallback((): void => {
    if (mediaRecorderRef.current?.state === 'paused') {
      const pausedDuration = state.duration;
      const resumeTime = Date.now();
      
      mediaRecorderRef.current.resume();
      
      timerRef.current = setInterval(() => {
        const additionalTime = (Date.now() - resumeTime) / 1000;
        setState(prev => ({ ...prev, duration: pausedDuration + additionalTime }));
      }, 100);
      
      setState(prev => ({ ...prev, isPaused: false }));
    }
  }, [state.duration]);

  const cancelRecording = useCallback((): void => {
    if (mediaRecorderRef.current !== null) {
      mediaRecorderRef.current.stop();
    }
    
    cleanup();
    
    setState(prev => ({
      ...prev,
      isRecording: false,
      isPaused: false,
      isProcessing: false,
      duration: 0,
    }));
  }, [cleanup]);

  // Check permission on mount
  useEffect(() => {
    void checkPermission().then(status => {
      setState(prev => ({ ...prev, permissionStatus: status }));
    });
  }, [checkPermission]);

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    requestPermission,
    formattedDuration: formatDuration(state.duration),
  };
}

export default useVoiceRecording;
