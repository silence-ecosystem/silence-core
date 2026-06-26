'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBreathRitual } from '@/hooks/useBreathRitual';
import { useEffectLog } from '@/hooks/useEffectLog';
import BreathIndicator from '@/components/BreathIndicator';
import { trackSilenceEvent } from '@silence/sdk';
import { transferRitualResult, incrementBreathCount24h } from '@/lib/breathRitualBridge';
import { colors, timing, easing, radius } from '@/lib/tokens';

export default function BreathPage() {
  const router = useRouter();
  const { ready: logReady, append: appendLog } = useEffectLog();

  const handleComplete = useCallback(
    async (count: number) => {
      transferRitualResult(count);
      incrementBreathCount24h(count);

      trackSilenceEvent({
        eventType: 'breath_cycle_completed',
        timestamp: new Date().toISOString(),
        context: { breathCount: count },
      });

      if (logReady) {
        await appendLog(
          'RELEASE',
          'breath-app',
          'PASS',
          `Breath ritual completed: ${count} cycles`,
          'User completed a full breath ritual session.'
        ).catch(() => {});
      }

      router.push('/garden');
    },
    [router, logReady, appendLog]
  );

  const { phase, breathCount, isRunning, progress, start, stop } = useBreathRitual(handleComplete);
  const maxCycles = 3;
  const done = !isRunning && breathCount >= maxCycles;

  const buttonBase = {
    padding: '0.875rem 2rem',
    borderRadius: radius.md,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: `border-color ${timing.micro}ms ${easing.phiInOut}, color ${timing.micro}ms ${easing.phiInOut}, opacity ${timing.micro}ms ${easing.phiInOut}`,
  } as const;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontWeight: 300, letterSpacing: '0.05em', marginBottom: '2rem', color: colors.textPrimary }}>
        Breath Ritual
      </h2>

      <BreathIndicator phase={phase} progress={progress} breathCount={breathCount} maxCycles={maxCycles} done={done} />

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!isRunning && !done ? (
          <button
            onClick={() => start(maxCycles)}
            style={{
              ...buttonBase,
              border: `1px solid ${colors.accentPrimary}`,
              color: colors.accentPrimary,
            }}
          >
            Begin {maxCycles} Cycles
          </button>
        ) : done ? (
          <button
            onClick={() => router.push('/garden')}
            style={{
              ...buttonBase,
              border: `1px solid ${colors.accentPrimary}`,
              color: colors.accentPrimary,
            }}
          >
            Go to Garden →
          </button>
        ) : (
          <button
            onClick={stop}
            style={{
              ...buttonBase,
              border: `1px solid ${colors.surfaceHover}`,
              color: colors.textMuted,
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textMuted)}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
