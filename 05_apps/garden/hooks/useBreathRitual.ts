'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BREATH_CYCLE_MS } from '@silence/phi';

export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

const INHALE_MS = 3000;
const HOLD_MS = 1854;
const EXHALE_MS = 4854;
const TOTAL_CYCLE = INHALE_MS + HOLD_MS + EXHALE_MS;

export function useBreathRitual(onComplete: (breathCount: number) => void) {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const runCycle = useCallback(
    (cycleIndex: number, maxCycles: number) => {
      if (abortRef.current || cycleIndex >= maxCycles) {
        if (!abortRef.current) {
          setIsRunning(false);
          setPhase('idle');
          onComplete(breathCount + (cycleIndex > 0 ? cycleIndex : 0));
        }
        return;
      }

      setPhase('inhale');
      setProgress(0);
      let start = performance.now();

      const animate = () => {
        if (abortRef.current) return;
        const elapsed = performance.now() - start;
        const p = Math.min(elapsed / TOTAL_CYCLE, 1);
        setProgress(p);

        if (elapsed < INHALE_MS) {
          setPhase('inhale');
        } else if (elapsed < INHALE_MS + HOLD_MS) {
          setPhase('hold');
        } else if (elapsed < TOTAL_CYCLE) {
          setPhase('exhale');
        } else {
          setBreathCount((c) => c + 1);
          setProgress(1);
          runCycle(cycleIndex + 1, maxCycles);
          return;
        }
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    },
    [breathCount, onComplete]
  );

  const start = useCallback(
    (maxCycles = 3) => {
      abortRef.current = false;
      setBreathCount(0);
      setIsRunning(true);
      setPhase('inhale');
      runCycle(0, maxCycles);
    },
    [runCycle]
  );

  const stop = useCallback(() => {
    abortRef.current = true;
    clearTimers();
    setIsRunning(false);
    setPhase('idle');
    setProgress(0);
    onComplete(breathCount);
  }, [clearTimers, breathCount, onComplete]);

  useEffect(() => {
    return () => {
      abortRef.current = true;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return { phase, breathCount, isRunning, progress, start, stop };
}
