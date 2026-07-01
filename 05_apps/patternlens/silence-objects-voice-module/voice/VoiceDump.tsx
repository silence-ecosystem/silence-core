'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';

interface VoiceDumpProps {
  onAnalysisComplete?: (result: unknown) => void;
  onEmergencyDetected?: () => void;
  maxDuration?: number;
  className?: string;
}

export function VoiceDump({
  onAnalysisComplete,
  onEmergencyDetected,
  maxDuration = 180,
  className = '',
}: VoiceDumpProps) {
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const {
    isRecording,
    isPaused,
    duration,
    error: recorderError,
    hasPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    requestPermission,
  } = useMediaRecorder({
    maxDuration,
    onMaxDurationReached: () => {
      handleStop();
    },
  });

  const {
    status,
    transcript,
    analysis,
    error: analysisError,
    progress,
    analyzeVoiceInput,
    reset: resetAnalysis,
  } = useAnalysis({
    onSuccess: onAnalysisComplete,
    onEmergencyDetected: () => {
      onEmergencyDetected?.();
    },
  });

  const {
    isOnline,
    queueCount,
    addToQueue,
  } = useOfflineQueue();

  // Check permission on mount
  useEffect(() => {
    if (hasPermission === null) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleStart = useCallback(async () => {
    if (hasPermission === false) {
      setShowPermissionPrompt(true);
      return;
    }

    resetAnalysis();
    
    try {
      await startRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [hasPermission, startRecording, resetAnalysis]);

  const handleStop = useCallback(async () => {
    try {
      const blob = await stopRecording();
      
      if (!isOnline) {
        // Queue for later if offline
        const transcriptPlaceholder = '[Offline recording - pending transcription]';
        await addToQueue(transcriptPlaceholder, 'voice', blob);
        return;
      }

      await analyzeVoiceInput(blob);
    } catch (err) {
      console.error('Failed to process recording:', err);
    }
  }, [stopRecording, isOnline, addToQueue, analyzeVoiceInput]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  }, [isPaused, pauseRecording, resumeRecording]);

  const handleCancel = useCallback(() => {
    cancelRecording();
    resetAnalysis();
  }, [cancelRecording, resetAnalysis]);

  const handleRetryPermission = useCallback(async () => {
    setShowPermissionPrompt(false);
    const granted = await requestPermission();
    if (granted) {
      handleStart();
    }
  }, [requestPermission, handleStart]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const error = recorderError || analysisError;
  const isProcessing = ['transcribing', 'analyzing'].includes(status);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="w-full px-4 py-2 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200 text-sm text-center">
          Offline mode • {queueCount} pending {queueCount === 1 ? 'object' : 'objects'}
        </div>
      )}

      {/* Permission prompt */}
      {showPermissionPrompt && (
        <div className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
          <p className="text-neutral-300 mb-4">
            Microphone access is required for voice input.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRetryPermission}
              className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-medium
                       hover:bg-neutral-200 transition-colors min-h-[44px]"
            >
              Grant Access
            </button>
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="px-4 py-2 border border-neutral-600 rounded-lg
                       hover:bg-neutral-700 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && !showPermissionPrompt && (
        <div className="w-full px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Recording visualization */}
      {isRecording && (
        <div className="flex flex-col items-center gap-4">
          {/* Pulsing indicator */}
          <div className="relative">
            <div 
              className={`w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center
                         ${!isPaused ? 'animate-pulse' : ''}`}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-500" />
              </div>
            </div>
            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                  PAUSED
                </span>
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="text-2xl font-mono text-white">
            {formatDuration(duration)}
            <span className="text-neutral-500 text-sm ml-2">
              / {formatDuration(maxDuration)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-1 bg-neutral-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-1000"
              style={{ width: `${(duration / maxDuration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-neutral-600 border-t-white rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-white font-medium">
              {status === 'transcribing' ? 'Transcribing audio...' : 'Generating interpretation...'}
            </p>
            {transcript && status === 'analyzing' && (
              <p className="text-neutral-400 text-sm mt-2 max-w-md">
                &ldquo;{transcript.slice(0, 100)}{transcript.length > 100 ? '...' : ''}&rdquo;
              </p>
            )}
          </div>
          {progress !== undefined && (
            <div className="w-full max-w-xs h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Success state */}
      {status === 'success' && analysis && (
        <div className="w-full p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <p className="text-green-200 text-center">
            ✓ Object created successfully
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRecording && !isProcessing && (
          <button
            onClick={handleStart}
            disabled={hasPermission === false}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 
                     disabled:bg-neutral-600 disabled:cursor-not-allowed
                     flex items-center justify-center transition-colors
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            aria-label="Start recording"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        )}

        {isRecording && (
          <>
            {/* Pause/Resume */}
            <button
              onClick={handlePause}
              className="w-12 h-12 rounded-full bg-neutral-700 hover:bg-neutral-600
                       flex items-center justify-center transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              )}
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              className="w-16 h-16 rounded-full bg-white hover:bg-neutral-200
                       flex items-center justify-center transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label="Stop recording"
            >
              <div className="w-6 h-6 bg-neutral-900 rounded" />
            </button>

            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700
                       flex items-center justify-center transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
              aria-label="Cancel recording"
            >
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Hint text */}
      {!isRecording && !isProcessing && status !== 'success' && (
        <p className="text-neutral-500 text-sm text-center">
          Tap to start voice dump • {formatDuration(maxDuration)} max
        </p>
      )}
    </div>
  );
}
