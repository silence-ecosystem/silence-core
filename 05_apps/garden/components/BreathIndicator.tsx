'use client';

import type { BreathPhase } from '@/hooks/useBreathRitual';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, timing, easing, radius } from '@/lib/tokens';

interface Props {
  phase: BreathPhase;
  progress: number;
  breathCount: number;
  maxCycles?: number;
  done: boolean;
}

export default function BreathIndicator({ phase, progress, breathCount, maxCycles = 3, done }: Props) {
  const reducedMotion = useReducedMotion();
  const scale = phase === 'idle' ? 1 : 0.8 + progress * 0.4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }} role="status" aria-live="polite" aria-atomic="true">
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          border: `2px solid ${colors.accentPrimary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          transition: reducedMotion ? 'none' : `transform ${timing.fast}ms ${easing.phiMotion}`,
        }}
        aria-label={done ? 'Breath ritual complete' : `Breath phase: ${phase}`}
      >
        <span style={{ fontSize: '1.25rem', color: colors.textPrimary }}>
          {done ? 'Done' : phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : phase === 'exhale' ? 'Exhale' : 'Ready'}
        </span>
      </div>

      <div style={{ fontSize: '1rem', color: colors.textSecondary }} aria-label={`Breath ${breathCount + 1} of ${maxCycles}`}>
        Breath {breathCount + 1} / {maxCycles}
      </div>

      {/* Breath dots */}
      <div style={{ display: 'flex', gap: '0.5rem' }} role="progressbar" aria-valuenow={breathCount} aria-valuemin={0} aria-valuemax={maxCycles} aria-label="Breath progress">
        {Array.from({ length: maxCycles }, (_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i < breathCount ? colors.accentPrimary : colors.surfaceHover,
              transition: `background-color ${timing.micro}ms ${easing.phiInOut}`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
