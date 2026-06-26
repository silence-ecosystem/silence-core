'use client';

// ============================================================
// PatternsLab VoiceLab Component
// FULL safety: crisis modal, audit trail, RBAC, cloud fallback
// Contract: 02-SAFETY.md, Design System v3.0
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type { TranscriptionResult, VoiceError } from '@silence/voice';
import {
  PatternsLabVoicePipeline,
  detectCrisis,
  type CrisisDetectionResult,
  type CrisisLevel,
  type VoiceRole,
} from '../../lib/voice-patternslab';

// ============================================================
// TYPES
// ============================================================

type VoiceUIState =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'recording'
  | 'processing'
  | 'complete'
  | 'error'
  | 'crisis';

interface VoiceLabProps {
  tier: 'FREE' | 'PRO';
  role: VoiceRole;
  locale?: string;
  onTranscript?: (result: TranscriptionResult) => void;
  className?: string;
}

// ============================================================
// COMPONENT
// ============================================================

export default function VoiceLab({
  tier,
  role,
  locale = 'PL',
  onTranscript,
  className = '',
}: VoiceLabProps) {
  const [uiState, setUIState] = useState<VoiceUIState>('idle');
  const [levels, setLevels] = useState<number[]>(new Array(7).fill(0));
  const [transcript, setTranscript] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<VoiceError | null>(null);
  const [crisis, setCrisis] = useState<CrisisDetectionResult | null>(null);
  const [durationSec, setDurationSec] = useState(0);

  const pipelineRef = useRef<PatternsLabVoicePipeline | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- INIT PIPELINE ----
  const initPipeline = useCallback(async () => {
    if (pipelineRef.current) return;

    setUIState('initializing');

    const pipeline = new PatternsLabVoicePipeline({
      tier,
      role,
      locale,
      onCrisis: (result) => {
        setCrisis(result);
        setUIState('crisis');
      },
      onTranscription: (result) => {
        setTranscript(result);
        setUIState('complete');
        onTranscript?.(result);
      },
      onError: (err) => {
        setError(err);
        setUIState('error');
      },
      onStateChange: () => {},
      onLevels: (lvls) => setLevels(lvls),
    });

    try {
      await pipeline.initialize();
      pipelineRef.current = pipeline;
      setUIState('ready');
    } catch {
      setUIState('error');
      setError({
        code: 'WHISPER_LOAD_FAILED',
        message: 'Failed to initialize voice engine.',
        recoverable: true,
        action: 'retry',
      });
    }
  }, [tier, role, locale, onTranscript]);

  // ---- RECORDING CONTROLS ----
  const startRecording = useCallback(async () => {
    if (!pipelineRef.current) await initPipeline();
    if (!pipelineRef.current) return;

    setError(null);
    setCrisis(null);
    setTranscript(null);
    setDurationSec(0);

    try {
      await pipelineRef.current.startRecording();
      setUIState('recording');

      // Duration timer
      timerRef.current = setInterval(() => {
        setDurationSec((prev) => prev + 1);
      }, 1000);
    } catch {
      setUIState('error');
    }
  }, [initPipeline]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!pipelineRef.current) return;

    setUIState('processing');
    await pipelineRef.current.stopRecording();
  }, []);

  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pipelineRef.current?.cancel();
    setUIState('ready');
    setDurationSec(0);
    setLevels(new Array(7).fill(0));
  }, []);

  // ---- CLEANUP ----
  useEffect(() => {
    return () => {
      pipelineRef.current?.dispose();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ---- FORMAT HELPERS ----
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const maxDuration = tier === 'PRO' ? 900 : 300;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Voice Analysis</h2>
          <p className="text-sm text-slate-400">
            {tier === 'PRO' ? 'Cloud + Local' : 'Local Only'} · {role}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${
            uiState === 'recording' ? 'animate-pulse bg-red-500' :
            uiState === 'ready' ? 'bg-emerald-500' :
            'bg-slate-500'
          }`} />
          <span className="text-xs text-slate-400 capitalize">{uiState}</span>
        </div>
      </div>

      {/* Waveform Visualization — 7 bars */}
      <div className="flex items-end justify-center gap-1 h-16 px-4">
        {levels.map((level, i) => (
          <div
            key={i}
            className="w-2 rounded-full bg-indigo-500 transition-all duration-75"
            style={{
              height: `${Math.max(4, level * 64)}px`,
              opacity: uiState === 'recording' ? 0.6 + level * 0.4 : 0.2,
            }}
          />
        ))}
      </div>

      {/* Duration + Progress */}
      {(uiState === 'recording' || uiState === 'processing') && (
        <div className="text-center">
          <span className="text-2xl font-mono text-slate-100">
            {formatTime(durationSec)}
          </span>
          <span className="text-sm text-slate-500 ml-2">
            / {formatTime(maxDuration)}
          </span>
          {/* Progress bar */}
          <div className="mt-2 h-1 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{ width: `${(durationSec / maxDuration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {uiState === 'idle' && (
          <button
            onClick={initPipeline}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white
                       hover:bg-indigo-500 active:scale-95 transition-all"
          >
            Initialize Voice Engine
          </button>
        )}

        {uiState === 'initializing' && (
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading Whisper engine...
          </div>
        )}

        {uiState === 'ready' && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm
                       font-medium text-white hover:bg-red-500 active:scale-95 transition-all"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="6" />
            </svg>
            Start Recording
          </button>
        )}

        {uiState === 'recording' && (
          <div className="flex items-center gap-3">
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm
                         font-medium text-white hover:bg-slate-600 active:scale-95 transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop & Analyze
            </button>
            <button
              onClick={cancelRecording}
              className="rounded-xl border border-slate-600 px-4 py-3 text-sm text-slate-400
                         hover:text-white hover:border-slate-400 transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        {uiState === 'processing' && (
          <div className="flex items-center gap-2 text-indigo-400">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Transcribing...
          </div>
        )}

        {(uiState === 'complete' || uiState === 'error' || uiState === 'crisis') && (
          <button
            onClick={startRecording}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white
                       hover:bg-indigo-500 active:scale-95 transition-all"
          >
            New Recording
          </button>
        )}
      </div>

      {/* Transcript Output */}
      {transcript && uiState === 'complete' && (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">Transcript</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{transcript.source === 'cloud' ? '☁️ Cloud' : '💻 Local'}</span>
              <span>{transcript.language.toUpperCase()}</span>
              <span>{transcript.processingTimeMs}ms</span>
            </div>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {transcript.cleaned}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && uiState === 'error' && (
        <div className="rounded-xl border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-300">{error.message}</p>
          {error.action === 'fallback-text' && (
            <p className="mt-2 text-xs text-slate-400">
              Voice recording is not available. Please use text input instead.
            </p>
          )}
          {error.action === 'check-permissions' && (
            <p className="mt-2 text-xs text-slate-400">
              Please allow microphone access in your browser settings.
            </p>
          )}
        </div>
      )}

      {/* CRISIS MODAL — Contract: 02-SAFETY.md §2-3 */}
      {crisis && uiState === 'crisis' && (
        <CrisisModal crisis={crisis} onClose={() => setUIState('ready')} />
      )}
    </div>
  );
}

// ============================================================
// CRISIS MODAL — Separate component for safety visibility
// Contract: 02-SAFETY.md §2 — escalation matrix
// ============================================================

function CrisisModal({
  crisis,
  onClose,
}: {
  crisis: CrisisDetectionResult;
  onClose: () => void;
}) {
  const isEmergency = crisis.level === 'EMERGENCY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className={`w-full max-w-md rounded-2xl p-6 ${
        isEmergency ? 'bg-red-950 border border-red-700' : 'bg-slate-800 border border-slate-600'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isEmergency ? 'bg-red-500/20' : 'bg-amber-500/20'
          }`}>
            <span className="text-xl">{isEmergency ? '🚨' : '💛'}</span>
          </div>
          <div>
            <h3 className={`font-semibold ${isEmergency ? 'text-red-200' : 'text-slate-100'}`}>
              {isEmergency ? 'Important Resources' : 'Support Available'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEmergency
                ? 'If you or someone you know needs help right now:'
                : 'If you need to talk to someone:'}
            </p>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="space-y-3 mb-6">
          {crisis.resources.map((resource, i) => (
            <a
              key={i}
              href={`tel:${resource.number.replace(/\s/g, '')}`}
              className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                isEmergency
                  ? 'bg-red-900/50 hover:bg-red-900/80 border border-red-800'
                  : 'bg-slate-700/50 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-slate-100">{resource.name}</p>
                <p className="text-xs text-slate-400">
                  {resource.country} · {resource.available}
                </p>
              </div>
              <span className="text-lg font-semibold text-indigo-400">{resource.number}</span>
            </a>
          ))}
        </div>

        {/* Static Disclaimer — Non-reactive, always visible */}
        <p className="text-xs text-slate-500 mb-4">
          This tool provides structural pattern analysis. It is NOT a substitute
          for professional support. If you are in crisis, please reach out to one
          of the resources above.
        </p>

        {/* Close — only for non-emergency */}
        {!isEmergency && (
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-700 py-2.5 text-sm font-medium text-slate-200
                       hover:bg-slate-600 transition-colors"
          >
            Continue
          </button>
        )}

        {isEmergency && (
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-600 py-2.5 text-sm text-slate-400
                       hover:text-slate-200 transition-colors"
          >
            I understand
          </button>
        )}
      </div>
    </div>
  );
}
