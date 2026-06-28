'use client';

// ============================================================
// PatternLens VoiceDump — MINIMAL_ADULT_TOOL
// Local Whisper.cpp only, no crisis detection, no audit, no auth
// Max 5 min, text cleanup (PL fillers), waveform viz
// Contract: claude.md Safety Profile MINIMAL_ADULT_TOOL
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  AudioRecorder,
  VoiceActivityDetector,
  WhisperEngine,
  cleanTranscription,
  VOICE_PROFILES,
  type TranscriptionResult,
  type VoiceError,
} from '@silence/voice';

type DumpState = 'idle' | 'loading' | 'ready' | 'recording' | 'processing' | 'done' | 'error';

interface VoiceDumpProps {
  onTranscript?: (text: string) => void;
  className?: string;
}

export default function VoiceDump({ onTranscript, className = '' }: VoiceDumpProps) {
  const [state, setState] = useState<DumpState>('idle');
  const [levels, setLevels] = useState<number[]>(new Array(7).fill(0));
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const whisperRef = useRef<WhisperEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_DURATION = VOICE_PROFILES.PATTERNLENS.maxDurationSec; // 300s = 5min

  // ---- INIT ----
  const init = useCallback(async () => {
    setState('loading');
    try {
      const whisper = new WhisperEngine();
      await whisper.initialize();
      whisperRef.current = whisper;

      recorderRef.current = new AudioRecorder({
        maxDurationSec: MAX_DURATION,
      });
      vadRef.current = new VoiceActivityDetector();

      setState('ready');
    } catch {
      setState('error');
      setError('Could not load voice engine. Use text input instead.');
    }
  }, [MAX_DURATION]);

  // ---- RECORD ----
  const startRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    const vad = vadRef.current;
    if (!recorder || !vad) {
      await init();
      return;
    }

    setError(null);
    setTranscript('');
    setSeconds(0);

    try {
      const stream = await recorder.requestMic();
      await vad.connect(stream);

      // Level updates for waveform
      vad.on((event) => {
        if (event.type === 'level-update') setLevels(event.levels);
      });

      recorder.start();
      setState('recording');

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_DURATION) {
            stopRecording();
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setState('error');
      setError('Microphone not available. Please check permissions.');
    }
  }, [init, MAX_DURATION]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    vadRef.current?.disconnect();
    setLevels(new Array(7).fill(0));

    const recorder = recorderRef.current;
    const whisper = whisperRef.current;
    if (!recorder || !whisper) return;

    setState('processing');

    try {
      const session = await recorder.stop();
      if (!session.audioBlob) {
        setState('error');
        setError('No audio captured.');
        return;
      }

      // Local transcription
      const audioData = await WhisperEngine.audioToFloat32(session.audioBlob);
      const result = await whisper.transcribe(audioData);

      // Cleanup: remove Polish fillers
      const { text } = cleanTranscription(result.raw, {
        language: 'pl',
        removeFillers: true,
        fixPunctuation: true,
      });

      setTranscript(text);
      setState('done');
      onTranscript?.(text);

      // Release audio blob — no storage
      if (session.audioUrl) {
        URL.revokeObjectURL(session.audioUrl);
      }
    } catch {
      setState('error');
      setError('Transcription failed. Try again or use text input.');
    }
  }, [onTranscript]);

  // ---- CLEANUP ----
  useEffect(() => {
    return () => {
      recorderRef.current?.destroy();
      vadRef.current?.disconnect();
      whisperRef.current?.dispose();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ---- FORMAT ----
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ============================================================
  // RENDER — Minimal, clean, no frills
  // ============================================================

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Waveform — 7 bars */}
      <div className="flex items-end justify-center gap-1.5 h-12">
        {levels.map((level, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-cyan-500 transition-all duration-75"
            style={{
              height: `${Math.max(3, level * 48)}px`,
              opacity: state === 'recording' ? 0.5 + level * 0.5 : 0.15,
            }}
          />
        ))}
      </div>

      {/* Timer */}
      {state === 'recording' && (
        <p className="font-mono text-lg text-slate-200">
          {fmt(seconds)}
          <span className="text-slate-500 text-sm ml-1">/ {fmt(MAX_DURATION)}</span>
        </p>
      )}

      {/* Main Button */}
      <div className="flex gap-3">
        {state === 'idle' && (
          <button
            onClick={init}
            className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm text-slate-200
                       hover:bg-slate-600 active:scale-95 transition-all"
          >
            Enable Voice
          </button>
        )}

        {state === 'loading' && (
          <span className="text-sm text-slate-400">Loading engine...</span>
        )}

        {state === 'ready' && (
          <button
            onClick={startRecording}
            className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm text-white
                       hover:bg-cyan-500 active:scale-95 transition-all"
          >
            🎙 Record
          </button>
        )}

        {state === 'recording' && (
          <button
            onClick={stopRecording}
            className="rounded-lg bg-slate-600 px-5 py-2.5 text-sm text-white
                       hover:bg-slate-500 active:scale-95 transition-all"
          >
            ⏹ Stop
          </button>
        )}

        {state === 'processing' && (
          <span className="text-sm text-cyan-400">Transcribing locally...</span>
        )}

        {(state === 'done' || state === 'error') && (
          <button
            onClick={startRecording}
            className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm text-white
                       hover:bg-cyan-500 active:scale-95 transition-all"
          >
            🎙 Again
          </button>
        )}
      </div>

      {/* Transcript */}
      {transcript && state === 'done' && (
        <div className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3">
          <p className="text-sm text-slate-200 leading-relaxed">{transcript}</p>
        </div>
      )}

      {/* Error */}
      {error && state === 'error' && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Static Disclaimer — MINIMAL_ADULT_TOOL: non-reactive, always */}
      <p className="text-[10px] text-slate-600 text-center max-w-xs">
        PatternLens is a structural analysis tool, not a professional service.
        All processing happens locally on your device.
      </p>
    </div>
  );
}
