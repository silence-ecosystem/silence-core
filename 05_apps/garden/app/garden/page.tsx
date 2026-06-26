'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGardenState } from '@/hooks/useGardenState';
import { useEffectLog } from '@/hooks/useEffectLog';
import { useJitaiSignals } from '@/hooks/useJitaiSignals';
import { useEngine } from '@/hooks/useEngine';
import GardenCanvas from '@/components/GardenCanvas';
import GardenHUD from '@/components/GardenHUD';
import SignalPanel from '@/components/SignalPanel';
import { trackSilenceEvent } from '@silence/sdk';
import { getInitialDashboardConfig } from '@/lib/quietMapping';
import { consumeRitualResult } from '@/lib/breathRitualBridge';
import { colors, timing, easing, radius } from '@/lib/tokens';

function GardenSkeleton() {
  return (
    <div style={{ padding: '1rem', maxWidth: 640, margin: '0 auto' }} aria-label="Loading garden" role="status">
      <div className="skeleton" style={{ height: 32, width: '60%', margin: '0 auto 1.5rem', background: colors.surfaceHover, borderRadius: radius.md }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 64, background: colors.surfaceHover, borderRadius: radius.md }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 280, marginBottom: '1.5rem', background: colors.surfaceHover, borderRadius: radius.md }} />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <div className="skeleton" style={{ height: 48, width: 140, background: colors.surfaceHover, borderRadius: radius.md }} />
        <div className="skeleton" style={{ height: 48, width: 140, background: colors.surfaceHover, borderRadius: radius.md }} />
      </div>
      <style jsx global>{`
        @keyframes skeletonPulse {
          0% { opacity: 0.35; }
          50% { opacity: 0.7; }
          100% { opacity: 0.35; }
        }
        .skeleton {
          animation: skeletonPulse 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function GardenPage() {
  const { state, plant, applyRitual, applyIdle, isLoading, error } = useGardenState();
  const { ready: logReady, append: appendLog } = useEffectLog();
  const { signals, evaluateRules } = useJitaiSignals(state);
  const { status: engineStatus, error: engineError } = useEngine();
  const [quietLevel, setQuietLevel] = useState<number | null>(null);
  const [layoutConfig, setLayoutConfig] = useState(getInitialDashboardConfig(null));
  const [engineLogged, setEngineLogged] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('silence-quiet-level');
      if (saved) {
        const level = Number(saved);
        if (!Number.isNaN(level) && level >= 0 && level <= 4) {
          setQuietLevel(level);
          setLayoutConfig(getInitialDashboardConfig(level));
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (isLoading || !plant) return;
    applyIdle();
  }, [isLoading, plant, applyIdle]);

  useEffect(() => {
    if (isLoading || !state || !plant) return;

    const transfer = consumeRitualResult();
    if (transfer && transfer.breathCount > 0) {
      applyRitual(transfer.breathCount);
      trackSilenceEvent({
        eventType: 'garden_growth_applied',
        timestamp: new Date().toISOString(),
        context: { breathCount: transfer.breathCount, growthLevel: plant.growthLevel, quietLevel },
      });
      if (logReady) {
        appendLog('RELEASE', 'garden-app', 'PASS', `Ritual growth applied: ${transfer.breathCount} breaths, level ${plant.growthLevel}`).catch(() => {});
      }
      evaluateRules();
    }
  }, [isLoading, state, plant, applyRitual, quietLevel, logReady, appendLog, evaluateRules]);

  useEffect(() => {
    if (engineStatus === 'ready' && !engineLogged && logReady) {
      appendLog('RELEASE', 'engine-wasm', 'PASS', 'WASM engine loaded and initialized in browser').catch(() => {});
      setEngineLogged(true);
    }
    if (engineStatus === 'error' && !engineLogged && logReady) {
      appendLog('RELEASE', 'engine-wasm', 'FAIL', `WASM engine load failed: ${engineError ?? 'unknown'}`).catch(() => {});
      setEngineLogged(true);
    }
  }, [engineStatus, engineError, engineLogged, logReady, appendLog]);

  if (isLoading || !state || !plant) {
    return <GardenSkeleton />;
  }

  if (error) {
    return (
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: colors.accentAlert, marginBottom: '1rem' }}>Garden state could not be loaded.</p>
        <p style={{ color: colors.textMuted, fontSize: '0.875rem', marginBottom: '2rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.875rem 2rem',
            borderRadius: radius.md,
            border: `1px solid ${colors.accentPrimary}`,
            background: 'transparent',
            color: colors.accentPrimary,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Reload
        </button>
      </main>
    );
  }

  const buttonBase = {
    padding: '0.875rem 2rem',
    borderRadius: radius.md,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: `border-color ${timing.micro}ms ${easing.phiInOut}, color ${timing.micro}ms ${easing.phiInOut}`,
  } as const;

  return (
    <main style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 300, letterSpacing: '0.05em', marginBottom: '0.5rem', color: colors.textPrimary }}>
        φ-Garden
      </h1>
      <GardenHUD state={state} plant={plant} />

      {layoutConfig.density !== 'standard' && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: colors.textMuted, marginBottom: '0.5rem' }}>
          Density: {layoutConfig.density} · Pace: {layoutConfig.pace}
        </p>
      )}

      <SignalPanel signals={signals} />

      <div style={{ marginTop: '1rem' }}>
        <GardenCanvas plant={plant} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <Link href="/breath" style={{ textDecoration: 'none' }}>
          <button
            aria-label="Start new breath ritual"
            style={{
              ...buttonBase,
              border: `1px solid ${colors.accentPrimary}`,
              color: colors.accentPrimary,
            }}
          >
            New Ritual
          </button>
        </Link>
        <Link href="/quiet" style={{ textDecoration: 'none' }}>
          <button
            aria-label="Enter quiet mode"
            style={{
              ...buttonBase,
              border: `1px solid ${colors.surfaceHover}`,
              color: colors.textMuted,
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = colors.textSecondary)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = colors.textMuted)}
          >
            Quiet Mode
          </button>
        </Link>
      </div>

      {engineStatus === 'error' && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: colors.accentAlert, marginTop: '1rem', opacity: 0.9 }} role="alert">
          Engine offline: {engineError}
        </p>
      )}
    </main>
  );
}
