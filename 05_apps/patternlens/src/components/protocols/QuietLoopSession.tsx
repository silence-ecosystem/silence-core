'use client';

import { useState, useEffect, useRef } from 'react';
import { saveProtocolBaseline } from '@/lib/api/protocols';

interface QuietLoopSessionProps {
  userId: string;
  onComplete?: (baselineSeconds: number) => void;
}

type Phase = 'intro' | 'focus' | 'check' | 'complete';

export function QuietLoopSession({ userId, onComplete }: QuietLoopSessionProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [timerSeconds, setTimerSeconds] = useState(20);
  const [currentDuration, setCurrentDuration] = useState(20);
  const [baselineSeconds, setBaselineSeconds] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setPhase('check');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerSeconds]);

  // Breathing animation sync with timer (20s = 4 breaths of 5s each)
  const breatheProgress = ((currentDuration - timerSeconds) % 5) / 5;

  function startSession() {
    setPhase('focus');
    setTimerSeconds(currentDuration);
    setIsRunning(true);
  }

  async function handleAttentionResponse(maintained: boolean) {
    // Staircase protocol logic
    const recordedSeconds = maintained ? currentDuration : Math.floor(currentDuration * 0.8);
    setBaselineSeconds(recordedSeconds);

    // Save to Supabase
    await saveProtocolBaseline({
      userId,
      protocolKey: 'QUIET_LOOP',
      baselineSeconds: recordedSeconds,
      maintained,
    });

    setPhase('complete');
    onComplete?.(recordedSeconds);
  }

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 flex flex-col bg-slate-900 text-zinc-100">
        {/* 62% zone — explanation */}
        <div className="flex-[0.62] flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
          <div className="text-center space-y-golden-3">
            <h1 className="text-golden-h1 font-semibold tracking-tight">
              Quiet Loop — Pomiar stabilności uwagi
            </h1>
            <p className="text-golden-body text-zinc-400 leading-relaxed">
              Przez {currentDuration} sekund skoncentruj wzrok na punkcie centralnym.
              Możesz oddychać naturalnie — obserwuj, jak długo Twoja uwaga pozostaje stabilna.
            </p>
            <p className="text-golden-caption text-zinc-500">
              To nie ćwiczenie relaksacyjne ani test — to pomiar Twojej naturalnej pojemności uwagi.
            </p>
          </div>
        </div>

        {/* 38% zone — CTA */}
        <div className="flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-3">
          <button
            onClick={startSession}
            className="px-8 py-3 rounded-lg bg-zinc-100 text-slate-900 font-semibold text-golden-body
                       hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-100/50
                       min-h-[44px]"
          >
            Rozpocznij pomiar
          </button>
        </div>
      </div>
    );
  }

  // Focus phase (active timer)
  if (phase === 'focus') {
    return (
      <div className="fixed inset-0 flex flex-col bg-slate-900 text-zinc-100">
        {/* 62% zone — breathing object */}
        <div className="flex-[0.62] flex flex-col items-center justify-center px-6">
          {/* Breathing object synced to timer */}
          <div
            className="w-32 h-32 rounded-full bg-zinc-100/10 border border-zinc-100/20 backdrop-blur-sm
                       transition-transform duration-[2500ms] ease-in-out"
            style={{
              transform: `scale(${1 + breatheProgress * 0.05})`,
              opacity: 0.6 + breatheProgress * 0.25,
            }}
            aria-hidden="true"
          />

          {/* Timer display */}
          <div className="mt-golden-3 text-golden-caption text-zinc-500 font-mono tabular-nums">
            {timerSeconds}s
          </div>
        </div>

        {/* 38% zone — status */}
        <div className="flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-2">
          <p className="text-golden-caption text-zinc-500 text-center max-w-xs">
            Trzymaj uwagę na punkcie. Obserwuj oddech, ale nie zmieniaj go.
          </p>
        </div>
      </div>
    );
  }

  // Check phase (after timer ends)
  if (phase === 'check') {
    return (
      <div className="fixed inset-0 flex flex-col bg-slate-900 text-zinc-100">
        {/* 62% zone — question */}
        <div className="flex-[0.62] flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
          <div className="text-center space-y-golden-3">
            <h2 className="text-golden-h1 font-semibold tracking-tight">
              Czy Twoja uwaga pozostała przy punkcie?
            </h2>
            <p className="text-golden-body text-zinc-400">
              Odpowiedź może być przybliżona — to nie test, tylko pomiar.
            </p>
          </div>
        </div>

        {/* 38% zone — response buttons */}
        <div className="flex-[0.38] flex flex-col items-center justify-start px-6 pt-golden-3 space-y-3">
          <button
            onClick={() => handleAttentionResponse(true)}
            className="w-full max-w-xs px-6 py-4 rounded-xl
                       border border-zinc-800 bg-zinc-900/50
                       hover:border-zinc-600 hover:bg-zinc-800/60
                       transition-all text-golden-body text-zinc-200
                       focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Tak — uwaga była stabilna
          </button>
          <button
            onClick={() => handleAttentionResponse(false)}
            className="w-full max-w-xs px-6 py-4 rounded-xl
                       border border-zinc-800 bg-zinc-900/50
                       hover:border-zinc-600 hover:bg-zinc-800/60
                       transition-all text-golden-body text-zinc-200
                       focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Nie — uwaga odpłynęła
          </button>
        </div>
      </div>
    );
  }

  // Complete phase
  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-zinc-100 px-6">
        <div
          className="w-16 h-16 rounded-full bg-zinc-100/10 border border-zinc-100/20 mb-golden-3"
          aria-hidden="true"
        />
        <h1 className="text-golden-h1 font-semibold tracking-tight text-center">
          Pomiar zakończony
        </h1>
        <p className="text-golden-body text-zinc-400 mt-golden-2 text-center max-w-md">
          Twoja bazowa stabilność uwagi: <span className="text-zinc-100 font-semibold">{baselineSeconds}s</span>
        </p>
        <p className="text-golden-caption text-zinc-500 mt-golden-2 text-center max-w-sm">
          Ten wynik pomoże PatternLens dostosować ćwiczenia do Twojej naturalnej pojemności.
        </p>
      </div>
    );
  }

  return null;
}

export default QuietLoopSession;
