'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { captureSessionData, getAttentionProfile } from '@/lib/jitai/sessionCapture';
import { JITAIEngine } from '@/lib/jitai/engine';
import type { AttentionProfile, GeometryModulation, Phase, SessionData } from '@/lib/jitai/types';
import { PHI, PHI_INV, GOLDENSECOND, BREATH_CYCLE_MS, SYNC_INTERVAL_MS } from '@silence/sdk';

interface GoldenRatioSilenceProps {
  duration?: number;
  onComplete?: (sessionData: SessionData) => void;
  jitaiEnabled?: boolean;
  userId?: string;
}

const DEFAULT_DURATION = BREATH_CYCLE_MS;
const SAMPLE_INTERVAL_MS = GOLDENSECOND * PHI_INV * PHI_INV; // ≈ 618 ms

const PHASES = {
  ENTRY: { start: 0, end: PHI_INV * PHI_INV * PHI_INV }, // 0 – φ⁻³
  DEEPENING: { start: PHI_INV * PHI_INV * PHI_INV, end: PHI_INV }, // φ⁻³ – φ⁻¹
  SILENCE: { start: PHI_INV, end: PHI_INV + PHI_INV ** 3 }, // φ⁻¹ – φ⁻¹+φ⁻³
  RETURN: { start: PHI_INV + PHI_INV ** 3, end: 1.0 },
} as const;

function getCurrentPhase(progress: number): Phase {
  if (progress >= PHASES.RETURN.start) return 'RETURN';
  if (progress >= PHASES.SILENCE.start) return 'SILENCE';
  if (progress >= PHASES.DEEPENING.start) return 'DEEPENING';
  return 'ENTRY';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export default function GoldenRatioSilence({
  duration = DEFAULT_DURATION,
  onComplete,
  jitaiEnabled = false,
  userId,
}: GoldenRatioSilenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const perfStartRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const currentPhaseRef = useRef<Phase>('ENTRY');
  const lastDecisionPointRef = useRef<number>(0);
  const lastSampleRef = useRef<number>(0);

  const [sessionData, setSessionData] = useState<Partial<SessionData>>({
    startedAt: 0,
    phaseTransitions: [],
    breathingPattern: [],
    interactionEvents: [],
  });
  const [jitaiProfile, setJitaiProfile] = useState<AttentionProfile | null>(null);
  const [geometryModulation, setGeometryModulation] = useState<GeometryModulation>({
    particleCount: 34,
    ringSet: [8, 13, 21, 34, 55, 89],
    breathAmplitude: PHI_INV,
    ringFadeRate: 1.0,
  });
  const [progress, setProgress] = useState(0);

  // Load JITAI profile on mount (async, deterministic read from IndexedDB)
  useEffect(() => {
    if (!jitaiEnabled) return;
    let cancelled = false;
    getAttentionProfile(userId).then((profile) => {
      if (cancelled) return;
      setJitaiProfile(profile);
      if (profile) {
        const engine = new JITAIEngine(profile);
        setGeometryModulation(engine.getGeometryModulation());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [jitaiEnabled, userId]);

  const nowMs = useCallback(
    () => startedAtRef.current + performance.now() - perfStartRef.current,
    []
  );

  const recordPhaseTransition = useCallback((from: Phase, to: Phase, p: number) => {
    setSessionData((prev) => ({
      ...prev,
      phaseTransitions: [
        ...(prev.phaseTransitions ?? []),
        { from, to, timestamp: nowMs(), progressAtTransition: p },
      ],
    }));
  }, [nowMs]);

  const recordBreathingSample = useCallback((amplitude: number, frequency: number) => {
    setSessionData((prev) => ({
      ...prev,
      breathingPattern: [
        ...(prev.breathingPattern ?? []),
        { timestamp: nowMs(), amplitude, frequency },
      ],
    }));
  }, [nowMs]);

  const recordInteraction = useCallback(
    (type: 'touch' | 'click', x: number, y: number) => {
      setSessionData((prev) => ({
        ...prev,
        interactionEvents: [...(prev.interactionEvents ?? []), { type, timestamp: nowMs(), x, y }],
      }));
    },
    [nowMs]
  );

  const evaluateDecisionPoint = useCallback(
    (p: number, phase: Phase) => {
      if (!jitaiEnabled || !jitaiProfile) return;
      if (nowMs() - lastDecisionPointRef.current < SYNC_INTERVAL_MS) return;
      const atBoundary =
        Math.abs(p - PHASES.DEEPENING.start) < 0.01 ||
        Math.abs(p - PHASES.SILENCE.start) < 0.01 ||
        Math.abs(p - PHASES.RETURN.start) < 0.01 ||
        p >= 1.0;
      if (!atBoundary) return;
      const engine = new JITAIEngine(jitaiProfile);
      const decision = engine.evaluateRealTimeDecision({
        progress: p,
        currentPhase: phase,
        sessionData: sessionData as SessionData,
        currentTimestamp: nowMs(),
      });
      if (decision?.geometryModulation) {
        setGeometryModulation((prev) => ({ ...prev, ...decision.geometryModulation }));
        lastDecisionPointRef.current = nowMs();
      }
    },
    [jitaiEnabled, jitaiProfile, sessionData, nowMs]
  );

  const handleComplete = useCallback(async () => {
    const completeSessionData: SessionData = {
      ...(sessionData as SessionData),
      userId,
      startedAt: startedAtRef.current,
      completedAt: nowMs(),
      durationMs: duration,
    };
    await captureSessionData(completeSessionData);
    onComplete?.(completeSessionData);
  }, [sessionData, duration, onComplete, userId, nowMs]);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const primary =
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#06b6d4';
    const [r, g, b] = hexToRgb(primary);

    const centerX = rect.width / 2;
    const centerY = rect.height * PHI_INV;
    const baseRadius = Math.min(rect.width, rect.height) / (PHI * PHI);

    perfStartRef.current = performance.now();
    startedAtRef.current = Date.now();
    setSessionData((prev) => ({ ...prev, startedAt: startedAtRef.current }));

    const animate = (currentTime: number) => {
      const elapsed = currentTime - perfStartRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      const phase = getCurrentPhase(p);
      if (phase !== currentPhaseRef.current) {
        recordPhaseTransition(currentPhaseRef.current, phase, p);
        currentPhaseRef.current = phase;
      }

      evaluateDecisionPoint(p, phase);

      // Clear
      ctx.fillStyle = '#07070f';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Breathing animation
      const breathCycle = (elapsed / BREATH_CYCLE_MS) % 1;
      const breathAmplitude =
        geometryModulation.breathAmplitude * Math.sin(breathCycle * Math.PI * 2) * 0.1;

      // Sample breathing pattern
      if (elapsed - lastSampleRef.current >= SAMPLE_INTERVAL_MS) {
        lastSampleRef.current = elapsed;
        recordBreathingSample(breathAmplitude, 1000 / BREATH_CYCLE_MS);
      }

      // Rings
      geometryModulation.ringSet.forEach((radius, index) => {
        const alpha =
          (1 - p * geometryModulation.ringFadeRate) *
          (1 - index / geometryModulation.ringSet.length) *
          0.3;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          (baseRadius + radius) * (1 + breathAmplitude),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      });

      // Particles (Fibonacci spiral)
      const particleCount = geometryModulation.particleCount;
      for (let i = 0; i < particleCount; i++) {
        const angle = i * PHI * Math.PI * 2;
        const distance = baseRadius * Math.sqrt(i / particleCount);
        const x = centerX + Math.cos(angle) * distance * (1 + breathAmplitude);
        const y = centerY + Math.sin(angle) * distance * (1 + breathAmplitude);

        let phaseAlpha = 0.5;
        if (phase === 'ENTRY') phaseAlpha = p / PHASES.ENTRY.end;
        else if (phase === 'DEEPENING') phaseAlpha = 1.0;
        else if (phase === 'SILENCE') {
          phaseAlpha =
            1.0 - ((p - PHASES.SILENCE.start) / (PHASES.SILENCE.end - PHASES.SILENCE.start)) * 0.5;
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${phaseAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        handleComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [duration, geometryModulation, recordPhaseTransition, recordBreathingSample, evaluateDecisionPoint, handleComplete]);

  const handleCanvasInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      recordInteraction('touches' in e ? 'touch' : 'click', x, y);
    },
    [recordInteraction]
  );

  return (
    <div className="relative w-full h-full min-h-[320px] overflow-hidden rounded-3xl bg-[#07070f]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
