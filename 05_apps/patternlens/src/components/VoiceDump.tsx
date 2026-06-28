"use client";

import { useState, useCallback } from "react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { useTranscription } from "@/hooks/useTranscription";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface VoiceDumpProps {
  onTranscript: (text: string) => void;
  onRecordingStart?: () => void;
  onRecordingEnd?: () => void;
  disabled?: boolean;
  maxDuration?: number;
}

export function VoiceDump({
  onTranscript,
  onRecordingStart,
  onRecordingEnd,
  disabled = false,
  maxDuration = 120,
}: VoiceDumpProps) {
  const { lang, t } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  const { transcribe, isTranscribing } = useTranscription({
    onSuccess: (text) => {
      onTranscript(text);
      setError(null);
    },
    onError: (err) => setError(err.message),
    language: lang,
  });

  const handleRecordingComplete = useCallback(
    (blob: Blob) => {
      onRecordingEnd?.();
      transcribe(blob);
    },
    [transcribe, onRecordingEnd]
  );

  const {
    isRecording,
    isPaused,
    duration,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useMediaRecorder({
    onRecordingComplete: handleRecordingComplete,
    maxDuration,
    onMaxDurationReached: () => setError(`Maximum ${maxDuration}s reached`),
  });

  const handleStartRecording = useCallback(async () => {
    onRecordingStart?.();
    await startRecording();
  }, [startRecording, onRecordingStart]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isProcessing = isTranscribing;
  const isDisabled = disabled || isProcessing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Recording timer */}
      {isRecording && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--accent-red)',
            animation: 'pulse-red 1.2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-red)' }}>
            {formatDuration(duration)}
          </span>
          {isPaused && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(paused)</span>
          )}
        </div>
      )}

      {/* Main mic button — 80px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={isDisabled}
            style={{
              width: 80, height: 80,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-cyan)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.4 : 1,
              transition: 'all 200ms',
            }}
            aria-label="Start recording"
          >
            <MicIcon size={32} />
          </button>
        ) : (
          <>
            {/* Pause/Resume */}
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              style={{
                width: 48, height: 48,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
            </button>

            {/* Stop — big, red pulse */}
            <button
              onClick={stopRecording}
              className="pulse-red"
              style={{
                width: 80, height: 80,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--accent-red)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
              aria-label="Stop recording"
            >
              <StopIcon size={28} />
            </button>
          </>
        )}
      </div>

      {/* Status label */}
      <p style={{
        fontSize: 13,
        color: isRecording ? 'var(--accent-red)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center',
      }}>
        {isRecording
          ? t.analysis.recording
          : isProcessing
          ? t.analysis.analyzing
          : t.voice.subtitle}
      </p>

      {/* Processing indicator */}
      {isTranscribing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="spinner" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {t.analysis.transcription}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontSize: 12, color: 'var(--accent-red)' }}>{error}</p>
      )}
    </div>
  );
}

// Icons with configurable size
function MicIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function StopIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function PauseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
